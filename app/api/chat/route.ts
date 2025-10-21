import { AgentBuilder } from "@iqai/adk";
import { getAlchemyTools } from "@/lib/adk/tools";
import { getRedisSessionService } from "@/lib/adk/redis-session";
import { NextRequest } from "next/server";
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import { generateUUID } from "@/lib/utils";
import { generateTitleFromUserMessage } from "./actions";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";
import type { ChatModel } from "@/lib/ai/models";
import type { VisibilityType } from "@/components/visibility-selector";

// Force Node.js runtime (required for Alchemy SDK)
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    console.log('[API] POST /api/chat - Request received:', {
      hasId: !!requestBody.id,
      hasMessage: !!requestBody.message,
      messageId: requestBody.message?.id,
    });

    const {
      id,
      message,
      selectedChatModel,
      selectedVisibilityType,
      walletAddress: bodyWalletAddress,
    }: {
      id: string;
      message: ChatMessage;
      selectedChatModel: string;
      selectedVisibilityType: VisibilityType;
      walletAddress?: string;
    } = requestBody;

    console.log('[API] Destructured request:', {
      id,
      messageId: message?.id,
      walletAddress: bodyWalletAddress,
    });

    // Get wallet address from request body or headers
    const walletAddress = bodyWalletAddress || request.headers.get('x-wallet-address');

    if (!walletAddress) {
      return new ChatSDKError(
        "unauthorized:api",
        "Wallet address is required. Please connect your wallet."
      ).toResponse();
    }

    // Get or create user
    let user;
    try {
      const { authenticateWallet } = await import("@/lib/auth/wallet-auth");
      user = await authenticateWallet(walletAddress);
    } catch (error) {
      console.error("Failed to authenticate wallet:", error);
      return new ChatSDKError(
        "unauthorized:api",
        "Failed to authenticate wallet"
      ).toResponse();
    }

    const messageCount = await getMessageCountByUserId({
      id: user.id,
      differenceInHours: 24,
    });

    const chat = await getChatById({ id });

    if (!chat) {
      console.log('[API] Creating new chat:', { id, userId: user.id });
      const title = await generateTitleFromUserMessage({
        message,
      });

      await saveChat({
        id,
        userId: user.id,
        title,
        visibility: selectedVisibilityType,
      });
      console.log('[API] Chat created successfully:', { id, title });
    } else {
      console.log('[API] Using existing chat:', { id, userId: chat.userId });
      if (chat.userId !== user.id) {
        console.error('[API] Forbidden: Chat user mismatch', {
          chatUserId: chat.userId,
          requestUserId: user.id
        });
        return new ChatSDKError("forbidden:chat").toResponse();
      }
    }

    const messagesFromDb = await getMessagesByChatId({ id });

    console.log('[API] Preparing to save user message:', {
      chatId: id,
      messageId: message.id,
      messageIdType: typeof message.id,
      messageIdDefined: message.id !== undefined,
      messageStructure: message,
      partsBeforeStringify: message.parts,
      partsType: typeof message.parts,
    });

    // Save user message
    const messageToSave = {
      chatId: id,
      id: message.id,
      role: "user",
      parts: JSON.stringify(message.parts),
      attachments: JSON.stringify([]),
      createdAt: new Date(),
    };

    console.log('[API] Message prepared for DB:', messageToSave);

    await saveMessages({
      messages: [messageToSave],
    });

    console.log('[API] User message saved successfully');

    // Get ADK tools
    const tools = await getAlchemyTools();

    // TEMPORARY: Use only converted tools until all are migrated
    // See TOOL_CONVERSION_GUIDE.md for conversion instructions
    const convertedTools = tools.slice(0, 1); // Only get_token_balance is converted
    console.log('[API] Using converted tools only:', convertedTools.map(t => t.name));

    // Create ADK agent WITHOUT session persistence (use in-memory only)
    console.log('[API] Building ADK agent with tools:', convertedTools.length);
    const agentBuilder = AgentBuilder.create("alchemy_assistant")
      .withModel("gemini-2.0-flash-exp")
      .withDescription("Multi-chain blockchain assistant powered by Alchemy")
      .withInstruction(`You are Alchemy Terminal, an AI assistant for multi-chain blockchain interactions powered by Alchemy APIs.

**Current Date & Time:** ${new Date().toISOString()}

## Supported Blockchains
- Ethereum (Mainnet & Sepolia Testnet)
- Base (Mainnet & Sepolia Testnet)
- Arbitrum, Optimism, Polygon

## Core Capabilities
- Query ERC20 token balances across all chains
- Get NFT ownership and metadata
- Track transactions and asset transfers
- Estimate gas costs and send transactions
- Get swap quotes and DEX data
- Resolve ENS names

## User Context
- Wallet Address: ${walletAddress}

## Safety Rules
- NEVER automatically execute transactions without user approval
- ALWAYS validate addresses (0x + 40 hex chars)
- VERIFY balances include gas fees before transfers
- PROVIDE clear transaction summaries

When users request blockchain operations:
1. Ask which chain if not specified
2. Validate all parameters
3. Show clear results with explorer links
4. Wait for confirmation on transactions`)
      .withTools(...convertedTools);

    // DO NOT add session service - let ADK use default in-memory sessions
    console.log('[API] Using in-memory sessions (no persistence)')

    console.log('[API] Building agent...');
    const { runner, agent, session } = await agentBuilder.build();
    console.log('[API] Agent built successfully:', {
      agentName: agent.name,
      hasRunner: !!runner,
      sessionId: session?.id,
      userId: session?.userId
    });

    // Create SSE stream for ADK events
    const encoder = new TextEncoder();
    const assistantMessageId = generateUUID();
    let assistantContent = "";
    let assistantToolCalls: any[] = [];

    const stream = new ReadableStream({
      async start(controller) {
        try {

          // Get the message content
          const userMessage = message.parts
            .map((part: any) => {
              if (typeof part === 'string') return part;
              if (part.type === 'text') return part.text || part.content || '';
              return '';
            })
            .join(' ');

          // Send initial message
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({
              type: "message-start",
              messageId: assistantMessageId,
              role: "assistant"
            })}\n\n`
          ));

          // Process with ADK using the correct runAsync signature
          console.log('[API] Starting ADK runner with message:', {
            messageLength: userMessage.length,
            chatId: id,
            sessionId: session?.id,
            userId: session?.userId
          });

          try {
            // Correct ADK runAsync signature from docs:
            // runAsync({ userId, sessionId, newMessage })
            for await (const event of runner.runAsync({
              userId: session.userId,
              sessionId: session.id,
              newMessage: {
                parts: [{ text: userMessage }]
              }
            })) {
              console.log('[API] Received event:', {
                partial: event.partial?.substring(0, 50),
                hasContent: !!event.content,
                contentParts: event.content?.parts?.length || 0,
                hasFunctionCalls: !!event.getFunctionCalls,
                hasFunctionResponses: !!event.getFunctionResponses,
              });

            // Stream text deltas (for streaming mode)
            if (event.partial) {
              assistantContent += event.partial;
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({
                  type: "text-delta",
                  textDelta: event.partial
                })}\n\n`
              ));
            }

            // Extract text from event content (for non-streaming final response)
            if (event.content?.parts) {
              for (const part of event.content.parts) {
                if (part.text) {
                  assistantContent += part.text;
                  controller.enqueue(encoder.encode(
                    `data: ${JSON.stringify({
                      type: "text-delta",
                      textDelta: part.text
                    })}\n\n`
                  ));
                }
              }
            }

            // Stream tool calls
            const functionCalls = event.getFunctionCalls ? event.getFunctionCalls() : null;
            if (functionCalls && functionCalls.length > 0) {
              for (const call of functionCalls) {
                const toolCall = {
                  toolName: call.name,
                  args: call.args,
                  toolCallId: call.id || crypto.randomUUID()
                };
                assistantToolCalls.push(toolCall);

                controller.enqueue(encoder.encode(
                  `data: ${JSON.stringify({
                    type: "tool-call",
                    ...toolCall
                  })}\n\n`
                ));
              }
            }

            // Stream tool results
            const functionResponses = event.getFunctionResponses ? event.getFunctionResponses() : null;
            if (functionResponses && functionResponses.length > 0) {
              for (const response of functionResponses) {
                controller.enqueue(encoder.encode(
                  `data: ${JSON.stringify({
                    type: "tool-result",
                    toolCallId: response.id,
                    result: response.result
                  })}\n\n`
                ));
              }
            }
            }
            
            console.log('[API] ADK runner completed successfully');
          } catch (runError) {
            console.error('[API] Error in ADK runner loop:', {
              error: runError,
              message: runError instanceof Error ? runError.message : String(runError),
              stack: runError instanceof Error ? runError.stack : undefined,
            });
            throw runError;
          }

          // Save assistant message
          console.log('[API] Saving assistant message:', {
            assistantMessageId,
            contentLength: assistantContent.length,
            chatId: id,
          });
          
          await saveMessages({
            messages: [
              {
                id: assistantMessageId,
                role: "assistant",
                parts: JSON.stringify([
                  { type: "text", content: assistantContent }
                ]),
                attachments: JSON.stringify([]),
                chatId: id,
                createdAt: new Date(),
              },
            ],
          });
          
          console.log('[API] Assistant message saved successfully');

          // Send completion signal
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({
              type: "finish",
              finishReason: "stop",
              messageId: assistantMessageId
            })}\n\n`
          ));
        } catch (error: any) {
          console.error("ADK Stream Error:", error);
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({
              type: "error",
              error: error?.message || "Unknown error occurred"
            })}\n\n`
          ));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    return new ChatSDKError("bad_request:api", error?.message || "Internal server error").toResponse();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const walletAddress = searchParams.get("wallet_address") || request.headers.get('x-wallet-address');

  if (!id) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  if (!walletAddress) {
    return new ChatSDKError(
      "unauthorized:api",
      "Wallet address is required. Please connect your wallet."
    ).toResponse();
  }

  try {
    // Get user from wallet address
    const { authenticateWallet } = await import("@/lib/auth/wallet-auth");
    const user = await authenticateWallet(walletAddress);

    const chat = await getChatById({ id });

    if (!chat) {
      return new ChatSDKError("not_found:api", "Chat not found").toResponse();
    }

    if (chat.userId !== user.id) {
      return new ChatSDKError("forbidden:chat").toResponse();
    }

    const deletedChat = await deleteChatById({ id });

    return Response.json(deletedChat, { status: 200 });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return new ChatSDKError(
      "bad_request:database",
      "Failed to delete chat"
    ).toResponse();
  }
}