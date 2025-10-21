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

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

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
      const title = await generateTitleFromUserMessage({
        message,
      });

      await saveChat({
        id,
        userId: user.id,
        title,
        visibility: selectedVisibilityType,
      });
    } else {
      if (chat.userId !== user.id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }
    }

    const messagesFromDb = await getMessagesByChatId({ id });

    // Save user message
    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: "user",
          parts: JSON.stringify(message.parts),
          attachments: JSON.stringify([]),
          createdAt: new Date(),
        },
      ],
    });

    // Get ADK tools and services
    const tools = await getAlchemyTools();
    const sessionService = getRedisSessionService();

    // Create ADK agent with proper session handling
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
      .withTools(...tools);

    // Only add session service if it exists
    if (sessionService) {
      agentBuilder.withSessionService(sessionService);
    }

    const { runner } = await agentBuilder.build();

    // Create SSE stream for ADK events
    const encoder = new TextEncoder();
    const assistantMessageId = generateUUID();
    let assistantContent = "";
    let assistantToolCalls: any[] = [];

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Get or create session
          let session;
          if (sessionService) {
            session = await sessionService.getSession(
              "alchemy_assistant",
              user.id,
              id
            );

            if (!session) {
              session = await sessionService.createSession(
                "alchemy_assistant",
                user.id,
                {},
                id
              );
            }
          }

          // Get the message content
          const userMessage = message.parts
            .map((part: any) => {
              if (typeof part === 'string') return part;
              if (part.type === 'text') return part.content;
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

          // Process with ADK - correct format with newMessage structure
          for await (const event of runner.runAsync({
            userId: user.id,
            sessionId: id,
            newMessage: {
              role: 'user',
              parts: [{ text: userMessage }]
            }
          })) {
            // Stream text deltas
            if (event.partial) {
              assistantContent += event.partial;
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({
                  type: "text-delta",
                  textDelta: event.partial
                })}\n\n`
              ));
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

          // Save assistant message
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