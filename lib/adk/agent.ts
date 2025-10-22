/**
 * ChainPilot Agent Builder
 *
 * Creates and configures the main ChainPilot agent with proper session management
 * following ADK best practices from starter templates
 */

import { AgentBuilder, createDatabaseSessionService } from "@iqai/adk";
import { getAlchemyTools } from "./tools";

const APP_NAME = "chainpilot";

export interface CreateAgentOptions {
  userId: string;
  sessionId: string;
  walletAddress: string;
  modelName?: string;
}

/**
 * Creates or retrieves the ChainPilot agent with proper session management
 * Follows the TaskMaster pattern for session handling
 */
export const createChainPilotAgent = async ({
  userId,
  sessionId,
  walletAddress,
  modelName = "gpt-4o",
}: CreateAgentOptions) => {
  // Initialize session service
  const sessionService = createDatabaseSessionService(
    process.env.DATABASE_URL || 'postgresql://apple@localhost:5432/adk_terminal'
  );

  // Get or create session
  let session = await sessionService.getSession(APP_NAME, userId, sessionId);

  if (!session) {
    // Create new session with initial state
    const initialState = {
      wallet_address: walletAddress,
      interaction_history: [],
    };

    session = await sessionService.createSession(
      APP_NAME,
      userId,
      initialState,
      sessionId
    );
  }

  // Get Alchemy tools
  const tools = await getAlchemyTools();

  // Build agent with explicit session
  const { runner } = await AgentBuilder.create("chainpilot")
    .withModel(modelName)
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
- Estimate gas costs and prepare transactions
- Get swap quotes and DEX data
- Resolve ENS names

## User Context
- Wallet Address: ${walletAddress}

## Conversation Guidelines
- ALWAYS remember the context of the conversation
- If user mentions a chain (like "Sepolia"), remember it for the entire conversation
- When user asks to "check balance" and then says "Sepolia", understand they want balance on Sepolia
- Keep track of what the user is trying to accomplish across multiple messages
- Don't forget the user's intent when they provide additional details

## Safety Rules
- NEVER automatically execute transactions without user approval
- ALWAYS validate addresses (0x + 40 hex chars)
- VERIFY balances include gas fees before transfers
- PROVIDE clear transaction summaries

When users request blockchain operations:
1. Remember the context of what they're asking for
2. Ask which chain if not specified, but remember their answer
3. Validate all parameters
4. Show clear results with explorer links
5. Wait for confirmation on transactions

Answer in plain text, use emojis for better formatting, but don't use markdown except for lists.`)
    .withTools(...tools)
    .withSessionService(sessionService, { userId, appName: APP_NAME })
    .withSession(session)  // CRITICAL: Explicitly pass the session for context persistence
    .build();

  return { runner, session, sessionService };
};
