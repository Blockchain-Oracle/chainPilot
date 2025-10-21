import type { Message as ADKMessage } from "@/lib/adk/types";

/**
 * ChatMessage type that's compatible with ADK
 */
export type ChatMessage = ADKMessage;

export interface Attachment {
  name: string;
  url: string;
  contentType: string;
}
