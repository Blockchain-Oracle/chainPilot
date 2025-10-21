# Testing Guide for ADK Coinbase Terminal

## Quick Test Checklist

### 1. Environment Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add required API keys:
  - `NEXT_PUBLIC_PRIVY_APP_ID`
  - `PRIVY_APP_ID`
  - `PRIVY_APP_SECRET`
  - `PRIVY_WALLET_AUTHORIZATION_PRIVATE_KEY`
  - `CDP_API_KEY_ID`
  - `CDP_API_KEY_SECRET`
  - `GOOGLE_API_KEY`
  - `DATABASE_URL` (optional for development)

### 2. Start Development Server
```bash
pnpm dev
```

### 3. Test Flow

#### A. Wallet Connection
1. Open http://localhost:3000
2. Click "Connect Wallet" button
3. Complete Privy authentication
4. Verify wallet address appears
5. Check delegation status shows "delegated"
6. Should auto-redirect to /chat

#### B. Chat Interface
1. Navigate to http://localhost:3000/chat
2. Verify wallet status in header
3. Try sending messages:
   - "What's my wallet balance?"
   - "Show me my ETH balance"
   - "Transfer 0.001 ETH to 0x..."
   - "Swap 0.1 ETH for USDC"

#### C. Tool Cards
- **Balance Check**: Should show BalanceCard with wallet holdings
- **Transfer**: Should show TransferCard with approval buttons
- **Swap**: Should show SwapCard with token details
- **Loading**: Should show ToolLoader during processing

### 4. Key Features to Verify

- [ ] SSE streaming works (text appears gradually)
- [ ] Tool cards render dynamically
- [ ] Approval/rejection buttons appear for transactions
- [ ] Error states display properly
- [ ] Loading states show during operations
- [ ] Messages persist in chat history
- [ ] Wallet delegation persists on refresh

### 5. Common Issues & Solutions

#### Issue: "Cannot connect wallet"
- Check Privy configuration in .env.local
- Ensure NEXT_PUBLIC_PRIVY_APP_ID matches dashboard

#### Issue: "Agent not responding"
- Check GOOGLE_API_KEY is valid
- Verify CDP API keys are correct
- Check browser console for SSE errors

#### Issue: "Database connection failed"
- App works without database (in-memory sessions)
- For full persistence, set up PostgreSQL

#### Issue: "Tool cards not appearing"
- Check ADK tool conversion in /lib/adk/tools.ts
- Verify AgentKit is properly initialized
- Check browser console for parsing errors

### 6. Testing Without Real Wallet

For UI testing without connecting a real wallet:
1. Use the test agent in `/lib/adk/agent.ts`
2. Comment out wallet requirement in chat interface
3. Mock wallet address in chat API route

### 7. Production Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Database connection configured
- [ ] Privy production app created
- [ ] CDP production keys obtained
- [ ] Redis configured (optional)
- [ ] Domain configured in Vercel

## API Endpoints

### POST /api/chat
- Accepts: `{ message: string, chatId?: string, walletAddress?: string }`
- Returns: SSE stream with events
- Events: connected, agent-info, message-part, complete, error

### POST /api/delegation
- Accepts: `{ walletId: string, walletAddress: string }`
- Returns: `{ delegation: {...} }`
- Creates/updates wallet delegation

## Component Structure

```
/src
  /app
    /page.tsx          - Home page with wallet connection
    /chat/page.tsx     - Main chat interface
    /api/chat/route.ts - SSE streaming endpoint
  /components
    /chat
      /chat-interface.tsx  - Main chat component
      /message.tsx         - Message renderer
    /coinbase/cards
      /transfer-card.tsx   - Transfer approval UI
      /swap-card.tsx       - Swap approval UI
      /balance-card.tsx    - Balance display UI
    /coinbase/loaders
      /tool-loader.tsx     - Loading states
    /wallet
      /wallet-button.tsx   - Privy wallet connection
  /lib
    /adk                   - ADK agent configuration
    /agentkit              - Coinbase AgentKit setup
    /db                    - Database layer
```

## Next Steps

1. **Add more tool cards** for other AgentKit tools
2. **Implement chat history** persistence
3. **Add transaction history** view
4. **Create settings page** for preferences
5. **Add multi-chain support**
6. **Implement tool approval queue**
7. **Add voice input** (optional)
8. **Create mobile-responsive design**