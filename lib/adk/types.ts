/**
 * ADK Type Definitions
 *
 * This file defines types that are compatible with the ADK framework
 * and replaces the types previously imported from @ai-sdk/react
 */

/**
 * Message part represents a piece of content in a message
 */
export interface MessagePart {
  type: string;
  content?: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
  toolCallId?: string;
  state?: "input-available" | "output-available";
  output?: any;
  args?: any;
  result?: any;
  [key: string]: any;
}

/**
 * Message represents a single message in the chat
 */
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  parts: MessagePart[];
  createdAt?: Date;
  toolCalls?: Array<{
    toolName: string;
    args: any;
    toolCallId: string;
  }>;
  toolResults?: any[];
}

/**
 * Chat status types matching ADK patterns
 */
export type ChatStatus = "idle" | "streaming" | "pending" | "submitted" | "ready" | "error";

/**
 * ADK Chat Helpers interface
 * This replaces the UseChatHelpers type from @ai-sdk/react
 */
export interface ADKChatHelpers {
  messages: Message[];
  append: (message: Message | { role: "user"; content: string }) => Promise<void>;
  reload: () => Promise<void>;
  stop: () => void;
  isLoading: boolean;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  streamingMessage: Message | null;
  status: ChatStatus;
}

/**
 * Helper type for status property
 */
export type Status = ChatStatus;

/**
 * Helper type for setMessages function
 */
export type SetMessages = (messages: Message[] | ((prev: Message[]) => Message[])) => void;

/**
 * Helper type for sendMessage function
 */
export type SendMessage = (message: Message) => void;

/**
 * Helper type for regenerate function
 */
export type Regenerate = () => void;

/**
 * Helper type for stop function
 */
export type Stop = () => void;
