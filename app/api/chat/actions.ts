'use server';

import { cookies } from 'next/headers';
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import type { VisibilityType } from '@/components/visibility-selector';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import type { Message } from '@/lib/adk/types';

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  try {
    // Check for API key
    if (!process.env.GOOGLE_API_KEY) {
      console.warn('GOOGLE_API_KEY not configured, using fallback title');
      return 'New Chat';
    }

    // Use AI SDK directly with Google's model (following ADK pattern from AiSdkLlm)
    const { text: title } = await generateText({
      model: google('gemini-2.0-flash-exp'),
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
