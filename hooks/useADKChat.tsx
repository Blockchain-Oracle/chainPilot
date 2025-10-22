import { useState, useCallback, useRef, useEffect } from 'react';
import { getModelConfig } from '@/lib/ai/model-config';

interface MessagePart {
  type: string;
  text?: string;     // ADK uses 'text' field
  content?: string;  // Keep for backward compatibility
  [key: string]: any;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: MessagePart[];
  createdAt?: Date;
  toolCalls?: Array<{
    toolName: string;
    args: any;
    toolCallId: string;
  }>;
  toolResults?: any[];
}

interface UseADKChatOptions {
  id: string;
  initialMessages?: Message[];
  userId?: string;
  walletAddress?: string;
  onFinish?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export function useADKChat({
  id,
  initialMessages = [],
  userId,
  walletAddress,
  onFinish,
  onError,
}: UseADKChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);

  const append = useCallback(async (message: Message | { role: 'user'; content: string }) => {
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    // Create proper message structure with guaranteed ID
    let userMessage: Message;
    if ('content' in message && typeof message.content === 'string') {
      userMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        // Use 'text' field to match ADK expectation
        parts: [{ type: 'text', text: message.content }],
        createdAt: new Date(),
      };
    } else {
      const msgAsMessage = message as Message;
      // CRITICAL: Always ensure the message has an ID
      // Create new object to ensure immutability isn't an issue
      userMessage = {
        ...msgAsMessage,
        id: msgAsMessage.id || crypto.randomUUID(),
        createdAt: msgAsMessage.createdAt || new Date(),
      };

      if (!msgAsMessage.id) {
        console.warn('[useADKChat] Generated missing ID for user message');
      }
    }

    // Add user message to the list
    setMessages(prev => [...prev, userMessage]);

    // Create assistant message placeholder
    const assistantId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      parts: [],
      toolCalls: [],
      toolResults: [],
      createdAt: new Date(),
    };

    setStreamingMessage(assistantMessage);
    setMessages(prev => [...prev, assistantMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(walletAddress && { 'x-wallet-address': walletAddress }),
        },
        body: JSON.stringify({
          id,
          message: userMessage,
          selectedChatModel: getModelConfig().model,
          selectedVisibilityType: 'private',
          walletAddress,
          userId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[useADKChat] API request failed:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
        });
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let currentContent = '';

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);

              switch (data.type) {
                case 'message-start':
                  // Message initialization
                  break;

                case 'text-delta':
                  // Backend sends 'content' field, not 'textDelta'
                  const textChunk = data.content || data.textDelta || '';
                  currentContent += textChunk;
                  setMessages(prev => prev.map(msg => {
                    if (msg.id === assistantId) {
                      // Keep ALL non-text parts intact (tool parts)
                      const nonTextParts = msg.parts.filter(p => p.type !== 'text');
                      const textPart = { type: 'text', text: currentContent, content: currentContent };

                      return {
                        ...msg,
                        // Only ONE text part + all non-text parts (prevents duplicates)
                        parts: [...nonTextParts, textPart],
                      };
                    }
                    return msg;
                  }));
                  setStreamingMessage(prev => prev ? {
                    ...prev,
                    parts: prev.parts.filter(p => p.type.startsWith('tool-')).concat([
                      { type: 'text', text: currentContent, content: currentContent }
                    ]),
                  } : null);
                  break;

                case 'tool-call':
                  setMessages(prev => prev.map(msg => {
                    if (msg.id === assistantId) {
                      // Check if this tool call already exists to prevent duplicates
                      const toolAlreadyExists = msg.parts.some(
                        p => p.toolCallId === data.toolCallId
                      );

                      if (toolAlreadyExists) {
                        return msg; // Skip if already added
                      }

                      return {
                        ...msg,
                        toolCalls: [
                          ...(msg.toolCalls || []),
                          {
                            toolName: data.toolName,
                            args: data.args,
                            toolCallId: data.toolCallId,
                          },
                        ],
                        parts: [
                          ...msg.parts,
                          {
                            type: `tool-${data.toolName}`,
                            args: data.args,
                            toolCallId: data.toolCallId,
                            state: 'input-available',
                          },
                        ],
                      };
                    }
                    return msg;
                  }));
                  break;

                case 'tool-result':
                  setMessages(prev => {
                    const updated = prev.map(msg => {
                      if (msg.id === assistantId) {
                        const updatedParts = msg.parts.map(part => {
                          if (part.toolCallId === data.toolCallId) {
                            return {
                              ...part,
                              output: data.result,
                              state: 'output-available',
                            };
                          }
                          return part;
                        });

                        return {
                          ...msg,
                          toolResults: [
                            ...(msg.toolResults || []),
                            {
                              toolCallId: data.toolCallId,
                              result: data.result,
                            },
                          ],
                          parts: updatedParts,
                        };
                      }
                      return msg;
                    });

                    return updated;
                  });
                  break;

                case 'error':
                  throw new Error(data.error);

                case 'finish':
                  console.log('[useADKChat] Finish event received');
                  // Use setMessages with a callback to get the current state
                  setMessages(currentMessages => {
                    const finalMessage = currentMessages.find(m => m.id === assistantId);
                    console.log('[useADKChat] Final message found:', !!finalMessage, 'onFinish exists:', !!onFinish);
                    if (finalMessage && onFinish) {
                      console.log('[useADKChat] Calling onFinish callback');
                      onFinish(finalMessage);
                    }
                    return currentMessages;
                  });
                  setStreamingMessage(null);
                  break;
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Request was aborted, ignore
      } else {
        console.error('[useADKChat] Chat error:', error);
        if (onError) {
          onError(error);
        }
        // Add error message
        const errorText = `Error: ${error.message || 'Failed to get response'}`;
        setMessages(prev => prev.map(msg =>
          msg.id === assistantId
            ? {
                ...msg,
                parts: [{
                  type: 'text',
                  text: errorText,
                  content: errorText,  // Both for compatibility
                }],
              }
            : msg
        ));
      }
    } finally {
      setIsLoading(false);
      setStreamingMessage(null);
      abortControllerRef.current = null;
    }
  }, [id, userId, walletAddress, onFinish, onError, messages]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await append({ role: 'user', content: message });
  }, [input, isLoading, append]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const reload = useCallback(async () => {
    if (messages.length < 2) return;

    // Remove the last assistant message
    const newMessages = messages.slice(0, -1);
    setMessages(newMessages);

    // Resend the last user message
    const lastUserMessage = newMessages[newMessages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user') {
      // Check both 'text' and 'content' fields for compatibility
      const textPart = lastUserMessage.parts.find(p => p.type === 'text');
      const content = textPart?.text || textPart?.content;
      if (content) {
        await append({ role: 'user', content });
      }
    }
  }, [messages, append]);

  return {
    messages,
    append,
    reload,
    stop,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    setInput,
    streamingMessage,
  };
}