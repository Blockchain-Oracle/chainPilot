# Missing Alchemy Tools Analysis

## Comparison: Alchemy MCP Server vs ADK Tools

### ✅ Already Implemented

| MCP Server Method | ADK Tool | Status |
|-------------------|----------|--------|
| `getTokenPriceBySymbol` | `tokens/get-token-price.ts` | ✅ Implemented |
| `getNftsForAddress` | `nfts/get-nfts-owned.ts` | ✅ Implemented |
| `getAssetTransfers` | Used in `account/get-transaction-history.ts` | ✅ Implemented |
| Native balance | `account/get-balance.ts` | ✅ Implemented |
| Token balances | `tokens/get-token-balance.ts` | ✅ Implemented |
| Token metadata | `tokens/get-token-metadata.ts` | ✅ Implemented |
| Gas estimation | `transactions/estimate-gas.ts` | ✅ Implemented |
| Gas prices | `utils/get-gas-price.ts` | ✅ Implemented |
| ENS resolution | `utils/resolve-ens.ts` | ✅ Implemented |

---

## ❌ Missing Real Alchemy APIs (Can Implement)

### 1. **Token Price by Address** 🔴 HIGH PRIORITY
**MCP Method:** `getTokenPriceByAddress`

**What it does:** Get token prices by contract address (more accurate than symbol)

**Alchemy API:** `POST https://api.g.alchemy.com/prices/v1/{apiKey}/tokens/by-address`

**Why implement:** More accurate than symbol-based pricing, handles tokens with same symbol

**Tool to create:** `tokens/get-token-price-by-address.ts`

---

### 2. **Token Price History** 🟡 MEDIUM PRIORITY
**MCP Method:** `getTokenPriceHistoryBySymbol`

**What it does:** Get historical price data for charts/analysis

**Alchemy API:** `POST https://api.g.alchemy.com/prices/v1/{apiKey}/tokens/historical`

**Why implement:** Enables price charts, trend analysis

**Tool to create:** `tokens/get-token-price-history.ts`

---

### 3. **Multi-Chain Token Balances** 🟡 MEDIUM PRIORITY
**MCP Method:** `getTokensByMultichainAddress`

**What it does:** Get token balances across multiple chains in one call

**Alchemy API:** `POST https://api.g.alchemy.com/data/v1/{apiKey}/assets/tokens/by-address`

**Why implement:** More efficient than checking each chain separately

**Tool to create:** `tokens/get-multichain-token-balance.ts`

---

### 4. **Multi-Chain Transaction History** 🟡 MEDIUM PRIORITY
**MCP Method:** `getTransactionHistoryByMultichainAddress`

**What it does:** Get transaction history across multiple chains

**Alchemy API:** `POST https://api.g.alchemy.com/data/v1/{apiKey}/transactions/history/by-address`

**Why implement:** Complete transaction view across all chains

**Tool to create:** `account/get-multichain-transaction-history.ts`

---

### 5. **NFT Contracts by Address** 🟢 LOW PRIORITY
**MCP Method:** `getNftContractsByAddress`

**What it does:** Get list of NFT contracts owned by address

**Alchemy API:** `POST https://api.g.alchemy.com/data/v1/{apiKey}/assets/nfts/by-address`

**Why implement:** Useful for NFT portfolio overview

**Tool to create:** `nfts/get-nft-contracts.ts`

---

## 🚫 DO NOT IMPLEMENT (Not Real Alchemy APIs)

### ❌ Swap Function
**MCP Method:** `swap`

**Why NOT implement:**
- ❌ Depends on external `AGENT_WALLET_SERVER` (not provided)
- ❌ Not a real Alchemy API
- ❌ Violates CLAUDE.md Rule #1 (no mocks/placeholders)
- ✅ **Use Coinbase AgentKit swap tools instead** (already available via AgentKit)

### ❌ Send Transaction
**MCP Method:** `sendTransaction`

**Why NOT implement:**
- ❌ Depends on external `AGENT_WALLET_SERVER` (not provided)
- ❌ Not a real Alchemy API
- ✅ **Use Coinbase AgentKit transaction tools instead** (already available via AgentKit)

---

## 📊 Implementation Priority

### Phase 1: High Priority (Implement Now)
```bash
✅ All core tools already implemented
🔴 Token price by address - More accurate pricing
```

### Phase 2: Medium Priority (Nice to Have)
```bash
🟡 Token price history - For charts/trends
🟡 Multi-chain token balances - Efficiency improvement
🟡 Multi-chain transaction history - Complete view
```

### Phase 3: Low Priority (Optional)
```bash
🟢 NFT contracts by address - Portfolio enhancement
```

---

## 🎯 Recommended Action

**For Swaps:** Use **Coinbase AgentKit** swap tools (already available in AgentKit MCP):
- AgentKit has built-in swap functionality
- Integrated with Coinbase wallet
- No need for external AGENT_WALLET_SERVER

**For Transactions:** Use **Coinbase AgentKit** transaction tools:
- Already integrated via AgentKit
- Secure wallet signing via Privy
- No need for custom transaction server

---

## 🔧 Tools to Implement (Following CLAUDE.md)

### 1. High Priority: Token Price by Address
```typescript
// lib/adk/tools/tokens/get-token-price-by-address.ts
import { FunctionTool } from '@iqai/adk';
import { z } from 'zod';

const schema = z.object({
  contractAddress: z.string().describe('Token contract address (0x...)'),
  chainId: z.number().optional().default(1).describe('Chain ID'),
});

async function getTokenPriceByAddress({ contractAddress, chainId = 1 }: z.infer<typeof schema>) {
  const apiKey = process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Alchemy API key not configured');
  }

  const response = await fetch(
    `https://api.g.alchemy.com/prices/v1/${apiKey}/tokens/by-address`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        addresses: [{
          address: contractAddress,
          network: getNetworkName(chainId),
        }]
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Alchemy API error: ${response.status}`);
  }

  const data = await response.json();
  // Process and return data
}

export const tokenPriceByAddressTool = new FunctionTool(getTokenPriceByAddress, {
  name: 'get_token_price_by_address',
  description: 'Get token price by contract address',
  parameterTypes: {
    contractAddress: 'string',
    chainId: 'number',
  },
});
```

---

## ✅ What We Have vs What Alchemy MCP Has

**We have 9 working tools** covering:
- ✅ Token prices (by symbol)
- ✅ Token balances (single chain)
- ✅ Token metadata
- ✅ NFT ownership
- ✅ Transaction history (single chain)
- ✅ Native balance
- ✅ Gas estimation
- ✅ Gas prices
- ✅ ENS resolution

**What Alchemy MCP adds:**
- 🔴 Price by address (more accurate)
- 🟡 Historical prices
- 🟡 Multi-chain queries (efficiency)
- 🟢 NFT contracts list

**What Alchemy MCP has that we DON'T need:**
- ❌ swap (use AgentKit)
- ❌ sendTransaction (use AgentKit)

---

## 💡 Recommendation

1. **Implement token price by address** (high value, easy win)
2. **Keep swaps/ directory empty** - Use AgentKit swap tools
3. **Document that transactions use AgentKit** - Not custom server
4. **Optional:** Add multi-chain queries if performance becomes issue

The current 9 tools cover **all essential functionality**. Additional tools are enhancements, not requirements.

