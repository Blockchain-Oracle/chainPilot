/**
 * Transaction Types for ChainPilot
 *
 * TypeScript types for all transaction-related data structures
 */

/**
 * Base transaction properties shared across all transaction types
 */
export interface BaseTransactionProps {
  from: string;
  chainId: number;
  gasEstimate?: string;
  gasPrice?: string;
  nonce?: number;
}

/**
 * Native ETH transfer transaction
 */
export interface EthTransferProps extends BaseTransactionProps {
  type: 'eth_transfer';
  to: string;
  amount: string; // Human-readable amount (e.g., "0.1")
  value: string; // Wei amount as string
  toEnsName?: string;
}

/**
 * ERC20 token transfer transaction
 */
export interface TokenTransferProps extends BaseTransactionProps {
  type: 'token_transfer';
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  to: string;
  amount: string; // Human-readable amount
  amountWei: string; // Base units as string
  data: string; // Encoded transfer function call
  toEnsName?: string;
}

/**
 * ERC20 token approval transaction
 */
export interface TokenApprovalProps extends BaseTransactionProps {
  type: 'token_approval';
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  spender: string;
  spenderName?: string; // e.g., "Uniswap V3 Router"
  amount: string; // Human-readable amount
  amountWei: string; // Base units as string
  data: string; // Encoded approve function call
  isUnlimited?: boolean; // true if approving max uint256
}

/**
 * Generic contract interaction transaction
 */
export interface ContractCallProps extends BaseTransactionProps {
  type: 'contract_call';
  contractAddress: string;
  contractName?: string;
  functionName: string;
  functionArgs?: any[];
  data: string; // Encoded function call
  value?: string; // Wei amount if payable
  abi?: any[]; // Optional ABI for decoding
  comment?: string;
}

/**
 * Approval requirement detection
 */
export interface ApprovalRequirement {
  required: boolean;
  tokenAddress: string;
  tokenSymbol: string;
  spender: string;
  currentAllowance: string;
  requiredAmount: string;
  needsApproval: boolean;
}

/**
 * Transaction status types
 */
export type TransactionStatus =
  | 'idle'
  | 'preparing'
  | 'awaiting_approval'
  | 'pending'
  | 'confirming'
  | 'success'
  | 'error';

/**
 * Transaction result
 */
export interface TransactionResult {
  hash: string;
  blockNumber?: number;
  confirmations?: number;
  status: 'success' | 'failed';
  gasUsed?: string;
  effectiveGasPrice?: string;
}

/**
 * Union type for all transaction props
 */
export type TransactionProps =
  | EthTransferProps
  | TokenTransferProps
  | TokenApprovalProps
  | ContractCallProps;

/**
 * Tool output wrapper for transaction preparation
 */
export interface PrepareTransactionOutput<T extends TransactionProps = TransactionProps> {
  success: boolean;
  transaction?: T;
  error?: string;
  approvalRequired?: ApprovalRequirement;
}
