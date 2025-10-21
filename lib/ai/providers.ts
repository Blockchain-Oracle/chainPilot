/**
 * AI Providers for ADK
 *
 * This file provides a compatibility layer for legacy code that still uses
 * Vercel AI SDK patterns. New code should use ADK directly.
 */

import { google } from "@ai-sdk/google";

/**
 * Provider interface for backward compatibility
 * This is a minimal stub to satisfy imports while migrating to ADK
 */
export const myProvider = {
  languageModel: (modelId: string) => {
    // Map legacy model IDs to Google models for generateText usage
    if (modelId === "title-model") {
      return google("gemini-2.0-flash-exp");
    }
    return google("gemini-2.0-flash-exp");
  },
};

/**
 * Note: This is a compatibility shim. The main chat functionality
 * should use ADK directly via the useADKChat hook and /api/chat endpoint.
 */
