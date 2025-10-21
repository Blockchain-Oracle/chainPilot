/**
 * Validation Utilities for ChainPilot
 *
 * Address and amount validation helpers
 */

/**
 * Check if a string is a valid Ethereum address
 */
export function isAddress(address: string): boolean {
  if (typeof address !== 'string') return false;

  // Check basic format: starts with 0x and is 42 characters
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return false;

  // Simple checksum validation could be added here
  // For now, basic format check is sufficient
  return true;
}

/**
 * Check if a string is a valid private key
 */
export function isPrivateKey(key: string): boolean {
  if (typeof key !== 'string') return false;

  // Private key: 64 hex characters, optionally prefixed with 0x
  const cleanKey = key.startsWith('0x') ? key.slice(2) : key;
  return /^[0-9a-fA-F]{64}$/.test(cleanKey);
}

/**
 * Validate and parse amount string to ensure it's a valid number
 */
export function validateAmount(amount: string): { valid: boolean; error?: string } {
  if (typeof amount !== 'string') {
    return { valid: false, error: 'Amount must be a string' };
  }

  // Remove whitespace
  const trimmed = amount.trim();

  if (trimmed === '') {
    return { valid: false, error: 'Amount cannot be empty' };
  }

  // Check if it's a valid number
  const num = parseFloat(trimmed);

  if (isNaN(num)) {
    return { valid: false, error: 'Amount must be a valid number' };
  }

  if (num <= 0) {
    return { valid: false, error: 'Amount must be greater than zero' };
  }

  if (!isFinite(num)) {
    return { valid: false, error: 'Amount must be finite' };
  }

  return { valid: true };
}

/**
 * Validate chain ID
 */
export function validateChainId(chainId: number): { valid: boolean; error?: string } {
  const supportedChains = [
    1, // Ethereum Mainnet
    11155111, // Sepolia
    8453, // Base Mainnet
    84532, // Base Sepolia
    42161, // Arbitrum One
    421614, // Arbitrum Sepolia
    10, // Optimism
    11155420, // Optimism Sepolia
    137, // Polygon
    80002, // Polygon Amoy
  ];

  if (!supportedChains.includes(chainId)) {
    return {
      valid: false,
      error: `Unsupported chain ID: ${chainId}. Supported chains: ${supportedChains.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Validate transaction value (wei amount)
 */
export function validateValue(value: string): { valid: boolean; error?: string } {
  if (typeof value !== 'string') {
    return { valid: false, error: 'Value must be a string' };
  }

  // Should be a valid bigint string
  try {
    const bigIntValue = BigInt(value);
    if (bigIntValue < 0n) {
      return { valid: false, error: 'Value cannot be negative' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Value must be a valid integer string' };
  }
}

/**
 * Shorten an Ethereum address for display
 * @param address - Full address
 * @param chars - Number of characters to show on each side (default 4)
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!isAddress(address)) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format wei amount to human-readable ETH
 */
export function formatEth(wei: string | bigint, decimals = 4): string {
  try {
    const weiValue = typeof wei === 'string' ? BigInt(wei) : wei;
    const eth = Number(weiValue) / 1e18;
    return eth.toFixed(decimals);
  } catch {
    return '0';
  }
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(
  amount: string | bigint,
  tokenDecimals: number,
  displayDecimals = 4
): string {
  try {
    const amountValue = typeof amount === 'string' ? BigInt(amount) : amount;
    const divisor = 10 ** tokenDecimals;
    const value = Number(amountValue) / divisor;
    return value.toFixed(displayDecimals);
  } catch {
    return '0';
  }
}

/**
 * Parse human-readable amount to wei
 */
export function parseEthToWei(eth: string): string {
  try {
    const value = parseFloat(eth);
    if (isNaN(value) || value < 0) {
      throw new Error('Invalid ETH amount');
    }
    // Convert to wei (18 decimals) using BigInt to avoid precision issues
    const weiValue = BigInt(Math.floor(value * 1e18));
    return weiValue.toString();
  } catch {
    throw new Error('Failed to parse ETH amount');
  }
}

/**
 * Parse human-readable token amount to base units
 */
export function parseTokenAmount(amount: string, decimals: number): string {
  try {
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) {
      throw new Error('Invalid token amount');
    }
    // Convert to base units
    const baseValue = BigInt(Math.floor(value * 10 ** decimals));
    return baseValue.toString();
  } catch {
    throw new Error('Failed to parse token amount');
  }
}
