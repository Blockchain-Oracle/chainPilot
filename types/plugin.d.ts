/**
 * Jupiter Plugin TypeScript Declarations
 *
 * Full type definitions for Jupiter Plugin integration
 * Based on: https://github.com/jup-ag/plugin/blob/main/src/types/index.d.ts
 */

import type { CSSProperties } from 'react';
import type { WalletContextState } from '@solana/wallet-adapter-react';

declare global {
  interface Window {
    Jupiter: JupiterPlugin;
  }
}

export type WidgetPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
export type WidgetSize = 'sm' | 'default';
export type SwapMode = "ExactInOrOut" | "ExactIn" | "ExactOut";
export type DEFAULT_EXPLORER = 'Solana Explorer' | 'Solscan' | 'Solana Beach' | 'SolanaFM';

export interface FormProps {
  swapMode?: SwapMode;
  initialAmount?: string;
  initialInputMint?: string;
  initialOutputMint?: string;
  fixedAmount?: boolean;
  fixedMint?: string;
  referralAccount?: string;
  referralFee?: number;
}

export interface IForm {
  fromMint: string;
  toMint: string;
  fromValue: string;
  toValue: string;
}

export interface IScreen {
  displayMode: 'modal' | 'integrated' | 'widget';
  isOpen: boolean;
}

export interface SwapResult {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  txid: string;
}

export interface QuoteResponse {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  priceImpactPct: number;
  marketInfos: any[];
}

export interface TransactionError {
  message: string;
  code?: string;
}

export interface IInit {
  localStoragePrefix?: string;
  formProps?: FormProps;
  defaultExplorer?: DEFAULT_EXPLORER;
  autoConnect?: boolean;
  displayMode?: 'modal' | 'integrated' | 'widget';
  integratedTargetId?: string;
  widgetStyle?: {
    position?: WidgetPosition;
    size?: WidgetSize;
  };
  containerStyles?: CSSProperties;
  containerClassName?: string;
  enableWalletPassthrough?: boolean;
  passthroughWalletContextState?: WalletContextState;
  onRequestConnectWallet?: () => void | Promise<void>;
  onSwapError?: ({
    error,
    quoteResponseMeta,
  }: {
    error?: TransactionError;
    quoteResponseMeta: QuoteResponse | null;
  }) => void;
  onSuccess?: ({
    txid,
    swapResult,
    quoteResponseMeta,
  }: {
    txid: string;
    swapResult: SwapResult;
    quoteResponseMeta: QuoteResponse | null;
  }) => void;
  onFormUpdate?: (form: IForm) => void;
  onScreenUpdate?: (screen: IScreen) => void;
  branding?: {
    logoUri?: string;
    name?: string;
  };
}

export interface JupiterPlugin {
  _instance: JSX.Element | null;
  init: (props: IInit) => void;
  resume: () => void;
  close: () => void;
  root: any | null;
  enableWalletPassthrough: boolean;
  onRequestConnectWallet: IInit['onRequestConnectWallet'];
  store: any;
  syncProps: (props: { passthroughWalletContextState?: IInit['passthroughWalletContextState'] }) => void;
  onSwapError: IInit['onSwapError'];
  onSuccess: IInit['onSuccess'];
  onFormUpdate: IInit['onFormUpdate'];
  onScreenUpdate: IInit['onScreenUpdate'];
  localStoragePrefix: string;
}

export {};
