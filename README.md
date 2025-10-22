# ChainPilot

<div align="center">
  <img src="./public/logo.png" alt="ChainPilot Logo" width="120" />

  <h3>AI Agents that Act, not just chat.</h3>

  <p>A minimal, intelligent terminal for on-chain actions, insights, and execution — designed for professionals building the next wave of agentic finance.</p>

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://chainpilot-adk.vercel.app)
  [![ADK-TS](https://img.shields.io/badge/Built%20with-ADK--TS-blue)](https://adk.iqai.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

  <br />

  <p><strong>Powered by</strong></p>
  <img src="./public/adk.webp" alt="ADK Logo" width="80" />
</div>

---

## Project Overview

**ChainPilot** is a sophisticated AI-powered blockchain interface that transforms complex Web3 operations into natural language conversations. Built specifically for the ADK-TS Hackathon 2025, this project demonstrates the power of AI agents in the Web3 ecosystem by providing seamless multi-chain blockchain interactions through conversational AI.

### Key Features

- **Conversational AI Interface**: Natural language commands for blockchain operations
- **Multi-Chain Support**: Ethereum, Base, Polygon, Arbitrum, Optimism, and more
- **Real-time Balance Tracking**: Monitor assets across all connected chains
- **NFT Portfolio Management**: View and analyze NFT collections
- **Transaction Preparation**: Smart contract interactions and token transfers
- **Gas Optimization**: Real-time gas price monitoring and optimization
- **Professional UI**: OpenAI-inspired minimal design language

---

## ADK-TS Implementation

<div align="center">
  <img src="./public/adk.webp" alt="Agent Development Kit" width="100" />
  <br />
  <br />
</div>

This project demonstrates **comprehensive and advanced utilization** of the **Agent Development Kit for TypeScript (ADK-TS)** framework, showcasing sophisticated agent architecture, custom tool development, and enterprise-grade session management specifically built for the ADK-TS Hackathon 2025.

### ADK-TS Framework Integration

**ChainPilot** leverages ADK-TS as its core foundation, utilizing every major component of the framework:

- **AgentBuilder**: Dynamic agent creation with proper configuration
- **Custom Tools**: 20+ blockchain-specific tools using `createTool()` pattern
- **Session Management**: Redis-backed persistence with automatic cleanup
- **Streaming**: Built-in SSE streaming for real-time AI responses
- **Type Safety**: Full TypeScript integration with Zod validation schemas
- **Tool Composition**: Modular architecture for blockchain operations

### Core ADK-TS Components Used

#### 1. **AgentBuilder Architecture**
```typescript
// Dynamic agent creation with proper session management
const agent = await AgentBuilder.create({
  model: modelConfig.model,
  tools: await getAlchemyTools(),
  streamingMode: StreamingMode.Streaming,
})
  .withSessionService(sessionService)
  .withQuickSession(`chat-${id}`)
  .build();
```

#### 2. **Custom Tool Development**
Built **20+ specialized blockchain tools** using ADK-TS's `createTool()` pattern, demonstrating advanced tool composition:

```typescript
// Example: Balance tool using ADK-TS createTool()
export const balanceTool = createTool({
  name: 'get_balance',
  description: 'Get native token balance for a wallet address',
  parameters: z.object({
    address: z.string().describe('Wallet address to query'),
    chain: z.string().optional().describe('Blockchain network')
  }),
  func: async ({ address, chain = 'ethereum' }) => {
    // Implementation using Alchemy SDK
    const alchemy = getAlchemyClient(chain);
    const balance = await alchemy.core.getBalance(address);
    return { success: true, data: { address, balance: balance.toString(), chain } };
  }
});
```

**Tool Categories Implemented:**
- **Account Operations**: Balance queries, transaction history
- **Token Management**: Balance tracking, metadata, price data  
- **NFT Operations**: Collection analysis, metadata retrieval, floor prices
- **Transaction Preparation**: ETH transfers, token transfers, contract calls
- **Utility Functions**: ENS resolution, gas price monitoring

#### 3. **Session Management**
Implemented enterprise-grade session management using ADK-TS's session service architecture:

```typescript
// Redis-backed session persistence with ADK-TS
const sessionService = getRedisSessionService({
  ttl: 24 * 60 * 60, // 24 hours
  prefix: 'chat-session',
});

// ADK-TS session integration
const agent = await AgentBuilder.create({
  model: modelConfig.model,
  tools: await getAlchemyTools(),
  streamingMode: StreamingMode.Streaming,
})
  .withSessionService(sessionService)  // ADK-TS session management
  .withQuickSession(`chat-${id}`)     // ADK-TS quick session
  .build();
```

#### 4. **Streaming Integration**
Leveraged ADK-TS's built-in streaming capabilities for real-time AI responses, eliminating manual SSE implementation:

```typescript
// ADK-TS streaming - no manual SSE needed!
const stream = await runner.runAsync({
  userId: user.id,
  sessionId: session.id,
  newMessage: { parts: [{ text: userMessage }] }
});

// ADK-TS handles all streaming automatically
return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  },
});
```

### ADK-TS Architecture Benefits

**ChainPilot** demonstrates the power of ADK-TS through these key architectural advantages:

- **Automatic Session Persistence**: Redis-backed session management with ADK-TS session service
- **Real-time Streaming**: Built-in SSE streaming without manual implementation
- **Tool Composition**: Modular tool architecture using ADK-TS `createTool()` pattern
- **Type Safety**: Full TypeScript integration with Zod validation schemas
- **Scalability**: Horizontal scaling with Redis session storage
- **Agent Orchestration**: Dynamic agent creation and management with AgentBuilder
- **Error Handling**: Built-in error handling and retry mechanisms
- **Multi-Model Support**: Seamless integration with OpenAI, Anthropic, and Google models

---

## System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React UI Components]
        Chat[Chat Interface]
        Cards[Tool Result Cards]
    end
    
    subgraph "API Layer"
        API[Next.js API Routes]
        Auth[Wallet Authentication]
        Stream[SSE Streaming]
    end
    
    subgraph "ADK-TS Core"
        Agent[AgentBuilder]
        Tools[Blockchain Tools]
        Session[Session Service]
        Model[LLM Models]
    end
    
    subgraph "Data Layer"
        Redis[(Redis Sessions)]
        Postgres[(PostgreSQL)]
        Alchemy[Alchemy APIs]
    end
    
    subgraph "Blockchain Networks"
        ETH[Ethereum]
        BASE[Base]
        POLY[Polygon]
        ARB[Arbitrum]
        OPT[Optimism]
    end
    
    UI --> Chat
    Chat --> API
    API --> Agent
    Agent --> Tools
    Agent --> Session
    Agent --> Model
    
    Session --> Redis
    API --> Postgres
    Tools --> Alchemy
    
    Alchemy --> ETH
    Alchemy --> BASE
    Alchemy --> POLY
    Alchemy --> ARB
    Alchemy --> OPT
    
    Agent --> Stream
    Stream --> Chat
```

### Component Architecture

```mermaid
graph LR
    subgraph "ADK-TS Tools"
        A[Account Tools]
        T[Token Tools]
        N[NFT Tools]
        X[Transaction Tools]
        U[Utility Tools]
    end
    
    subgraph "Tool Categories"
        A --> A1[get_balance]
        A --> A2[get_transaction_history]
        
        T --> T1[get_token_balance]
        T --> T2[get_token_metadata]
        T --> T3[get_token_price]
        
        N --> N1[get_nfts_owned]
        N --> N2[get_nft_metadata]
        N --> N3[get_floor_price]
        
        X --> X1[prepare_eth_transfer]
        X --> X2[prepare_token_transfer]
        X --> X3[estimate_gas]
        
        U --> U1[resolve_ens]
        U --> U2[get_gas_price]
    end
```

---

## Getting Started

### Prerequisites

**System Requirements:**
- Node.js 18+
- PostgreSQL database
- Redis instance (optional but recommended for production)

**Required API Keys:**

1. **Alchemy API Key** (https://dashboard.alchemy.com/)
   - Provides multi-chain blockchain data for 15+ EVM chains
   - Free tier includes 300M compute units/month

2. **OpenAI API Key** (https://platform.openai.com/api-keys) OR **Google AI API Key** (https://makersuite.google.com/app/apikey)
   - Powers the ADK-TS agent intelligence
   - OpenAI: GPT-4o recommended for best results
   - Google: Gemini 2.0 Flash or Gemini Pro

3. **Jupiter API Key** (https://station.jup.ag/api-keys)
   - Provides Solana token data and DEX aggregation
   - Free tier available

4. **WalletConnect Project ID** (https://cloud.walletconnect.com/)
   - Enables multi-chain wallet connectivity via RainbowKit
   - Free for unlimited projects

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/chainpilot.git
cd chainpilot
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment setup**
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
# Required Services
ALCHEMY_API_KEY="your_alchemy_api_key"
NEXT_PUBLIC_ALCHEMY_API_KEY="your_alchemy_api_key"

OPENAI_API_KEY="your_openai_api_key"
GOOGLE_API_KEY="your_google_api_key"
GOOGLE_GENERATIVE_AI_API_KEY="your_google_api_key"

JUPITER_API_KEY="your_jupiter_api_key"

DEFAULT_MODEL="gpt-4o"

NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your_walletconnect_project_id"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/adk_terminal"

# Optional - Redis for production session persistence
REDIS_URL="redis://localhost:6379"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Database setup**
```bash
pnpm db:push
```

5. **Start development server**
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## Development

### Project Structure

```
adk-coinbase-terminal/
├── app/                    # Next.js app directory
│   ├── api/chat/          # ADK-TS agent API routes
│   ├── chat/              # Chat interface pages
│   └── docs/              # Documentation pages
├── components/            # React components
│   ├── alchemy/cards/     # Blockchain data display cards
│   └── ui/                # Reusable UI components
├── lib/
│   ├── adk/              # ADK-TS integration
│   │   ├── tools/        # Custom blockchain tools
│   │   └── types.ts      # ADK type definitions
│   ├── ai/               # AI model configuration
│   └── db/               # Database schema and queries
└── hooks/                # React hooks for ADK integration
```

### Key ADK-TS Integration Points

1. **Tool Development** (`lib/adk/tools/`)
   - Custom blockchain tools using `createTool()`
   - Type-safe tool definitions with Zod schemas
   - Modular tool composition

2. **Agent Configuration** (`app/api/chat/route.ts`)
   - Dynamic agent creation with `AgentBuilder`
   - Session management with Redis persistence
   - Streaming response handling

3. **Session Management** (`lib/adk/redis-session.ts`)
   - Redis-backed session service
   - Automatic session cleanup and TTL management

---

## Design System

The application features a professional, OpenAI-inspired design system optimized for blockchain interactions:

- **Color Palette**: Deep blacks (#0B0B0B) with ChainPilot pink accents (#E2008C)
- **Typography**: Inter font family for optimal readability
- **Components**: Glass morphism effects with backdrop blur
- **Animations**: Subtle, professional motion design
- **Responsive**: Mobile-first design approach

---

## Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate database migrations
pnpm db:migrate       # Run database migrations
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Drizzle Studio

# Testing
pnpm test:tools       # Test ADK-TS tools
pnpm lint             # Run ESLint
```

---

## Live Demo

**Experience ChainPilot**: [https://chainpilot-adk.vercel.app](https://chainpilot-adk.vercel.app)

### Demo Features

- **Multi-chain wallet connection** via RainbowKit
- **Natural language blockchain queries** powered by ADK-TS
- **Real-time balance and NFT tracking**
- **Transaction preparation and gas optimization**
- **Professional AI chat interface**

---

## Hackathon Submission

### Track: Web3/Blockchain Use Case

This project demonstrates innovative integration of AI agents with blockchain systems, showcasing:

- **Real-world utility**: Practical blockchain operations through natural language
- **Technical excellence**: Comprehensive ADK-TS implementation with 20+ custom tools
- **User experience**: Professional interface design inspired by OpenAI
- **Scalability**: Redis-backed session management and multi-chain support

### ADK-TS Usage Summary

**ChainPilot** showcases comprehensive ADK-TS implementation across all major framework components:

- **AgentBuilder**: Dynamic agent creation with proper session management and tool integration
- **Custom Tools**: 20+ blockchain-specific tools using ADK-TS `createTool()` pattern with Zod validation
- **Session Management**: Redis persistence with automatic cleanup using ADK-TS session service
- **Streaming**: Built-in SSE streaming for real-time responses without manual implementation
- **Type Safety**: Full TypeScript integration with Zod validation schemas
- **Tool Composition**: Modular architecture demonstrating ADK-TS tool composition patterns
- **Multi-Model Support**: Seamless integration with OpenAI, Anthropic, and Google models via ADK-TS
- **Error Handling**: Leveraging ADK-TS built-in error handling and retry mechanisms

---

## Documentation

- [Getting Started Guide](https://chainpilot-adk.vercel.app/docs/getting-started)
- [Architecture Overview](https://chainpilot-adk.vercel.app/docs/architecture)
- [FAQ](https://chainpilot-adk.vercel.app/docs/faq)
- [Live Demo](https://chainpilot-adk.vercel.app)

---

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **IQ AI** for the ADK-TS framework
- **Alchemy** for blockchain infrastructure
- **Vercel** for deployment platform
- **RainbowKit** for wallet integration

---

<div align="center">
  <br />
  <img src="./public/logo.png" alt="ChainPilot" width="60" />
  <span style="margin: 0 20px;">✨</span>
  <img src="./public/adk.webp" alt="ADK" width="60" />
  <br />
  <br />
  <p><strong>Built for the ADK-TS Hackathon 2025</strong></p>
  <p>Demonstrating the future of AI-powered blockchain interactions</p>
  <br />
  <p><em>ChainPilot × ADK-TS</em></p>
</div>