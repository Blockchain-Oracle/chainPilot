"use server";

import { createChainPilotAgent } from "@/lib/adk/agent";
import { authenticateWallet } from "@/lib/auth/wallet-auth";
import { saveChat } from "@/lib/db/queries";

/**
 * Server action to get chat history from ADK session
 */
export async function getChatHistory(chatId: string, walletAddress: string) {
  try {
    const user = await authenticateWallet(walletAddress);
    const { runner, sessionService } = await createChainPilotAgent({
      userId: user.id,
      sessionId: chatId,
      walletAddress,
    });

    // Get session from session service
    const session = await sessionService.getSession("chainpilot", user.id, chatId);

    console.log('[getChatHistory] Session found with', session?.events?.length || 0, 'events');

    if (!session || !session.events || session.events.length === 0) {
      console.log('[getChatHistory] No events found, returning empty');
      return {
        success: true,
        messages: [],
      };
    }

    // ADK stores messages in session.events, not session.state.history!
    const events = session.events;

    console.log('[getChatHistory] Processing', events.length, 'events');
    console.log('[getChatHistory] First event:', events[0]);

    // Parse events into messages
    const messages: any[] = [];

    for (const event of events) {
      console.log('[getChatHistory] Processing event:', { id: event.id, author: event.author });

      // Get content from event
      const content = event.content;
      if (!content || !content.parts) {
        console.log('[getChatHistory] Event has no content.parts, skipping');
        continue;
      }

      if (event.author === "user") {
        // User message
        const textContent = content.parts
          .filter((p: any) => p.text)
          .map((p: any) => p.text)
          .join(" ");

        if (textContent) {
          messages.push({
            role: "user",
            content: textContent,
            id: event.id,
          });
        }
      } else if (event.author === "chainpilot") {
        // Agent message - extract text and tool results
        const parts: any[] = [];
        let hasContent = false;

        // Extract tool results using getFunctionResponses() helper
        const functionResponses = event.getFunctionResponses?.() || [];
        for (const fnResp of functionResponses) {
          console.log('[getChatHistory] Found tool result:', fnResp.name);
          parts.push({
            type: "tool_result",
            tool_name: fnResp.name,
            tool_result: fnResp.response,
          });
          hasContent = true;
        }

        // Extract text
        const textContent = content.parts
          .filter((p: any) => p.text)
          .map((p: any) => p.text)
          .join(" ");

        if (textContent) {
          parts.push({
            type: "text",
            text: textContent,
          });
          hasContent = true;
        }

        if (hasContent) {
          messages.push({
            role: "agent",
            content: parts,
            id: event.id,
          });
        }
      }
    }

    console.log('[getChatHistory] Final parsed messages:', messages.length);

    return {
      success: true,
      messages,
    };
  } catch (error) {
    console.error("Error getting chat history:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load history",
      messages: [],
    };
  }
}

/**
 * Server action to send a message to the ChainPilot agent
 * Returns both the text response AND structured tool results for generative UI
 */
export async function askChainPilot(
  message: string,
  chatId: string,
  walletAddress: string
) {
  try {
    // Authenticate wallet
    const user = await authenticateWallet(walletAddress);

    // Create or get agent with proper session
    const { runner, sessionService } = await createChainPilotAgent({
      userId: user.id,
      sessionId: chatId,
      walletAddress,
    });

    // Get session before asking to count events
    const sessionBefore = await sessionService.getSession("chainpilot", user.id, chatId);
    const eventsBefore = sessionBefore?.events?.length || 0;

    console.log('[askChainPilot] Events before ask:', eventsBefore);

    // Ask the agent and get response
    const textResponse = await runner.ask(message);

    console.log('[askChainPilot] Text response received:', textResponse);

    // Small delay to ensure session is persisted
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get the updated session to extract tool results from NEW events
    const sessionAfter = await sessionService.getSession("chainpilot", user.id, chatId);
    const eventsAfter = sessionAfter?.events || [];

    console.log('[askChainPilot] Events after ask:', eventsAfter.length);
    console.log('[askChainPilot] All events:', eventsAfter.map(e => ({ id: e.id, author: e.author, hasFunctionResponses: (e.getFunctionResponses?.() || []).length })));

    // Extract NEW events (events added during this turn)
    const newEvents = eventsAfter.slice(eventsBefore);

    console.log('[askChainPilot] New events count:', newEvents.length);

    // Parse tool results from the new events
    const toolResults: any[] = [];
    for (const event of newEvents) {
      console.log('[askChainPilot] Processing event:', { id: event.id, author: event.author });
      console.log('[askChainPilot] Event content.parts:', event.content?.parts);

      // Check for function responses in content.parts
      if (event.content?.parts) {
        for (const part of event.content.parts) {
          console.log('[askChainPilot] Part type:', part);

          // Check if part has functionResponse
          if (part.functionResponse) {
            console.log('[askChainPilot] Found functionResponse:', part.functionResponse.name);
            toolResults.push({
              toolName: part.functionResponse.name,
              result: part.functionResponse.response,
            });
          }
        }
      }

      // Also try getFunctionResponses() helper
      const functionResponses = event.getFunctionResponses?.() || [];
      console.log('[askChainPilot] Function responses via helper:', functionResponses.length);

      if (functionResponses.length > 0) {
        for (const fnResp of functionResponses) {
          console.log('[askChainPilot] Found tool result via helper:', fnResp.name);
          toolResults.push({
            toolName: fnResp.name,
            result: fnResp.response,
          });
        }
      }
    }

    console.log('[askChainPilot] Final toolResults:', toolResults);

    return {
      success: true,
      response: textResponse,
      toolResults: toolResults.length > 0 ? toolResults : undefined,
    };
  } catch (error) {
    console.error("Error asking ChainPilot:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get response",
    };
  }
}

/**
 * Server action to create a new chat
 * Saves chat record to database for sidebar history
 */
export async function createNewChat(walletAddress: string) {
  try {
    const user = await authenticateWallet(walletAddress);
    const chatId = crypto.randomUUID();

    // Save chat to database for sidebar history
    await saveChat({
      id: chatId,
      userId: user.id,
      title: "New Chat",
      visibility: "private",
    });

    // Initialize agent with new session
    await createChainPilotAgent({
      userId: user.id,
      sessionId: chatId,
      walletAddress,
      modelName: "gpt-4o",
    });

    return {
      success: true,
      chatId,
    };
  } catch (error) {
    console.error("Error creating chat:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create chat",
    };
  }
}
