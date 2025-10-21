# Transaction Architecture - ChainPilot

**Date**: October 21, 2025
**Status**: Documented

---

## Executive Summary

**YOU DO NOT NEED AGENT_WALLET_SERVER OR COINBASE AGENTKIT FOR TRANSACTIONS!**

ChainPilot uses **wagmi + viem** for transaction execution. The user's own wallet (MetaMask, WalletConnect, etc.) signs all transactions in the frontend - NOT the backend.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│ FRONTEND (User's Browser)                              │
│  ┌────────────────────────────────────────────────┐   │
│  │  Wagmi + RainbowKit + Viem                     │   │
│  │                                                 │   │
│  │  1. User connects wallet (MetaMask, etc.)     │   │
│  │  2. Transaction card displays                  │   │
│  │  3. User clicks "Approve"                      │   │
│  │  4. Wagmi calls useSendTransaction()          │   │
│  │  5. User's wallet popup appears               │   │
│  │  6. User signs in their wallet                │   │
│  │  7. Transaction broadcasts to blockchain       │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ BACKEND (API)                                           │
│  ┌────────────────────────────────────────────────┐   │
│  │  ADK Agent + Alchemy Tools                     │   │
│  │                                                 │   │
│  │  - Reads blockchain data                       │   │
│  │  - Prepares transaction details                │   │
│  │  - Returns instructions to frontend            │   │
│  │  - DOES NOT sign transactions                  │   │
│  │  - DOES NOT hold private keys                  │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🚫 What We're NOT Using

### ❌ Coinbase AgentKit Transaction Tools

**Why installed but not used:**
- Package installed in package.json but **NOT imported** in any code
- Would require CDP API keys and Privy wallet delegation
- Would enable backend transaction signing (we don't want this!)

**What it would provide:**
```typescript
// ❌ NOT USING THESE:
- send_transaction (AgentKit tool)
- deploy_contract (AgentKit tool)
- swap_token (AgentKit tool)
- interact_with_contract (AgentKit tool)
```

### ❌ AGENT_WALLET_SERVER

**What is it:**
- An external wallet server used by Alchemy MCP's swap and sendTransaction
- Not a real Alchemy API - just a helper server for demos
- We don't have one and don't need one

**Where it appears:**
- Alchemy MCP Server source code only
- NOT used in our codebase

### ❌ Privy Wallet Delegation

**Status:**
- Packages installed but NOT configured
- No Privy provider in our app
- We use RainbowKit instead

---

## ✅ What We ARE Using

### 1. **Wagmi** - React Hooks for Ethereum

**Purpose:** Connect wallets and send transactions in the frontend

**Key Hooks:**
```typescript
// Connect user's wallet
const { address, isConnected } = useAccount()

// Send native ETH
const { sendTransaction } = useSendTransaction()

// Call contract functions
const { writeContract } = useWriteContract()
```

### 2. **Viem** - TypeScript Interface for Ethereum

**Purpose:** Low-level utilities for transaction formatting

**Key Functions:**
```typescript
import { parseEther, parseGwei } from 'viem'

// Format ETH amounts
const value = parseEther('0.1') // 100000000000000000n

// Format gas prices
const gasPrice = parseGwei('20') // 20000000000n
```

### 3. **RainbowKit** - Wallet Connection UI

**Purpose:** Beautiful wallet connection interface

**What it provides:**
- Connect wallet button
- Wallet selection modal
- Account display
- Network switcher

---

## Transaction Implementation Patterns

### Pattern 1: Send Native ETH

**Frontend Component:**
```typescript
import { useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'

function TransferETH() {
  const { sendTransaction, isPending, data: hash } = useSendTransaction()

  const handleSend = () => {
    sendTransaction({
      to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      value: parseEther('0.1') // 0.1 ETH
    })
  }

  return (
    <button onClick={handleSend} disabled={isPending}>
      {isPending ? 'Sending...' : 'Send 0.1 ETH'}
    </button>
  )
}
```

**What happens:**
1. User clicks button
2. `sendTransaction()` is called
3. User's wallet (MetaMask) pops up
4. User reviews and signs
5. Transaction broadcasts
6. `hash` contains transaction hash

### Pattern 2: Call Contract Function (ERC20 Transfer)

**Frontend Component:**
```typescript
import { useWriteContract } from 'wagmi'
import { parseUnits } from 'viem'

const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }]
  }
] as const

function TransferToken() {
  const { writeContract, isPending } = useWriteContract()

  const handleTransfer = () => {
    writeContract({
      abi: ERC20_ABI,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      functionName: 'transfer',
      args: [
        '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // recipient
        parseUnits('10', 6) // 10 USDC (6 decimals)
      ]
    })
  }

  return (
    <button onClick={handleTransfer} disabled={isPending}>
      {isPending ? 'Transferring...' : 'Send 10 USDC'}
    </button>
  )
}
```

### Pattern 3: Send Transaction with Gas Options

**Advanced Example:**
```typescript
import { useSendTransaction } from 'wagmi'
import { parseEther, parseGwei } from 'viem'

function AdvancedTransfer() {
  const { sendTransaction } = useSendTransaction()

  const handleSend = () => {
    sendTransaction({
      to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      value: parseEther('0.1'),
      gasPrice: parseGwei('25'), // Custom gas price
      nonce: 42, // Custom nonce (optional)
    })
  }

  return <button onClick={handleSend}>Send with Custom Gas</button>
}
```

---

## ADK Agent Integration

### Backend Prepares, Frontend Executes

**Backend (ADK Agent):**
```typescript
// app/api/chat/route.ts

// ADK tool that prepares transaction details
const transferTool = new FunctionTool(
  async ({ to, amount }: { to: string; amount: string }) => {
    // Validate inputs
    if (!isAddress(to)) {
      return { success: false, error: 'Invalid address' }
    }

    // Return transaction details to frontend
    return {
      success: true,
      transaction: {
        type: 'native_transfer',
        to,
        amount,
        chainId: 1
      }
    }
  },
  {
    name: 'prepare_transfer',
    description: 'Prepare ETH transfer transaction'
  }
)
```

**Frontend Receives and Executes:**
```typescript
// components/message.tsx

function MessageRenderer({ message }: { message: ChatMessage }) {
  if (message.type === 'tool-native_transfer') {
    return <TransferCard {...message} />
  }
  // ... other message types
}

function TransferCard({ to, amount, chainId }: TransferCardProps) {
  const { sendTransaction } = useSendTransaction()

  const handleApprove = () => {
    sendTransaction({
      to,
      value: parseEther(amount),
      chainId
    })
  }

  return (
    <Card>
      <p>Transfer {amount} ETH to {to}</p>
      <button onClick={handleApprove}>Approve</button>
    </Card>
  )
}
```

---

## Full Transaction Flow Example

### User asks: "Send 0.1 ETH to 0x742...0bEb"

**1. Backend (ADK Agent):**
```typescript
// Agent receives query
"Send 0.1 ETH to 0x742...0bEb"

// Agent calls tool
prepare_transfer({
  to: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  amount: "0.1"
})

// Tool returns
{
  success: true,
  transaction: {
    type: "native_transfer",
    to: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    amount: "0.1",
    chainId: 1
  }
}

// Agent streams to frontend
event: tool-native_transfer
data: { to: "0x742...", amount: "0.1", chainId: 1 }
```

**2. Frontend Displays Card:**
```tsx
<TransferCard
  to="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  amount="0.1"
  chainId={1}
/>
```

**3. User Clicks "Approve":**
```typescript
sendTransaction({
  to: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  value: parseEther("0.1")
})
```

**4. MetaMask Popup:**
```
┌──────────────────────────┐
│ MetaMask                 │
├──────────────────────────┤
│ Send Transaction         │
│                          │
│ To: 0x742d35...0bEb     │
│ Value: 0.1 ETH           │
│ Gas: 21,000              │
│                          │
│ [Reject]  [Confirm]      │
└──────────────────────────┘
```

**5. User Confirms:**
- Transaction signed by user's private key
- Broadcast to Ethereum network
- Hash returned: `0xabc123...`

**6. Frontend Updates:**
```tsx
<div>
  Transaction sent!
  Hash: 0xabc123...
  <a href={`https://etherscan.io/tx/${hash}`}>View on Etherscan</a>
</div>
```

---

## Security Model

### ✅ What's Secure:

1. **Private keys never leave user's wallet**
   - MetaMask, hardware wallets keep keys secure
   - Backend never sees private keys

2. **User approves every transaction**
   - Every tx requires explicit user confirmation
   - User can review details before signing

3. **No backend signing**
   - Backend can't create transactions on its own
   - Can only suggest transaction details

### 🎯 What Backend Can Do:

- ✅ Read blockchain data (balances, NFTs, prices)
- ✅ Prepare transaction details
- ✅ Suggest optimal gas prices
- ✅ Validate addresses and amounts
- ❌ Cannot sign transactions
- ❌ Cannot access user's private keys
- ❌ Cannot execute transactions without user

---

## Environment Variables

### ✅ Required:

```env
# Frontend
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=xxx  # For WalletConnect

# Backend
ALCHEMY_API_KEY=xxx                        # For data queries
GOOGLE_API_KEY=xxx                         # For Gemini AI
DATABASE_URL=xxx                           # For chat history
```

### ❌ NOT Required (Unused):

```env
# These are in .env but NOT used:
CDP_API_KEY_ID=xxx                         # AgentKit not configured
CDP_API_KEY_SECRET=xxx                     # AgentKit not configured
PRIVY_APP_ID=xxx                           # Privy not configured
PRIVY_APP_SECRET=xxx                       # Privy not configured
```

---

## Summary Table

| Feature | Implementation | User Signs? | Backend Involved? |
|---------|---------------|-------------|-------------------|
| **Send ETH** | wagmi `useSendTransaction` | ✅ Yes (MetaMask) | ❌ No (data prep only) |
| **ERC20 Transfer** | wagmi `useWriteContract` | ✅ Yes (MetaMask) | ❌ No (data prep only) |
| **Contract Call** | wagmi `useWriteContract` | ✅ Yes (MetaMask) | ❌ No (data prep only) |
| **Swap Tokens** | wagmi `useWriteContract` | ✅ Yes (MetaMask) | ❌ No (data prep only) |
| **Query Balance** | Alchemy SDK | ❌ No signing | ✅ Yes (reads data) |
| **Get NFTs** | Alchemy SDK | ❌ No signing | ✅ Yes (reads data) |

---

## Next Steps for Implementation

### 1. Create Transaction Tools (Backend)

```typescript
// lib/adk/tools/transactions/prepare-transfer.ts
export const prepareTransferTool = new FunctionTool(
  async ({ to, amount, chainId }) => {
    return {
      success: true,
      transaction: { type: 'native_transfer', to, amount, chainId }
    }
  },
  { name: 'prepare_transfer', description: 'Prepare ETH transfer' }
)
```

### 2. Create Transaction Cards (Frontend)

```typescript
// components/coinbase/cards/TransferCard.tsx
export function TransferCard({ to, amount, chainId }) {
  const { sendTransaction, isPending, data: hash } = useSendTransaction()

  return (
    <Card>
      <p>Send {amount} ETH to {to}</p>
      <button onClick={() => sendTransaction({ to, value: parseEther(amount) })}>
        {isPending ? 'Sending...' : 'Approve'}
      </button>
      {hash && <p>Hash: {hash}</p>}
    </Card>
  )
}
```

### 3. Map Events to Cards (Frontend)

```typescript
// components/message.tsx
if (part.type === 'tool-native_transfer') {
  return <TransferCard {...part} />
}
```

---

## Comparison: Our Approach vs AgentKit

| Aspect | Our Approach (Wagmi) | AgentKit Approach |
|--------|---------------------|-------------------|
| **Signing** | User's wallet (MetaMask) | Backend (Privy delegated wallet) |
| **Private Keys** | In user's wallet | In Privy/CDP service |
| **User Approval** | Every transaction | Every transaction |
| **Setup Complexity** | Low (just RainbowKit) | High (CDP + Privy + AgentKit) |
| **Security Model** | User controls keys | Delegated authority |
| **Dependencies** | wagmi + viem | AgentKit + CDP + Privy |
| **Use Case** | User-facing dApp | Autonomous agent |

---

## Conclusion

**You do NOT need AGENT_WALLET_SERVER or Coinbase AgentKit for transactions!**

Your architecture is:
- ✅ **Simpler** - Just wagmi/viem
- ✅ **More secure** - User controls private keys
- ✅ **Standard** - Like every other dApp
- ✅ **Well-documented** - Wagmi has great docs

The backend's job is to:
1. Read blockchain data (via Alchemy)
2. Prepare transaction details
3. Stream instructions to frontend

The frontend's job is to:
1. Display transaction cards
2. Let user approve/reject
3. Sign with user's wallet (MetaMask)
4. Broadcast transaction

**That's it!** No external wallet server needed. 🎉

---

**Status:** Architecture documented and clarified ✅
