# Generative UI Card Mapping

## Overview
Updated `/components/message.tsx` to render custom card components for ADK tool results instead of plain text/JSON.

## Console Log Flow
When a tool executes, you'll see these console logs in the browser:

1. **Tool Detected**: `[Message] Tool part detected: { toolType, toolName, state, toolCallId, partData }`
2. **Loading State**: `[Message] Showing tool loading state for: [toolName]`
3. **Output Received**: `[Message] Tool output received: { toolType, success, hasData, output }`
4. **Card Rendered**: `[Message] Rendering [CardName] for: [toolType]`

## Tool to Card Mapping

### Read Operations (Data Display)

| Tool Type | Card Component | Example Usage |
|-----------|---------------|---------------|
| `get_balance` | `BalanceCard` | Get ETH/native balance |
| `get_token_balance` | `TokenBalancesCard` | Get ERC-20 token balances |
| `get_token_metadata` | `TokenMetadataCard` | Get token info (name, symbol, decimals) |
| `get_token_price` | `TokenPriceCard` | Get token price in USD |
| `get_token_price_by_address` | `TokenPriceCard` | Get token price by contract address |
| `get_gas_price` | `GasPriceCard` | Get current gas prices (slow/standard/fast) |
| `get_nfts_owned` | `NftsOwnedCard` | Get NFTs owned by address |
| `get_collections_for_owner` | `NftsOwnedCard` | Get NFT collections for owner |
| `get_transaction_history` | `TransactionHistoryCard` | Get recent transactions |

### Write Operations (Transaction Preparation)

| Tool Type | Card Component | Example Usage |
|-----------|---------------|---------------|
| `prepare_eth_transfer` | `TransferCard` | Prepare ETH transfer transaction |
| `prepare_token_transfer` | `TokenTransferCard` | Prepare ERC-20 token transfer |
| `prepare_token_approval` | `TokenApprovalCard` | Prepare token approval transaction |
| `prepare_contract_call` | `ContractCallCard` | Prepare smart contract call |

### Fallback
Any unmapped tool types will render a generic card showing the raw JSON output.

## Testing Checklist

- [ ] Check browser console for log output when querying balance
- [ ] Verify `BalanceCard` renders instead of plain text
- [ ] Test other tools (tokens, NFTs, gas, etc.)
- [ ] Confirm loading states show correctly
- [ ] Verify transaction preparation cards render properly

## Expected Data Structure

All tools should return data in this format:
```typescript
{
  success: boolean;
  data?: any;      // Tool-specific data structure
  error?: string;  // Only present if success is false
}
```

Each card component expects a `result` prop matching this structure.
