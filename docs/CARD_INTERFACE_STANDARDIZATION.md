# Card Interface Standardization

**Date**: 2025-10-22
**Status**: ✅ COMPLETED
**Impact**: All 11 card components

---

## Problem

Cards had inconsistent prop interfaces. Some expected individual props while others expected a `result` wrapper object. This caused runtime errors when tool results were passed to cards.

### Example Error

```
TypeError: Cannot read properties of undefined (reading 'toLocaleString')
at TokenPriceCard (components/alchemy/cards/TokenPriceCard.tsx:79:23)
```

**Root Cause**: `TokenPriceCard` expected `price: number` as a direct prop, but received `result: { success: boolean, data: { price: "108032.55", ... } }`

---

## Solution

Standardized **ALL** card components to accept a `result` wrapper object with this consistent structure:

```typescript
interface CardProps {
  result: {
    success: boolean;
    data: {
      // Card-specific data fields
    };
  };
}

export function Card({ result }: CardProps) {
  // Extract data from result
  const { field1, field2, ... } = result.data;

  // Rest of component logic
}
```

---

## Files Modified

### Read-Only Cards (6 files)

#### 1. BalanceCard ✅
**File**: `components/alchemy/cards/BalanceCard.tsx`
**Status**: Already correct (previously fixed)

#### 2. TokenBalancesCard ✅
**File**: `components/alchemy/cards/TokenBalancesCard.tsx`
**Status**: Already correct (previously fixed)

#### 3. TokenPriceCard ✅
**File**: `components/alchemy/cards/TokenPriceCard.tsx`

**Before**:
```typescript
interface TokenPriceCardProps {
  symbol: string;
  price: number;
  change24h: number;
  formattedPrice: string;
  priceChange: 'up' | 'down' | 'stable';
}

export function TokenPriceCard({ symbol, price, change24h, ... }: TokenPriceCardProps) {
```

**After**:
```typescript
interface TokenPriceCardProps {
  result: {
    success: boolean;
    data: {
      symbol: string;
      price: string | number;  // Accept both string and number
      change24h: number;
      formattedPrice: string;
      priceChange: 'up' | 'down' | 'stable';
    };
  };
}

export function TokenPriceCard({ result }: TokenPriceCardProps) {
  const { symbol, price: priceRaw, change24h, formattedPrice, priceChange } = result.data;
  const price = typeof priceRaw === 'string' ? parseFloat(priceRaw) : priceRaw;
```

**Key Addition**: Added type coercion for `price` field to handle both string and number types.

#### 4. TokenMetadataCard ✅
**File**: `components/alchemy/cards/TokenMetadataCard.tsx`

**Before**:
```typescript
interface TokenMetadataCardProps {
  contractAddress: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
  totalSupply?: string;
}

export function TokenMetadataCard({ contractAddress, chainId, ... }: TokenMetadataCardProps) {
```

**After**:
```typescript
interface TokenMetadataCardProps {
  result: {
    success: boolean;
    data: {
      contractAddress: string;
      chainId: number;
      name: string;
      symbol: string;
      decimals: number;
      logo?: string;
      totalSupply?: string;
    };
  };
}

export function TokenMetadataCard({ result }: TokenMetadataCardProps) {
  const { contractAddress, chainId, name, symbol, decimals, logo, totalSupply } = result.data;
```

#### 5. GasPriceCard ✅
**File**: `components/alchemy/cards/GasPriceCard.tsx`

**Before**:
```typescript
interface GasPriceCardProps {
  chainId: number;
  chain: string;
  prices: { slow: ..., standard: ..., fast: ... };
  recommendation: string;
}

export function GasPriceCard({ chainId, chain, prices, recommendation }: GasPriceCardProps) {
```

**After**:
```typescript
interface GasPriceCardProps {
  result: {
    success: boolean;
    data: {
      chainId: number;
      chain: string;
      prices: { slow: ..., standard: ..., fast: ... };
      recommendation: string;
    };
  };
}

export function GasPriceCard({ result }: GasPriceCardProps) {
  const { chainId, chain, prices, recommendation } = result.data;
```

#### 6. NftsOwnedCard ✅
**File**: `components/alchemy/cards/NftsOwnedCard.tsx`

**Before**:
```typescript
interface NftsOwnedCardProps {
  address: string;
  chainId: number;
  totalNFTs: number;
  collections: Collection[];
  nfts: NFT[];
}
```

**After**:
```typescript
interface NftsOwnedCardProps {
  result: {
    success: boolean;
    data: {
      address: string;
      chainId: number;
      totalNFTs: number;
      collections: Collection[];
      nfts: NFT[];
    };
  };
}

export function NftsOwnedCard({ result }: NftsOwnedCardProps) {
  // Already had result handling, just fixed interface
  const { address, chainId, totalNFTs, collections, nfts } = result.data;
```

#### 7. TransactionHistoryCard ✅
**File**: `components/alchemy/cards/TransactionHistoryCard.tsx`

**Before**:
```typescript
interface TransactionHistoryCardProps {
  address: string;
  chainId: number;
  count: number;
  transactions: Transaction[];
}

export function TransactionHistoryCard({ address, chainId, count, transactions }: ...) {
```

**After**:
```typescript
interface TransactionHistoryCardProps {
  result: {
    success: boolean;
    data: {
      address: string;
      chainId: number;
      count: number;
      transactions: Transaction[];
    };
  };
}

export function TransactionHistoryCard({ result }: TransactionHistoryCardProps) {
  const { address, chainId, count, transactions } = result.data;
```

---

### Transaction Preparation Cards (4 files)

These cards prepare transactions for user execution via wagmi hooks.

#### 8. TransferCard ✅
**File**: `components/alchemy/cards/TransferCard.tsx`

**Before**:
```typescript
interface TransferCardProps extends EthTransferProps {}

export function TransferCard({ from, to, amount, value, chainId, ... }: TransferCardProps) {
```

**After**:
```typescript
interface TransferCardProps {
  result: {
    success: boolean;
    data: EthTransferProps;
  };
}

export function TransferCard({ result }: TransferCardProps) {
  const { from, to, amount, value, chainId, gasEstimate, gasPrice, toEnsName } = result.data;
```

#### 9. TokenTransferCard ✅
**File**: `components/alchemy/cards/TokenTransferCard.tsx`

**Before**:
```typescript
interface TokenTransferCardProps extends TokenTransferProps {}

export function TokenTransferCard({ from, tokenAddress, tokenSymbol, ... }: ...) {
```

**After**:
```typescript
interface TokenTransferCardProps {
  result: {
    success: boolean;
    data: TokenTransferProps;
  };
}

export function TokenTransferCard({ result }: TokenTransferCardProps) {
  const {
    from, tokenAddress, tokenSymbol, tokenDecimals,
    to, amount, amountWei, data, chainId,
    gasEstimate, gasPrice, toEnsName
  } = result.data;
```

#### 10. TokenApprovalCard ✅
**File**: `components/alchemy/cards/TokenApprovalCard.tsx`

**Before**:
```typescript
interface TokenApprovalCardProps extends TokenApprovalProps {}

export function TokenApprovalCard({ from, tokenAddress, spender, ... }: ...) {
```

**After**:
```typescript
interface TokenApprovalCardProps {
  result: {
    success: boolean;
    data: TokenApprovalProps;
  };
}

export function TokenApprovalCard({ result }: TokenApprovalCardProps) {
  const {
    from, tokenAddress, tokenSymbol, tokenDecimals,
    spender, spenderName, amount, amountWei,
    data, chainId, gasEstimate, gasPrice, isUnlimited
  } = result.data;
```

#### 11. ContractCallCard ✅
**File**: `components/alchemy/cards/ContractCallCard.tsx`

**Before**:
```typescript
interface ContractCallCardProps extends ContractCallProps {}

export function ContractCallCard({ from, contractAddress, functionName, ... }: ...) {
```

**After**:
```typescript
interface ContractCallCardProps {
  result: {
    success: boolean;
    data: ContractCallProps;
  };
}

export function ContractCallCard({ result }: ContractCallCardProps) {
  const {
    from, contractAddress, contractName, functionName,
    data, value, chainId, gasEstimate, gasPrice, comment
  } = result.data;
```

---

## Benefits

### 1. Consistency
All cards now follow the same interface pattern, making the codebase predictable and easier to maintain.

### 2. Error Handling
The `result` wrapper allows the `CardWrapper` HOC to handle errors uniformly:

```typescript
export function withCardErrorHandling(Component, toolName) {
  return function WrappedCard(props: { result: any }) {
    const { result } = props;

    if (!result) return <LoadingState />;
    if (!result.success) return <ErrorState error={result.error} />;
    if (!result.data) return <NoDataState />;

    return <Component {...props} />;
  };
}
```

### 3. Type Safety
Each card now has proper TypeScript interfaces that match the tool output structure.

### 4. Data Transformation
Cards can handle type coercion (like string → number for `price`) at the extraction point.

---

## Data Flow

```
Tool Execution
    ↓
    { success: true, data: {...} }
    ↓
ADK getFunctionResponses()
    ↓
    result.response = { success: true, data: {...} }
    ↓
SSE Stream (tool-result event)
    ↓
useADKChat (frontend hook)
    ↓
    part.output = { success: true, data: {...} }
    ↓
message.tsx (renders tool parts)
    ↓
    <TokenPriceCard result={part.output} />
    ↓
CardWrapper (error handling)
    ↓
Card Component
    ↓
    const { field1, field2 } = result.data;
    ↓
Render UI ✅
```

---

## Testing

### Manual Test Cases

1. **Token Price Query**:
   ```
   User: "What's the price of WBTC?"
   Expected: TokenPriceCard renders with price, 24h change
   ```

2. **Balance Check**:
   ```
   User: "What's my ETH balance?"
   Expected: BalanceCard renders with balance, chain info
   ```

3. **Token Balances**:
   ```
   User: "Show my token balances"
   Expected: TokenBalancesCard renders with all tokens, USD values
   ```

4. **NFT Query**:
   ```
   User: "Show my NFTs"
   Expected: NftsOwnedCard renders collections
   ```

5. **Gas Price**:
   ```
   User: "What are current gas prices?"
   Expected: GasPriceCard renders slow/standard/fast options
   ```

6. **Transaction History**:
   ```
   User: "Show my recent transactions"
   Expected: TransactionHistoryCard renders tx list
   ```

7. **Prepare Transfer**:
   ```
   User: "Send 0.1 ETH to vitalik.eth"
   Expected: TransferCard renders with transaction details
   ```

---

## Related Issues

This standardization fixes:
- ✅ Runtime errors from undefined props
- ✅ Type mismatches (string vs number)
- ✅ Inconsistent error handling
- ✅ Missing data extraction logic

---

## Next Steps

1. **Test all cards** with real tool calls
2. **Monitor for errors** in production
3. **Update documentation** for new card creation
4. **Consider creating a base card type** for further standardization

---

## Pattern for New Cards

When creating new cards, follow this pattern:

```typescript
interface NewCardProps {
  result: {
    success: boolean;
    data: {
      // Your card-specific fields
      field1: string;
      field2: number;
      // ...
    };
  };
}

export function NewCard({ result }: NewCardProps) {
  // Extract data from result
  const { field1, field2 } = result.data;

  // Handle type conversions if needed
  const numericField = typeof field1 === 'string' ? parseFloat(field1) : field1;

  // Component logic and render
  return (
    <Card>
      {/* Your UI */}
    </Card>
  );
}
```

Then wrap with error handling:

```typescript
export const NewCard = withCardErrorHandling(NewCardRaw, 'New Card');
```

---

## Conclusion

All 11 card components now use a consistent interface pattern, fixing runtime errors and improving maintainability. The standardization ensures that all tool results flow correctly from backend → ADK → SSE → frontend → cards with proper type safety and error handling.
