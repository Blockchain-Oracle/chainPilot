# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev              # Start development server with Turbopack on port 3001
pnpm build            # Build for production with Turbopack
pnpm start            # Start production server

# Database Operations
pnpm db:generate      # Generate Drizzle migrations from schema
pnpm db:migrate       # Apply database migrations
pnpm db:push          # Push schema changes directly to database
pnpm db:studio        # Open Drizzle Studio for database management

# Testing Services
redis-cli ping        # Test Redis connectivity
psql adk_terminal -c "\dt"  # List database tables
```

## Project Context

This is an **ChainPilot** - a blockchain AI assistant that uses ADK (Agent Development Kit) with Alchemy APIs for multi-chain interactions. The project is being migrated from a VeChain terminal to support Ethereum, Base, and other EVM chains.

### Current Migration Status

The codebase is transitioning from:
- **Vercel AI SDK** → **ADK Framework** for AI agent management
- **VeChain SDK** → **Alchemy SDK + wagmi/viem** for blockchain interactions
- **VeChain Kit** → **RainbowKit** for wallet UI
- **Vercel AI tools** → **ADK FunctionTools** for tool definitions
- **Privy wallets** → **wagmi + RainbowKit** for wallet connections

## Architecture

### Core Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **AI Agent**: ADK (@iqai/adk) with Gemini model
- **Blockchain**: Alchemy SDK for multi-chain data, wagmi/viem for transactions
- **Wallet UI**: RainbowKit for wallet connections
- **Database**: PostgreSQL with Drizzle ORM
- **Session**: Redis (optional) via ADK's BaseSessionService
- **Streaming**: Server-Sent Events (SSE) for real-time agent responses

### Key Architectural Patterns

#### ADK Agent Pattern
The agent uses ADK's event streaming instead of Vercel AI's streaming:
```typescript
// ADK agent creation and streaming
const { runner } = await AgentBuilder.create("alchemy_assistant")
  .withModel("gemini-2.5-flash")
  .withTools(...tools)
  .withSessionService(redisSession)
  .build();

// Stream events via SSE
for await (const event of runner.runAsync(query, session)) {
  if (event.partial) // Text streaming
  if (event.getFunctionCalls()) // Tool calls
  if (event.getFunctionResponses()) // Tool results
}
```

#### Tool Definition Pattern
Tools are defined as ADK FunctionTools instead of Vercel AI tools:
```typescript
import { FunctionTool } from "@iqai/adk";

async function getTokenBalance(address: string, chainId?: number) {
  const alchemy = new Alchemy({ apiKey, network });
  // Implementation
  return { success: true, data: balances };
}

export const tokenBalanceTool = new FunctionTool(getTokenBalance, {
  name: "get_token_balance",
  description: "Get ERC20 token balances"
});
```

#### Multi-Chain Support
The app supports multiple EVM chains via Alchemy:
- Ethereum (mainnet/sepolia)
- Base (mainnet/sepolia)
- Arbitrum, Optimism, Polygon

### Directory Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # ADK agent SSE streaming endpoint
│   │   └── wallet/             # Wallet-related endpoints
│   ├── chat/page.tsx          # Chat interface page
│   └── layout.tsx             # Root layout with providers
├── components/
│   ├── chat/                  # Chat UI components
│   │   ├── chat-interface.tsx # Main chat component
│   │   └── message.tsx        # Message renderer
│   ├── coinbase/cards/        # Tool result UI cards
│   └── providers/             # React context providers
├── lib/
│   ├── adk/                   # ADK integration
│   │   ├── agent.ts           # Agent creation
│   │   ├── tools.ts           # Tool definitions
│   │   ├── events.ts          # Event streaming
│   │   └── redis-session.ts   # Session management
│   ├── agentkit/              # Legacy Coinbase AgentKit (being removed)
│   ├── db/                    # Database layer
│   │   ├── schema.ts          # Drizzle schema
│   │   ├── client.ts          # DB client
│   │   └── queries.ts         # Query functions
│   └── services/              # External services
│       └── alchemy.ts         # Alchemy SDK wrapper
└── hooks/                     # React hooks
```

## Migration Reference

The project follows the migration plan documented in:
`/Users/apple/dev/hackathon/ADK/VECHAIN_TO_ADK_ALCHEMY_MIGRATION.md`

Key files from the original VeChain terminal for reference:
`/Users/apple/dev/hackathon/ADK/vechain-terminal-frontend/`

### Files Being Removed
- All VeChain-specific components (`/components/vechain-*/`)
- VeChain tools (`/lib/ai/tools/*/`)
- Privy wallet integration
- Coinbase AgentKit integration

### Files Being Created
- ADK FunctionTools for Alchemy (`/lib/adk/tools/`)
- RainbowKit wallet provider (`/components/providers/web3-provider.tsx`)
- Custom ADK chat hook (`/hooks/useADKChat.tsx`)
- Alchemy service layer (`/lib/services/alchemy.ts`)

## Environment Configuration

Required environment variables:
```env
# Alchemy API
ALCHEMY_API_KEY=
NEXT_PUBLIC_ALCHEMY_API_KEY=

# WalletConnect for RainbowKit
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=

# AI Model
GOOGLE_API_KEY=

# Database
DATABASE_URL=postgresql://apple@localhost:5432/adk_terminal

# Redis (optional)
REDIS_URL=redis://localhost:6379
REDIS_SESSION_TTL=86400

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_CHAIN_ID=1
```

## Development Workflow

1. **Before implementing**: Check if the file already exists in the migrated codebase
2. **Tool creation**: Use ADK FunctionTool pattern, not Vercel AI tools
3. **Streaming**: Implement SSE streaming for ADK events, not Vercel AI streaming
4. **Wallet integration**: Use wagmi/RainbowKit, not Privy
5. **Blockchain queries**: Use Alchemy SDK, not VeChain APIs

## Testing Checklist

- [ ] ADK agent initializes with tools
- [ ] SSE streaming delivers events properly
- [ ] Redis session persistence works (if configured)
- [ ] RainbowKit wallet connection works
- [ ] Alchemy API queries return data
- [ ] Multi-chain support functions
- [ ] Tool execution and UI updates work

## Important Notes

- **NO MOCK IMPLEMENTATIONS**: All code must be functional
- **Framework Change**: This uses ADK, not Vercel AI SDK - streaming and tool patterns are different
- **Multi-chain Focus**: Support Ethereum, Base, and other EVM chains via Alchemy
- **Wallet Security**: Use wagmi/RainbowKit for client-side wallet connections