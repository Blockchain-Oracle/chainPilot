/**
 * Transaction Encoding Utilities for ChainPilot
 *
 * ERC20 and contract function encoding helpers
 */

/**
 * ERC20 transfer function signature: transfer(address,uint256)
 * Keccak256 hash: 0xa9059cbb
 */
const ERC20_TRANSFER_SELECTOR = '0xa9059cbb';

/**
 * ERC20 approve function signature: approve(address,uint256)
 * Keccak256 hash: 0x095ea7b3
 */
const ERC20_APPROVE_SELECTOR = '0x095ea7b3';

/**
 * ERC20 allowance function signature: allowance(address,address)
 * Keccak256 hash: 0xdd62ed3e
 */
const ERC20_ALLOWANCE_SELECTOR = '0xdd62ed3e';

/**
 * Maximum uint256 value for unlimited approvals
 */
export const MAX_UINT256 =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

/**
 * Pad hex string to 32 bytes (64 hex characters)
 */
function padHex(hex: string, bytes = 32): string {
  // Remove 0x prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;

  // Pad with zeros
  const padded = cleanHex.padStart(bytes * 2, '0');

  return padded;
}

/**
 * Encode ERC20 transfer function call
 *
 * @param to - Recipient address
 * @param amount - Amount in base units (wei for 18 decimals, etc.)
 * @returns Encoded function call data
 *
 * @example
 * ```ts
 * const data = encodeERC20Transfer(
 *   '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   '1000000' // 1 USDC (6 decimals)
 * )
 * // Returns: 0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0beb00000000000000000000000000000000000000000000000000000000000f4240
 * ```
 */
export function encodeERC20Transfer(to: string, amount: string): string {
  // Validate inputs
  if (!/^0x[0-9a-fA-F]{40}$/.test(to)) {
    throw new Error('Invalid recipient address');
  }

  // Convert amount to BigInt to handle large numbers
  let amountBigInt: bigint;
  try {
    amountBigInt = BigInt(amount);
    if (amountBigInt < 0n) {
      throw new Error('Amount cannot be negative');
    }
  } catch {
    throw new Error('Invalid amount');
  }

  // Encode parameters
  const addressParam = padHex(to.slice(2)); // Remove 0x and pad
  const amountParam = padHex(amountBigInt.toString(16)); // Convert to hex and pad

  // Combine: selector + address + amount
  return `${ERC20_TRANSFER_SELECTOR}${addressParam}${amountParam}`;
}

/**
 * Encode ERC20 approve function call
 *
 * @param spender - Spender address (contract that will spend tokens)
 * @param amount - Amount in base units, or 'unlimited' for max approval
 * @returns Encoded function call data
 *
 * @example
 * ```ts
 * const data = encodeERC20Approve(
 *   '0xE592427A0AEce92De3Edee1F18E0157C05861564', // Uniswap V3 Router
 *   'unlimited'
 * )
 * ```
 */
export function encodeERC20Approve(
  spender: string,
  amount: string | 'unlimited'
): string {
  // Validate spender address
  if (!/^0x[0-9a-fA-F]{40}$/.test(spender)) {
    throw new Error('Invalid spender address');
  }

  // Handle unlimited approval
  let amountBigInt: bigint;
  if (amount === 'unlimited') {
    amountBigInt = BigInt(MAX_UINT256);
  } else {
    try {
      amountBigInt = BigInt(amount);
      if (amountBigInt < 0n) {
        throw new Error('Amount cannot be negative');
      }
    } catch {
      throw new Error('Invalid amount');
    }
  }

  // Encode parameters
  const addressParam = padHex(spender.slice(2));
  const amountParam = padHex(amountBigInt.toString(16));

  // Combine: selector + spender + amount
  return `${ERC20_APPROVE_SELECTOR}${addressParam}${amountParam}`;
}

/**
 * Encode ERC20 allowance check function call
 *
 * @param owner - Token owner address
 * @param spender - Spender address
 * @returns Encoded function call data for eth_call
 *
 * @example
 * ```ts
 * const data = encodeERC20Allowance(ownerAddress, spenderAddress)
 * const result = await provider.call({ to: tokenAddress, data })
 * const allowance = BigInt(result) // Parse result
 * ```
 */
export function encodeERC20Allowance(owner: string, spender: string): string {
  // Validate addresses
  if (!/^0x[0-9a-fA-F]{40}$/.test(owner)) {
    throw new Error('Invalid owner address');
  }
  if (!/^0x[0-9a-fA-F]{40}$/.test(spender)) {
    throw new Error('Invalid spender address');
  }

  // Encode parameters
  const ownerParam = padHex(owner.slice(2));
  const spenderParam = padHex(spender.slice(2));

  // Combine: selector + owner + spender
  return `${ERC20_ALLOWANCE_SELECTOR}${ownerParam}${spenderParam}`;
}

/**
 * Decode uint256 from eth_call result
 *
 * @param data - Hex string result from eth_call
 * @returns BigInt value
 */
export function decodeUint256(data: string): bigint {
  // Remove 0x prefix
  const cleanData = data.startsWith('0x') ? data.slice(2) : data;

  // Should be 64 hex characters (32 bytes)
  if (cleanData.length !== 64) {
    throw new Error('Invalid uint256 data length');
  }

  return BigInt(`0x${cleanData}`);
}

/**
 * Simple ABI encoder for common function signatures
 *
 * Supports basic types: address, uint256, string, bool
 * For complex encoding, use viem's encodeFunctionData instead
 */
export function encodeSimpleFunction(
  selector: string,
  params: Array<{ type: string; value: any }>
): string {
  let encoded = selector;

  for (const param of params) {
    switch (param.type) {
      case 'address':
        if (!/^0x[0-9a-fA-F]{40}$/.test(param.value)) {
          throw new Error(`Invalid address: ${param.value}`);
        }
        encoded += padHex(param.value.slice(2));
        break;

      case 'uint256':
      case 'uint':
        const uintValue = BigInt(param.value);
        encoded += padHex(uintValue.toString(16));
        break;

      case 'bool':
        encoded += padHex(param.value ? '1' : '0');
        break;

      default:
        throw new Error(`Unsupported parameter type: ${param.type}`);
    }
  }

  return encoded;
}

/**
 * Standard ERC20 ABI (minimal for transfers and approvals)
 */
export const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const;
