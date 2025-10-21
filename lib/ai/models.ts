/**
 * AI Model configuration for ADK
 *
 * This file defines the default chat model used throughout the application.
 * The model is compatible with Google's Gemini AI via ADK.
 */

export const DEFAULT_CHAT_MODEL = "gemini-2.0-flash-exp";

export const AVAILABLE_MODELS = {
  GEMINI_FLASH: "gemini-2.0-flash-exp",
  GEMINI_PRO: "gemini-2.5-flash",
} as const;

export type ChatModel = {
  id: string;
  label: string;
  provider: string;
};

export const CHAT_MODELS: Record<string, ChatModel> = {
  "gemini-2.0-flash-exp": {
    id: "gemini-2.0-flash-exp",
    label: "Gemini 2.0 Flash",
    provider: "google",
  },
  "gemini-2.5-flash": {
    id: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    provider: "google",
  },
};
