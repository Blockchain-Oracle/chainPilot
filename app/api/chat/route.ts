import { AgentBuilder, StreamingMode, RunConfig, createDatabaseSessionService } from "@iqai/adk";
import { getAlchemyTools } from "@/lib/adk/tools";
import { getModelConfig } from "@/lib/ai/model-config";
import { NextRequest } from "next/server";
import {
  getChatById,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import { generateUUID } from "@/lib/utils";
import { generateTitleFromUserMessage } from "./actions";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";

// Force Node.js runtime (required for Alchemy SDK)
export const runtime = 'nodejs';
export const maxDuration = 60;

// Create ADK database session service (reused across requests)
// This will automatically create the required tables if they don't exist
const adkSessionService = createDatabaseSessionService(
  process.env.DATABASE_URL || 'postgresql://apple@localhost:5432/adk_terminal'
);

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    const {
      id,
      message,
      selectedChatModel,
      walletAddress: bodyWalletAddress,
    }: {
      id: string;
      message: ChatMessage;
      selectedChatModel?: string;
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

    // Get or create chat
    const chat = await getChatById({ id });

    if (!chat) {
      // Extract text content for title generation
      const textContent = message.parts
        .map((part: any) => {
          if (typeof part === 'string') return part;
          if (part.type === 'text' && part.text) return part.text;
          if (part.content) return part.content;
          return '';
        })
        .join(' ')
        .trim();
      
      // Create a simple message object for title generation
      const titleMessage = {
        id: message.id,
        role: message.role,
        parts: [{ type: 'text', text: textContent }],
        createdAt: new Date()
      };
      
      const title = await generateTitleFromUserMessage({ 
        message: titleMessage, 
        selectedModel: selectedChatModel 
      });

      await saveChat({
        id,
        userId: user.id,
        title,
        visibility: 'private',
      });
    } else {
      if (chat.userId !== user.id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }
    }

    // Get the message content
    const userMessage = message.parts
      .map((part: any) => {
        if (typeof part === 'string') return part;
        if (part.type === 'text') return part.text || part.content || '';
        return '';
      })
      .join(' ');

    // Save user message to DB (for UI/sidebar display only)
    await saveMessages({
      messages: [{
        chatId: id,
        id: message.id,
        role: "user",
        parts: JSON.stringify(message.parts),
        attachments: JSON.stringify([]),
        createdAt: new Date(),
      }],
    });

    // Get model configuration
    const modelConfig = getModelConfig(selectedChatModel);

    // Get ADK tools
    const tools = await getAlchemyTools();

    // Build agent with ADK's database session service
    // Check if session exists first to avoid duplicate key errors
    let existingSession;
    try {
      existingSession = await adkSessionService.getSession("chainpilot", user.id, id);
    } catch (error) {
      // Session doesn't exist yet, will be created
      existingSession = null;
    }

    const builder = AgentBuilder.create("chainpilot")
      .withModel(modelConfig.model)
      .withDescription("Multi-chain blockchain assistant powered by Alchemy")
      .withInstruction(`You are ChainPilot, an AI assistant for multi-chain blockchain interactions powered by Alchemy APIs.

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

    // Add session service - only provide sessionId if session doesn't exist yet
    if (existingSession) {
      // Session exists, just attach the session service without sessionId
      builder.withSessionService(adkSessionService);
    } else {
      // New session, let ADK create it with our custom ID
      builder.withSessionService(adkSessionService, {
        userId: user.id,
        appName: "chainpilot",
        sessionId: id, // Use chat ID as session ID for consistency
      });
    }

    // Build agent - ADK will use existing session or create new one
    const { runner, session } = await builder.build();

    // Create SSE stream from ADK events
    const encoder = new TextEncoder();
    let assistantMessageId = generateUUID();
    let assistantContent = '';
    let messageParts: any[] = []; // Track ALL parts (tool calls + results)

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const runConfig = new RunConfig();
          runConfig.streamingMode = StreamingMode.SSE;

          // ADK automatically loads conversation history from the session
          for await (const event of runner.runAsync({
            userId: user.id,
            sessionId: session.id,
            newMessage: { parts: [{ text: userMessage }] },
            runConfig
          })) {
            // Handle text streaming (partial chunks)
            if (event.partial && event.content?.parts?.[0]?.text) {
              const textChunk = event.content.parts[0].text;
              assistantContent += textChunk;

              const sseData = {
                type: 'text-delta',
                id: assistantMessageId,
                content: textChunk
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`));
            }

            // Handle complete responses (non-streaming fallback)
            // Only send if we haven't accumulated any content yet (meaning streaming didn't work)
            if (!event.partial && event.content?.parts?.[0]?.text && assistantContent === '') {
              const fullText = event.content.parts[0].text;
              assistantContent += fullText;

              const data = JSON.stringify({
                type: 'text-delta',
                id: assistantMessageId,
                content: fullText
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }

            // Handle tool calls
            const toolCalls = event.getFunctionCalls?.();
            if (toolCalls && toolCalls.length > 0) {
              for (const toolCall of toolCalls) {
                // Add tool call part to messageParts for persistence
                messageParts.push({
                  type: `tool-${toolCall.name}`,
                  toolCallId: toolCall.id,
                  args: toolCall.args,
                  state: 'input-available',
                });

                const data = JSON.stringify({
                  type: 'tool-call',
                  toolCallId: toolCall.id,
                  toolName: toolCall.name,
                  args: toolCall.args
                });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            }

            // Handle tool results
            const toolResults = event.getFunctionResponses?.();
            if (toolResults && toolResults.length > 0) {
              for (const result of toolResults) {
                // Update the corresponding tool part with result
                messageParts = messageParts.map(part => {
                  if (part.toolCallId === result.id) {
                    return {
                      ...part,
                      output: result.response,
                      state: 'output-available',
                    };
                  }
                  return part;
                });

                const sseData = {
                  type: 'tool-result',
                  toolCallId: result.id,
                  toolName: result.name,
                  result: result.response
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`));
              }
            }
          }

          // Build complete parts array with text + tools
          const completeParts = [
            ...messageParts,
            ...(assistantContent ? [{ type: 'text', text: assistantContent }] : [])
          ];

          // Save assistant message with ALL parts (text + tool results)
          if (completeParts.length > 0) {
            await saveMessages({
              messages: [{
                chatId: id,
                id: assistantMessageId,
                role: "assistant",
                parts: JSON.stringify(completeParts),
                attachments: JSON.stringify([]),
                createdAt: new Date(),
              }],
            });
          }

          // Send finish event
          const finishData = JSON.stringify({ type: 'finish' });
          controller.enqueue(encoder.encode(`data: ${finishData}\n\n`));
          controller.close();
        } catch (error: any) {
          console.error('[API] ADK streaming error:', error);
          const errorData = JSON.stringify({
            type: 'error',
            error: error?.message || 'Streaming failed'
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
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
    const { authenticateWallet } = await import("@/lib/auth/wallet-auth");
    const user = await authenticateWallet(walletAddress);

    const chat = await getChatById({ id });

    if (!chat) {
      return new ChatSDKError("not_found:api", "Chat not found").toResponse();
    }

    if (chat.userId !== user.id) {
      return new ChatSDKError("forbidden:chat").toResponse();
    }

    const { deleteChatById } = await import("@/lib/db/queries");
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
