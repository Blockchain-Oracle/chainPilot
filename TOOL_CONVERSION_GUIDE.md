# Tool Conversion Guide: FunctionTool → createTool

## Why Convert?

`FunctionTool` does NOT properly handle Zod schemas and causes the error:
```
❌ fieldValue.toUpperCase is not a function
```

This error occurs because `FunctionTool` tries to parse the function signature as a string, which fails with complex TypeScript types like `z.infer<typeof schema>`.

## Conversion Pattern

### BEFORE (FunctionTool - INCORRECT)
```typescript
import { FunctionTool } from '@iqai/adk';
import { z } from 'zod';

const schema = z.object({
  address: z.string().describe('The wallet address'),
  chainId: z.number().optional().default(1).describe('Chain ID'),
});

async function getTool({ address, chainId = 1 }: z.infer<typeof schema>) {
  // implementation
  return { success: true, data: {} };
}

export const myTool = new FunctionTool(getTool, {
  name: 'my_tool',
  description: 'Tool description',
});
```

### AFTER (createTool - CORRECT)
```typescript
import { createTool } from '@iqai/adk';
import { z } from 'zod';

export const myTool = createTool({
  name: 'my_tool',
  description: 'Tool description',
  schema: z.object({
    address: z.string().describe('The wallet address'),
    chainId: z.number().optional().default(1).describe('Chain ID'),
  }),
  fn: async ({ address, chainId = 1 }, context) => {
    // implementation
    return { success: true, data: {} };
  }
});
```

## Key Changes

1. **Import**: `FunctionTool` → `createTool`
2. **Structure**: Function + wrapper → Single object with `fn` property
3. **Schema**: Passed as `schema` property (NOT via TypeScript type)
4. **Context**: Second parameter `context` provides ToolContext (optional, can ignore)
5. **Export**: Export the tool directly (no separate function)

## Files to Convert

All files in `lib/adk/tools/` need conversion:

### Tokens (4 files)
- [x] `tokens/get-token-balance.ts` ✅ DONE
- [ ] `tokens/get-token-metadata.ts`
- [ ] `tokens/get-token-price.ts`
- [ ] `tokens/get-token-price-by-address.ts`

### NFTs (6 files)
- [ ] `nfts/get-nfts-owned.ts`
- [ ] `nfts/get-owners-for-nft.ts`
- [ ] `nfts/get-collections-for-owner.ts`
- [ ] `nfts/get-nft-metadata.ts`
- [ ] `nfts/get-contract-metadata.ts`
- [ ] `nfts/get-floor-price.ts`

### Account (2 files)
- [ ] `account/get-balance.ts`
- [ ] `account/get-transaction-history.ts`

### Transactions (5 files)
- [ ] `transactions/estimate-gas.ts`
- [ ] `transactions/prepare-eth-transfer.ts`
- [ ] `transactions/prepare-token-transfer.ts`
- [ ] `transactions/prepare-token-approval.ts`
- [ ] `transactions/prepare-contract-call.ts`

### Utils (2 files)
- [ ] `utils/resolve-ens.ts`
- [ ] `utils/get-gas-price.ts`

## Example: get-token-balance.ts

See `/Users/apple/dev/hackathon/ADK/adk-coinbase-terminal/lib/adk/tools/tokens/get-token-balance.ts` for the complete converted example.

## Testing

After converting each tool:
1. Start the dev server: `pnpm dev`
2. Send a test message in the UI
3. Check the console for errors
4. Verify the tool is listed in the ADK debug output

## Benefits of createTool

✅ Proper Zod schema validation
✅ Automatic JSON Schema generation for Gemini
✅ Better TypeScript inference
✅ Access to ToolContext (session, state, memory)
✅ No string parsing issues
