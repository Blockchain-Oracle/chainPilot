'use server';

import { cookies } from 'next/headers';
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import type { VisibilityType } from '@/components/visibility-selector';
import { getModelConfig } from '@/lib/ai/model-config';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import type { Message } from '@/lib/adk/types';

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

export async function generateTitleFromUserMessage({
  message,
  selectedModel,
}: {
  message: Message;
  selectedModel?: string;
}) {
  try {
    // Get model configuration (falls back to default if not specified)
    const modelConfig = getModelConfig(selectedModel);
    
    // Check for API key
    if (!modelConfig.apiKey) {
      console.warn(`${modelConfig.provider} API key not configured, using fallback title`);
      return 'New Chat';
    }

    // Select the appropriate AI SDK model based on provider
    let aiModel;
    switch (modelConfig.provider) {
      case 'openai':
        aiModel = openai(modelConfig.model);
        break;
      case 'gemini':
        aiModel = google(modelConfig.model);
        break;
      case 'anthropic':
        aiModel = anthropic(modelConfig.model);
        break;
      default:
        console.warn(`Unsupported model provider: ${modelConfig.provider}, using fallback title`);
        return 'New Chat';
    }

    console.log(`[Title Generation] Using ${modelConfig.provider} model: ${modelConfig.model}`);

    // Use AI SDK with the selected model
    const { text: title } = await generateText({
      model: aiModel,
      system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
      prompt: JSON.stringify(message),
    });

    return title || 'New Chat';
  } catch (error) {
    console.error('Failed to generate title:', error);
    // Return a fallback title if generation fails
    return 'New Chat';
  }
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}
