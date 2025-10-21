# Swaps Directory - Intentionally Empty

## ❌ Why No Swap Tools Here?

The `swaps/` directory is **intentionally empty** because:

### 1. Alchemy MCP Server's Swap is NOT a Real Alchemy API

Looking at `alchemy-mcp-server/api/alchemyApi.ts`:

```typescript
async swap(params: SwapParams) {
  // This calls an external AGENT_WALLET_SERVER, not Alchemy!
  const response = await fetch(`${AGENT_WALLET_SERVER}/transactions/swap`, {
    // ...
  });
}
```

**Problems:**
- ❌ Requires external `AGENT_WALLET_SERVER` (not provided)
- ❌ Not a real Alchemy API endpoint
- ❌ Violates CLAUDE.md Rule #1: "NO MOCK IMPLEMENTATIONS"

### 2. We Use Coinbase AgentKit for Swaps Instead

**Coinbase AgentKit** already provides swap functionality:
- ✅ Real DEX integration (Uniswap, 1inch, etc.)
- ✅ Integrated with Coinbase Wallet
- ✅ Secure transaction signing via Privy
- ✅ No need for external wallet server

**AgentKit Swap Tools Available:**
```typescript
// These are already available via Coinbase AgentKit MCP:
- swap_token
- get_swap_quote
- approve_token_for_swap
- execute_swap
```

## ✅ What We Have Instead

### Current ADK Tools (10 Real Alchemy APIs):

1. **Tokens:**
   - `get_token_balance` - ERC20 balances
   - `get_token_metadata` - Token info
   - `get_token_price` - Price by symbol
   - `get_token_price_by_address` - Price by contract address

2. **NFTs:**
   - `get_nfts_owned` - NFT portfolio

3. **Account:**
   - `get_balance` - Native token balance
   - `get_transaction_history` - Transaction list

4. **Transactions:**
   - `estimate_gas` - Gas estimation

5. **Utils:**
   - `get_gas_price` - Current gas prices
   - `resolve_ens` - ENS name resolution

### For Swaps: Use Coinbase AgentKit

When you configure the ADK agent with AgentKit, swap tools are automatically available:

```typescript
// In lib/adk/agent.ts
const { tools } = await getMcpTools(agentKit);
// This includes swap tools from AgentKit!

const { runner } = await AgentBuilder.create("agent")
  .withTools(...tools) // Includes AgentKit swap tools
  .build();
```

## 🎯 Recommended Approach

**For Swap Functionality:**
1. ✅ Use Coinbase AgentKit swap tools (already integrated)
2. ✅ Create UI cards for AgentKit swap operations
3. ✅ Let AgentKit handle DEX routing and execution
4. ❌ Don't try to implement custom swap logic

**For Alchemy APIs:**
- ✅ Only implement real Alchemy APIs
- ✅ Use Alchemy for data queries (prices, balances, NFTs)
- ❌ Don't implement placeholder/mock implementations

## 📚 Reference

- **AgentKit Docs:** `/Users/apple/dev/hackathon/ADK/agentkit/`
- **Coinbase Swap Docs:** https://docs.cdp.coinbase.com/agentkit/docs/swap
- **CLAUDE.md Rules:** `adk-coinbase-terminal/CLAUDE.md`
- **Missing Tools Analysis:** `MISSING_TOOLS_ANALYSIS.md`

---

**Status:** This directory is **intentionally empty** and should remain so. Swaps are handled by Coinbase AgentKit.

