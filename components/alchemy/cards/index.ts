/**
 * Alchemy Cards - Central Export
 *
 * All display and transaction cards for ADK tools
 * Wrapped with error handling to prevent crashes from undefined data
 */

import { withCardErrorHandling } from './CardWrapper';
import { NftsOwnedCard as NftsOwnedCardRaw } from './NftsOwnedCard';
import { BalanceCard as BalanceCardRaw } from './BalanceCard';
import { TokenBalancesCard as TokenBalancesCardRaw } from './TokenBalancesCard';
import { TransactionHistoryCard as TransactionHistoryCardRaw } from './TransactionHistoryCard';
import { TokenMetadataCard as TokenMetadataCardRaw } from './TokenMetadataCard';
import { TokenPriceCard as TokenPriceCardRaw } from './TokenPriceCard';
import { GasPriceCard as GasPriceCardRaw } from './GasPriceCard';
import { TransferCard as TransferCardRaw } from './TransferCard';
import { TokenTransferCard as TokenTransferCardRaw } from './TokenTransferCard';
import { TokenApprovalCard as TokenApprovalCardRaw } from './TokenApprovalCard';
import { ContractCallCard as ContractCallCardRaw } from './ContractCallCard';

// Wrap all cards with error handling to gracefully handle undefined/null data
export const NftsOwnedCard = withCardErrorHandling(NftsOwnedCardRaw, 'NFT Collections');
export const BalanceCard = withCardErrorHandling(BalanceCardRaw, 'Balance');
export const TokenBalancesCard = withCardErrorHandling(TokenBalancesCardRaw, 'Token Balances');
export const TransactionHistoryCard = withCardErrorHandling(TransactionHistoryCardRaw, 'Transaction History');
export const TokenMetadataCard = withCardErrorHandling(TokenMetadataCardRaw, 'Token Metadata');
export const TokenPriceCard = withCardErrorHandling(TokenPriceCardRaw, 'Token Price');
export const GasPriceCard = withCardErrorHandling(GasPriceCardRaw, 'Gas Price');
export const TransferCard = withCardErrorHandling(TransferCardRaw, 'Transfer');
export const TokenTransferCard = withCardErrorHandling(TokenTransferCardRaw, 'Token Transfer');
export const TokenApprovalCard = withCardErrorHandling(TokenApprovalCardRaw, 'Token Approval');
export const ContractCallCard = withCardErrorHandling(ContractCallCardRaw, 'Contract Call');
