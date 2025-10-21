# Alchemy API Coverage Analysis

**Date:** October 21, 2025  
**Current Implementation:** 10 READ-ONLY tools  
**Alchemy API Key:** Configured ✅

---

## ✅ What We HAVE Implemented (10 Tools)

### Core Blockchain Data

| API Method | Our Tool | Status |
|------------|----------|--------|
| `eth_getBalance` | `get_balance` | ✅ |
| `eth_estimateGas` | `estimate_gas` | ✅ |
| `eth_gasPrice` | `get_gas_price` | ✅ |
| `eth_maxPriorityFeePerGas` | `get_gas_price` | ✅ |

### Token APIs

| API Method | Our Tool | Status |
|------------|----------|--------|
| `alchemy_getTokenBalances` | `get_token_balance` | ✅ |
| `alchemy_getTokenMetadata` | `get_token_metadata` | ✅ |
| **Prices API** `/by-symbol` | `get_token_price` | ✅ |
| **Prices API** `/by-address` | `get_token_price_by_address` | ✅ |

### NFT APIs

| API Method | Our Tool | Status |
|------------|----------|--------|
| **NFT API v3** `getNFTsForOwner` | `get_nfts_owned` | ✅ |

### Transfer & History APIs

| API Method | Our Tool | Status |
|------------|----------|--------|
| `alchemy_getAssetTransfers` | `get_transaction_history` | ✅ |

### ENS APIs

| API Method | Our Tool | Status |
|------------|----------|--------|
| `alchemy.core.resolveName()` | `resolve_ens` | ✅ |
| `alchemy.core.lookupAddress()` | `resolve_ens` | ✅ |

---

## 🔍 Additional Read Operations Available

### 1. Block Data APIs

| API Method | Description | Priority | Use Case |
|------------|-------------|----------|----------|
| `eth_blockNumber` | Get latest block number | 🔵 Medium | Show current network status |
| `eth_getBlockByNumber` | Get block details by number | 🟢 Low | Block explorer features |
| `eth_getBlockByHash` | Get block details by hash | 🟢 Low | Block explorer features |
| `eth_getBlockTransactionCountByNumber` | Count txs in a block | 🟢 Low | Block statistics |

### 2. Transaction Data APIs

| API Method | Description | Priority | Use Case |
|------------|-------------|----------|----------|
| `eth_getTransactionByHash` | Get transaction details | 🔴 High | Transaction viewer/tracker |
| `eth_getTransactionReceipt` | Get transaction receipt | 🔴 High | Verify transaction status |
| `eth_getTransactionCount` | Get nonce for address | 🔵 Medium | Transaction preparation |

### 3. Smart Contract Read APIs

| API Method | Description | Priority | Use Case |
|------------|-------------|----------|----------|
| `eth_call` | Call contract read function | 🔴 High | Generic contract queries |
| `eth_getCode` | Get contract bytecode | 🟢 Low | Verify contract |
| `eth_getStorageAt` | Read contract storage | 🟢 Low | Advanced debugging |

### 4. Event Log APIs

| API Method | Description | Priority | Use Case |
|------------|-------------|----------|----------|
| `eth_getLogs` | Get event logs | 🔵 Medium | Track contract events |
| `alchemy_getAssetTransfers` (with filters) | Advanced transfer filtering | 🔵 Medium | Complex transaction queries |

### 5. Token Allowance APIs

| API Method | Description | Priority | Use Case |
|------------|-------------|----------|----------|
| `eth_call` (to `allowance()`) | Check ERC20 allowance | 🔴 High | Before token swaps/approvals |

### 6. Advanced NFT APIs

| API Method | Description | Priority | Use Case |
|------------|-------------|----------|----------|
| `getNFTMetadata` | Individual NFT metadata | 🔵 Medium | NFT detail view |
| `getNFTsForCollection` | All NFTs in collection | 🔵 Medium | Collection browser |
| `getFloorPrice` | NFT collection floor price | 🔵 Medium | NFT market data |
| `getNFTSales` | Recent sales data | 🟢 Low | NFT price discovery |
| `getOwnersForNFT` | Who owns specific NFT | 🟢 Low | NFT ownership check |
| `getSpamContracts` | Detect spam NFTs | 🔵 Medium | Filter out spam |
| `isSpamContract` | Check if contract is spam | 🔵 Medium | NFT filtering |

### 7. Historical Price Data

| API Method | Description | Priority | Use Case |
|------------|-------------|----------|----------|
| **Prices API** `/historical` | Historical token prices | 🔵 Medium | Price charts |

### 8. Network Info APIs

| API Method | Description | Priority | Use Case |
|------------|-------------|----------|----------|
| `eth_chainId` | Get chain ID | 🟢 Low | Network verification |
| `net_version` | Get network version | 🟢 Low | Network info |

---

## 🎯 Recommended Additions (Priority Order)

### High Priority (Should Add) 🔴

1. **`get_transaction_details`** - Get full transaction info by hash
   - API: `eth_getTransactionByHash` + `eth_getTransactionReceipt`
   - Use case: Users want to track their pending/completed transactions
   - Returns: Status, gas used, block number, timestamp, logs

2. **`check_token_allowance`** - Check ERC20 allowance
   - API: `eth_call` to ERC20 `allowance(owner, spender)`
   - Use case: Before swaps, check if approval is needed
   - Returns: Current allowance amount

3. **`call_contract_function`** - Generic read-only contract call
   - API: `eth_call`
   - Use case: Query any contract read function
   - Returns: Decoded return data

### Medium Priority (Nice to Have) 🔵

4. **`get_current_block`** - Get latest block number
   - API: `eth_blockNumber`
   - Use case: Show network status, calculate confirmations
   - Returns: Current block number

5. **`get_transaction_count`** - Get nonce for address
   - API: `eth_getTransactionCount`
   - Use case: Transaction preparation
   - Returns: Transaction count (nonce)

6. **`get_nft_metadata`** - Individual NFT metadata
   - API: NFT API v3 `getNFTMetadata`
   - Use case: Detailed NFT view
   - Returns: Full metadata, rarity, attributes

7. **`get_contract_events`** - Get event logs
   - API: `eth_getLogs`
   - Use case: Track specific contract events
   - Returns: Event logs with decoded data

8. **`get_nft_floor_price`** - Collection floor price
   - API: NFT API v3 `getFloorPrice`
   - Use case: NFT valuation
   - Returns: Floor price in ETH/USD

9. **`filter_spam_nfts`** - Detect spam NFTs
   - API: NFT API v3 `isSpamContract` + `getSpamContracts`
   - Use case: Clean NFT display
   - Returns: Is spam boolean

### Low Priority (Future) 🟢

10. **Block explorer tools** - Full block data
11. **Historical price charts** - Token price history
12. **NFT sales data** - Market analytics

---

## 📊 Coverage Summary

### Current Coverage
- ✅ **10/10** Essential read operations implemented
- ✅ **100%** Basic wallet functionality covered
- ✅ **100%** Token price discovery covered
- ✅ **80%** NFT basics covered
- ❌ **0%** Transaction tracking (need receipts/status)
- ❌ **0%** Token allowances (need for swaps)
- ❌ **0%** Generic contract reads

### What's Missing for Full DEX/Swap Support
1. ❌ `check_token_allowance` - Critical for swaps
2. ❌ `call_contract_function` - Read DEX pool data
3. ❌ `get_transaction_details` - Track swap status

### What's Missing for Better UX
1. ❌ `get_transaction_details` - Transaction status tracking
2. ❌ `get_current_block` - Network status indicator
3. ❌ `filter_spam_nfts` - Clean NFT gallery

---

## 🚀 Next Steps

### Phase 1: Transaction Tracking (High Impact)
```typescript
// 1. Get Transaction Details Tool
export const getTransactionDetailsTool = new FunctionTool(
  async ({ txHash, chainId }) => {
    const tx = await alchemy.core.getTransaction(txHash);
    const receipt = await alchemy.core.getTransactionReceipt(txHash);
    return {
      status: receipt.status === 1 ? 'success' : 'failed',
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      // ... more details
    };
  },
  { name: 'get_transaction_details', ... }
);
```

### Phase 2: Swap Support (Enable DEX Features)
```typescript
// 2. Check Token Allowance Tool
export const checkTokenAllowanceTool = new FunctionTool(
  async ({ owner, spender, tokenAddress, chainId }) => {
    const data = encodeERC20Allowance(owner, spender);
    const result = await alchemy.core.call({
      to: tokenAddress,
      data,
    });
    return { allowance: decodeAllowance(result) };
  },
  { name: 'check_token_allowance', ... }
);

// 3. Generic Contract Read Tool
export const callContractReadTool = new FunctionTool(
  async ({ contractAddress, functionSignature, args, chainId }) => {
    const data = encodeFunctionCall(functionSignature, args);
    const result = await alchemy.core.call({
      to: contractAddress,
      data,
    });
    return { result: decodeResult(result) };
  },
  { name: 'call_contract_read', ... }
);
```

### Phase 3: Enhanced NFT Support
```typescript
// 4. NFT Metadata Tool
export const getNFTMetadataTool = new FunctionTool(
  async ({ contractAddress, tokenId, chainId }) => {
    const nft = await alchemy.nft.getNftMetadata(
      contractAddress,
      tokenId
    );
    return { /* full metadata */ };
  },
  { name: 'get_nft_metadata', ... }
);

// 5. Spam Filter Tool
export const filterSpamNFTsTool = new FunctionTool(
  async ({ contractAddress, chainId }) => {
    const isSpam = await alchemy.nft.isSpamContract(contractAddress);
    return { isSpam };
  },
  { name: 'is_spam_nft', ... }
);
```

---

## 💡 Implementation Priority Matrix

| Tool | Impact | Complexity | Priority |
|------|--------|------------|----------|
| `get_transaction_details` | 🔥 High | 🟢 Easy | **DO FIRST** |
| `check_token_allowance` | 🔥 High | 🟡 Medium | **DO SECOND** |
| `call_contract_read` | 🔥 High | 🔴 Hard | **DO THIRD** |
| `get_current_block` | 🔵 Medium | 🟢 Easy | Nice to have |
| `get_nft_metadata` | 🔵 Medium | 🟢 Easy | Nice to have |
| `filter_spam_nfts` | 🔵 Medium | 🟢 Easy | Nice to have |
| Block explorer tools | 🟢 Low | 🟡 Medium | Future |

---

## 📖 Useful Alchemy API Resources

- **Core API Docs**: https://docs.alchemy.com/reference/core-api-quickstart
- **NFT API Docs**: https://docs.alchemy.com/reference/nft-api-quickstart
- **Prices API Docs**: https://docs.alchemy.com/reference/token-api-quickstart
- **Transfers API Docs**: https://docs.alchemy.com/reference/transfers-api-quickstart
- **Webhooks/Notifications**: https://docs.alchemy.com/docs/notify-sdk-quickstart

---

## Current Status

✅ **Solid Foundation** - We have all essential read operations  
🎯 **Next Goal** - Add transaction tracking for better UX  
🚀 **Future** - Enable DEX features with allowance checks and contract reads

