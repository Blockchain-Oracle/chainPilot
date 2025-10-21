# ACTUAL Architecture - Corrected

## ✅ What We're ACTUALLY Using

Looking at the **real code** in `app/api/chat/route.ts`:

```typescript
import { AgentBuilder } from "@iqai/adk";
import { getAlchemyTools } from "@/lib/adk/tools";
// NO Coinbase AgentKit imports!
// NO CDP imports!
```

---

## 🏗️ Real Architecture

```
┌─────────────────────────────────────────────────────┐
│ FRONTEND                                            │
│  ┌──────────────────────────────────────────────┐   │
│  │  Wagmi + RainbowKit + Viem                   │   │
│  │  - Wallet connection UI                      │   │
│  │  - User connects their own wallet            │   │
│  │  │  (MetaMask, WalletConnect, etc.)          │   │
│  │  - Transaction signing happens in            │   │
│  │  │  user's wallet (MetaMask popup)           │   │
│  │  - User approves each transaction            │   │
│  └──────────────────────────────────────────────┘   │
│                       ↓                              │
│               User's Wallet Address                  │
│                       ↓                              │
└───────────────────────┼──────────────────────────────┘
                        ↓
┌───────────────────────┼──────────────────────────────┐
│ BACKEND (API)                                        │
│  ┌──────────────────────────────────────────────┐   │
│  │  ADK Agent (@iqai/adk)                       │   │
│  │  - Gemini AI model                           │   │
│  │  - Our 10 Alchemy tools                      │   │
│  │  - Data queries ONLY                         │   │
│  │  - NO transaction execution                  │   │
│  └──────────────────────────────────────────────┘   │
│                       ↓                              │
│  ┌──────────────────────────────────────────────┐   │
│  │  Alchemy SDK                                 │   │
│  │  - Get balances                              │   │
│  │  - Get NFTs                                  │   │
│  │  - Get prices                                │   │
│  │  - Get transaction history                   │   │
│  │  - Query blockchain data                     │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

---

## 🔑 Key Components

### 1. **Frontend: Wagmi/Viem/RainbowKit** (Wallet Connection + Signing)

```typescript
// components/providers/web3-provider.tsx
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

// ✅ Used for:
// 1. Connect wallet button (user connects their own wallet)
// 2. Display wallet address
// 3. Show balances
// 4. Sign transactions (via user's wallet - MetaMask popup)
// 5. Send transactions (user approves in MetaMask)
```

**Key Point:** User's own wallet (MetaMask, etc.) signs transactions - NOT our backend!

---

### 2. **Backend: ADK + Alchemy Tools** (Data Queries Only)

```typescript
// app/api/chat/route.ts
import { AgentBuilder } from "@iqai/adk";
import { getAlchemyTools } from "@/lib/adk/tools";

const tools = await getAlchemyTools(); // Our 10 Alchemy tools

const { runner } = await AgentBuilder.create("alchemy_assistant")
  .withModel("gemini-2.0-flash-exp")
  .withTools(...tools) // ONLY data query tools
  .build();
```

**What it does:**
- ✅ Query blockchain data (balances, NFTs, prices)
- ✅ Get transaction history
- ✅ Resolve ENS names
- ❌ Does NOT sign transactions
- ❌ Does NOT hold private keys
- ❌ Does NOT execute transactions

---

### 3. **Our 10 Alchemy Tools** (All Read-Only)

| Tool | Purpose | Type |
|------|---------|------|
| `get_token_balance` | Get ERC20 balances | Read |
| `get_token_metadata` | Token info | Read |
| `get_token_price` | Price by symbol | Read |
| `get_token_price_by_address` | Price by address | Read |
| `get_nfts_owned` | NFT portfolio | Read |
| `get_balance` | Native balance | Read |
| `get_transaction_history` | Transaction list | Read |
| `estimate_gas` | Gas estimation | Read |
| `get_gas_price` | Current gas prices | Read |
| `resolve_ens` | ENS resolution | Read |

**ALL tools are READ-ONLY data queries!**

---

## 🚫 What We're NOT Using

### ❌ Coinbase AgentKit

**Not installed or used!** Even though it's in package.json, it's **NOT imported** anywhere in the code.

```bash
# Check for AgentKit usage:
grep -r "agentkit" app/api/
# Result: No matches!
```

### ❌ Coinbase CDP

**Not used!** The environment variables are there but not referenced in code.

### ❌ Privy

**Not used!** The packages are installed but not configured or used.

### ❌ Backend Transaction Signing

**Not happening!** All transactions are signed by user's wallet in frontend.

---

## 🔄 How Transactions Actually Work

### Current Flow (Data Queries):

1. **User connects wallet** (Wagmi/RainbowKit)
   ```typescript
   const { address } = useAccount(); // "0x742d..."
   ```

2. **User asks:** "What's my balance?"

3. **Backend agent** calls Alchemy tool:
   ```typescript
   get_balance({ address: "0x742d...", chainId: 1 })
   ```

4. **Alchemy returns data** → displayed to user

### For Transactions (If Needed):

**Option A: User's Wallet Signs (Current Setup)**
1. User asks: "Send 0.1 ETH to 0x123..."
2. Agent prepares transaction details
3. Frontend shows transaction card
4. User clicks "Approve"
5. **Wagmi/Viem sends transaction request**
6. **User's wallet (MetaMask) pops up**
7. **User signs in their wallet**
8. Transaction broadcasts to blockchain

**Option B: Backend Signs (Would Need)**
- ❌ Coinbase AgentKit + CDP (not currently set up)
- ❌ Privy wallet delegation (not currently configured)
- ❌ Custom wallet server (don't have one)

---

## 📦 Dependencies (Actual Usage)

### ✅ Actually Used:

```json
{
  "@iqai/adk": "^0.5.0",              // ✅ Agent framework
  "@rainbow-me/rainbowkit": "^2.2.9",  // ✅ Wallet UI
  "wagmi": "^2.18.1",                  // ✅ Wallet connection
  "viem": "^2.38.3",                   // ✅ Ethereum library
  "alchemy-sdk": "^3.6.5",             // ✅ Blockchain data
  "@ai-sdk/google": "^2.0.23"          // ✅ Gemini model
}
```

### ❌ Installed But NOT Used:

```json
{
  "@coinbase/agentkit": "^0.10.3",     // ❌ Not imported anywhere
  "@coinbase/agentkit-model-context-protocol": "^0.2.0", // ❌ Not used
  "@privy-io/react-auth": "^3.3.0",    // ❌ Not configured
  "@privy-io/server-auth": "^1.32.5"   // ❌ Not configured
}
```

---

## 🎯 Correct Architecture Summary

### Data Queries (Current):
```
User Question
     ↓
ADK Agent (Gemini)
     ↓
Alchemy Tools (10 tools)
     ↓
Alchemy API
     ↓
Display Result
```

### Transactions (If Implemented):
```
User Request
     ↓
Frontend Prepares Transaction
     ↓
User Wallet (MetaMask)
     ↓
User Signs
     ↓
Wagmi/Viem Broadcasts
     ↓
Blockchain
```

---

## 🔧 Environment Variables (What's Actually Used)

### ✅ Required:

```env
# Backend
GOOGLE_API_KEY=xxx                  # ✅ For Gemini AI
ALCHEMY_API_KEY=xxx                 # ✅ For data queries
DATABASE_URL=xxx                    # ✅ For chat history

# Frontend  
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=xxx  # ✅ For WalletConnect
```

### ❌ Not Currently Used:

```env
# These are defined but not used in code:
CDP_API_KEY_ID=xxx                  # ❌ AgentKit not configured
CDP_API_KEY_SECRET=xxx              # ❌ AgentKit not configured
PRIVY_APP_ID=xxx                    # ❌ Privy not configured
PRIVY_APP_SECRET=xxx                # ❌ Privy not configured
```

---

## ✅ Corrected Understanding

**We are using:**
1. ✅ **Wagmi/Viem/RainbowKit** - Wallet connection + user signs transactions
2. ✅ **ADK** - AI agent framework
3. ✅ **Alchemy SDK** - Blockchain data queries
4. ✅ **Gemini** - AI model

**We are NOT using:**
1. ❌ **Coinbase AgentKit** - Not implemented
2. ❌ **Coinbase CDP** - Not configured
3. ❌ **Privy** - Not configured
4. ❌ **Backend transaction signing** - User signs in their wallet

---

## 🚀 Current Status

**What works:**
- ✅ Wallet connection (via RainbowKit)
- ✅ AI chat with 10 Alchemy data tools
- ✅ Query balances, NFTs, prices, etc.
- ✅ All data queries work

**What doesn't work yet:**
- ❌ Transaction execution (no cards or signing flow implemented)
- ❌ Swaps (would need frontend transaction flow)
- ❌ Transfers (would need frontend transaction flow)

**To implement transactions, you'd need:**
- Frontend transaction cards (approve/reject UI)
- Wagmi hooks to send transactions (user signs in MetaMask)
- No backend changes needed - user's wallet does signing

---

**Apologies for the confusion! We're using Wagmi for transactions (user signs), not Coinbase AgentKit!**

