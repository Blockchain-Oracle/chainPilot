# ChainPilot Architecture Documentation

## Overview

ChainPilot is a multi-chain blockchain AI assistant built with:
- **ADK (Agent Development Kit)** for AI agent management
- **Next.js 15** with App Router
- **Alchemy** for blockchain data
- **wagmi/viem** for wallet interactions
- **VeChain Design System** for UI

---

## Architecture Principles

### ✅ What We Follow

1. **ADK-First**: Let ADK handle conversation state and message persistence through sessions
2. **Server Actions**: Use Next.js server actions for simple, type-safe API calls
3. **Explicit Session Management**: Always use `.withSession(session)` for context persistence
4. **Tool State Management**: Use `context.state` in tools to track queries across turns
5. **Generative UI**: Render rich UI components for tool results (cards, charts, etc.)

### ❌ What We Avoid

1. **Complex SSE Streaming**: Not needed for simple chat - ADK handles it
2. **Manual Message Persistence**: Don't duplicate message storage - ADK sessions handle this
3. **API Routes for Chat**: Server actions are simpler and more maintainable
4. **Forgetting Session Context**: Always pass session explicitly with `.withSession()`

---

## File Structure

```
adk-coinbase-terminal/
├── app/
│   ├── _actions/
│   │   └── chat.ts                 # Server actions (askChainPilot, createNewChat)
│   ├── api/
│   │   └── history/
│   │       └── route.ts            # Chat history API for sidebar
│   ├── chat/
│   │   ├── page.tsx                # Home page (auto-creates chat)
│   │   ├── [id]/page.tsx           # Chat page by ID
│   │   └── simple/page.tsx         # Alternative simple chat route
│   └── layout.tsx                  # Root layout with providers
├── components/
│   ├── enhanced-chat.tsx           # Main chat UI with generative UI
│   ├── simple-chat.tsx             # Fallback simple chat UI
│   ├── tool-result-cards.tsx       # Generative UI cards for tool results
│   ├── sidebar-history.tsx         # Chat history sidebar
│   └── sidebar-history-item.tsx    # Individual chat item
├── lib/
│   ├── adk/
│   │   ├── agent.ts                # Agent builder with session management
│   │   └── tools/                  # All ADK tools
│   │       ├── account/            # Balance, token queries
│   │       ├── nfts/               # NFT queries
│   │       ├── transactions/       # Transaction preparation
│   │       └── utils/              # ENS, gas prices
│   ├── services/
│   │   └── alchemy.ts              # Alchemy service (RPC calls)
│   ├── auth/
│   │   └── wallet-auth.ts          # Wallet authentication
│   └── db/
│       ├── schema.ts               # Drizzle ORM schema
│       └── queries.ts              # Database queries
└── docs/
    ├── ARCHITECTURE.md             # This file
    ├── REFACTOR_SUMMARY.md         # Refactor details
    └── DESIGN_SYSTEM_REFACTOR.md   # Design system docs
```

---

## Core Components

### 1. Agent Builder (`lib/adk/agent.ts`)

**Purpose**: Creates ChainPilot agent with proper session management

**Key Pattern**:
```typescript
export const createChainPilotAgent = async ({
  userId,
  sessionId,
  walletAddress,
}: CreateAgentOptions) => {
  const sessionService = createDatabaseSessionService(process.env.DATABASE_URL);

  // Get or create session (CRITICAL!)
  let session = await sessionService.getSession(APP_NAME, userId, sessionId);
  if (!session) {
    const initialState = {
      wallet_address: walletAddress,
      interaction_history: [],
    };
    session = await sessionService.createSession(APP_NAME, userId, initialState, sessionId);
  }

  const tools = await getAlchemyTools();

  // Build agent with EXPLICIT session passing (critical for context)
  const { runner } = await AgentBuilder.create("chainpilot")
    .withModel(modelName)
    .withDescription("Multi-chain blockchain assistant")
    .withInstruction(`...conversation context instructions...`)
    .withTools(...tools)
    .withSessionService(sessionService, { userId, appName: APP_NAME })
    .withSession(session)  // ← THIS IS CRITICAL!
    .build();

  return { runner, session, sessionService };
};
```

**Why `.withSession()` is Critical**:
- Without it, ADK creates a new session on every message
- Context gets lost between turns
- User says "check balance" → "Sepolia" → AI forgets the balance request

---

### 2. Server Actions (`app/_actions/chat.ts`)

**Purpose**: Simple server-side functions for chat operations

**Why Server Actions > API Routes**:
- Type-safe (TypeScript inference)
- No manual request/response handling
- Automatic error boundaries
- No complex SSE streaming needed

**Example**:
```typescript
"use server";

export async function askChainPilot(
  message: string,
  chatId: string,
  walletAddress: string
) {
  // Authenticate wallet
  const user = await authenticateWallet(walletAddress);

  // Create or get agent with proper session
  const { runner } = await createChainPilotAgent({
    userId: user.id,
    sessionId: chatId,
    walletAddress,
  });

  // Ask the agent - ADK handles history automatically
  const result = await runner.ask(message);

  return { success: true, response: result };
}
```

---

### 3. Tools with `context.state` (`lib/adk/tools/`)

**Purpose**: Track queries and results across conversation turns

**Pattern**:
```typescript
export const balanceTool = createTool({
  name: 'get_balance',
  description: 'Get native token balance',
  schema: z.object({
    address: z.string(),
    chainId: z.number().optional().default(1),
  }),
  fn: async ({ address, chainId = 1 }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'get_balance',
      address,
      chainId,
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember the last queried chain for context
    context.state.set('last_chain_id', chainId);
    context.state.set('last_address', address);

    const alchemy = getAlchemyService();
    const balance = await alchemy.getNativeBalance(address, chainId);

    const result = {
      success: true,
      data: {
        address,
        balance: balance.balance,
        symbol: balance.symbol,
        chain: balance.chainName,
        chainId,
      },
    };

    // Cache the result in state for quick reference
    context.state.set('last_balance_result', result.data);

    return result;
  }
});
```

**Why This Matters**:
- AI can reference previous queries: "how about on Base?" (remembers we were checking balance)
- Reduces user frustration by maintaining context
- Enables smart follow-ups without repeating information

---

### 4. Generative UI (`components/tool-result-cards.tsx`)

**Purpose**: Render beautiful cards for tool results instead of plain JSON

**Example Cards**:
- **BalanceCard**: Shows token balance with icon, chain, address
- **TokenPriceCard**: Shows price with 24h change (green/red)
- **NFTCollectionCard**: Shows collection name, total NFTs, floor price
- **GasPriceCard**: Shows slow/standard/fast gas prices
- **TransactionPreparedCard**: Shows from/to/amount/gas estimate

**Usage in Chat**:
```typescript
export function ToolResultCard({ toolName, result }: { toolName: string; result: any }) {
  switch (toolName) {
    case 'get_balance':
      return <BalanceCard data={result.data} />;
    case 'get_token_price':
      return <TokenPriceCard data={result.data} />;
    // ...more cases
    default:
      return <DataCard data={result} />;
  }
}
```

---

### 5. Enhanced Chat UI (`components/enhanced-chat.tsx`)

**Purpose**: Main chat interface with support for structured tool results

**Features**:
- Parses agent responses to detect tool results
- Renders tool result cards automatically
- Handles both text and structured content
- Smooth animations with Framer Motion
- VeChain design system styling

**Message Structure**:
```typescript
type MessagePart = {
  type: "text" | "tool_call" | "tool_result";
  text?: string;
  tool_name?: string;
  tool_result?: any;
};

type Message = {
  role: "user" | "agent";
  content: string | MessagePart[];  // Can be simple string or structured parts
  id: string;
};
```

---

### 6. Database Schema (`lib/db/schema.ts`)

**Purpose**: Store chat metadata for sidebar history (NOT messages!)

**Why We Don't Store Messages**:
- ADK handles message persistence through sessions
- Storing them again would be duplication
- ADK's session storage is more reliable for conversation context

**What We DO Store**:
```sql
-- User table (wallet addresses)
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  address TEXT NOT NULL
);

-- Chat table (chat metadata for sidebar)
CREATE TABLE "Chat" (
  id TEXT PRIMARY KEY,
  createdAt TIMESTAMP NOT NULL,
  title TEXT NOT NULL,
  userId TEXT NOT NULL REFERENCES "User"(id),
  visibility TEXT NOT NULL DEFAULT 'private'
);
```

**Why This Works**:
- Sidebar shows chat list from `Chat` table
- Clicking a chat loads its ID
- Agent fetches messages from ADK session using that ID
- No duplicate storage!

---

## Data Flow

### Creating a New Chat

```
User connects wallet
    ↓
/chat page auto-creates chat
    ↓
createNewChat(walletAddress)
    ↓
1. Authenticate wallet → get User
2. Generate chatId (UUID)
3. Save Chat record to DB (for sidebar)
4. Initialize ADK agent with session
    ↓
Redirect to /chat/[chatId]
```

### Sending a Message

```
User types message
    ↓
EnhancedChat.handleSubmit()
    ↓
askChainPilot(message, chatId, walletAddress)
    ↓
1. Authenticate wallet → get User
2. Create/get agent with session
3. runner.ask(message)
    ↓
ADK:
  - Loads previous messages from session
  - Processes message with tools
  - Returns response
    ↓
Parse response (text vs tool result)
    ↓
Render message with appropriate UI:
  - Text → simple message bubble
  - Tool result → ToolResultCard
```

### Loading Chat History (Sidebar)

```
Sidebar mounts
    ↓
SidebarHistory component
    ↓
useSWRInfinite → /api/history?limit=20
    ↓
GET /api/history/route.ts
    ↓
1. Authenticate wallet from headers
2. getChatsByUserId(userId)
3. Return paginated chats
    ↓
Group by date (today, yesterday, last week, etc.)
    ↓
Render ChatItem for each chat
    ↓
Click → navigate to /chat/[id]
```

---

## Key Learnings

### What We Fixed

1. **Context Loss** ❌ → ✅
   - **Problem**: AI forgot previous messages
   - **Root Cause**: Not passing session with `.withSession()`
   - **Solution**: Explicit session management in agent builder

2. **Duplicate Cards** ❌ → ✅
   - **Problem**: Tool results appearing twice
   - **Root Cause**: Manual message persistence + ADK persistence
   - **Solution**: Let ADK handle all message persistence

3. **Complex Architecture** ❌ → ✅
   - **Problem**: SSE streaming, manual history, complex API routes
   - **Root Cause**: Following wrong patterns (Vercel AI SDK style)
   - **Solution**: Follow ADK starter templates (simple-agent, TaskMaster)

### Best Practices

1. **Always use `.withSession(session)`** - Critical for context
2. **Use `context.state` in tools** - Enables smart follow-ups
3. **Let ADK handle messages** - Don't duplicate storage
4. **Server actions > API routes** - Simpler and type-safe
5. **Follow starter templates** - They exist for a reason!

---

## Testing

### Test Context Persistence

```
You: "Check my balance"
AI: "Which chain would you like to check?"
You: "Sepolia"
AI: ✅ Should remember you want balance and check Sepolia ETH balance
```

### Test Multi-Turn Conversations

```
You: "What's my ETH balance?"
AI: "Which chain?"
You: "Ethereum mainnet"
AI: Shows balance
You: "How about Base?"
AI: ✅ Should remember we're talking about balance
```

### Test Sidebar

```
1. Create a new chat
2. Send a few messages
3. Check sidebar - chat should appear in "Today" section
4. Click chat - should load with correct context
```

---

## Deployment

### Environment Variables

```bash
# Required
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_ALCHEMY_API_KEY="..."

# Wallet Connect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="..."

# Model (optional)
OPENAI_API_KEY="..."          # For GPT models
GOOGLE_API_KEY="..."          # For Gemini models
```

### Database Setup

```bash
# Push schema to database
pnpm drizzle-kit push

# Or generate and run migrations
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### Build and Run

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

---

## Future Enhancements

### Phase 1: Enhanced UI
- [ ] Add transaction execution (wallet signing)
- [ ] Add more tool result card types
- [ ] Add charts for price history
- [ ] Add NFT image galleries

### Phase 2: Advanced Features
- [ ] Multi-wallet support
- [ ] Transaction history with filtering
- [ ] Portfolio tracking
- [ ] Price alerts

### Phase 3: Scale
- [ ] Streaming responses for long operations
- [ ] Rate limiting per wallet
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

---

## Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Docs**: This file and `/docs` folder
- **ADK Docs**: [ADK Documentation](https://docs.iqai.dev)

---

**Last Updated**: 2025-01-22
**Version**: 2.0.0 (Refactored with ADK patterns)
