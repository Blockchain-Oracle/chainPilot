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
        console.log('[useADKChat] Generated missing ID for user message:', userMessage.id);
      }
    }

    console.log('[useADKChat] Prepared user message:', {
      id: userMessage.id,
      role: userMessage.role,
      partsCount: userMessage.parts?.length,
      hasId: !!userMessage.id,
      idType: typeof userMessage.id,
    });

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

    console.log('[useADKChat] Sending request to /api/chat:', {
      chatId: id,
      messageId: userMessage.id,
      walletAddress,
      userId,
    });

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
                  console.log('[useADKChat] Received text-delta:', {
                    hasContent: !!data.content,
                    hasTextDelta: !!data.textDelta,
                    chunk: textChunk,
                    chunkLength: textChunk.length,
                    dataKeys: Object.keys(data)
                  });
                  currentContent += textChunk;
                  setMessages(prev => prev.map(msg => {
                    if (msg.id === assistantId) {
                      // Find existing text part or create new one
                      const toolParts = msg.parts.filter(p => p.type.startsWith('tool-'));
                      const textPart = { type: 'text', text: currentContent, content: currentContent };

                      return {
                        ...msg,
                        // Keep tool parts, update/add text part
                        parts: [...toolParts, textPart],
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
                  console.log('[useADKChat] Received tool-call event:', {
                    toolName: data.toolName,
                    args: data.args,
                    toolCallId: data.toolCallId,
                  });
                  setMessages(prev => prev.map(msg =>
                    msg.id === assistantId
                      ? {
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
                              state: 'input-available', // Add state for loading display
                            },
                          ],
                        }
                      : msg
                  ));
                  break;

                case 'tool-result':
                  console.log('[useADKChat] Received tool-result event:', {
                    toolCallId: data.toolCallId,
                    toolName: data.toolName,
                    result: data.result,
                    resultKeys: data.result ? Object.keys(data.result) : [],
                    resultPreview: data.result ? JSON.stringify(data.result).substring(0, 200) : 'undefined',
                  });

                  setMessages(prev => {
                    const updated = prev.map(msg => {
                      if (msg.id === assistantId) {
                        console.log('[useADKChat] Found assistant message, current parts:', {
                          partsCount: msg.parts.length,
                          parts: msg.parts.map(p => ({
                            type: p.type,
                            toolCallId: p.toolCallId,
                            state: p.state,
                            hasOutput: !!p.output
                          }))
                        });

                        const updatedParts = msg.parts.map(part => {
                          if (part.toolCallId === data.toolCallId) {
                            console.log('[useADKChat] ✅ MATCHING tool part found! Updating with result:', {
                              toolCallId: part.toolCallId,
                              oldState: part.state,
                              newState: 'output-available',
                              resultExists: !!data.result,
                              result: data.result,
                            });
                            return {
                              ...part,
                              output: data.result, // Use 'output' field like in message.tsx
                              state: 'output-available', // Set state for card rendering
                            };
                          }
                          return part;
                        });

                        console.log('[useADKChat] Updated parts:', {
                          partsCount: updatedParts.length,
                          parts: updatedParts.map(p => ({
                            type: p.type,
                            toolCallId: p.toolCallId,
                            state: p.state,
                            hasOutput: !!p.output
                          }))
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

                    console.log('[useADKChat] Messages after tool-result update:', {
                      messageCount: updated.length,
                      assistantMessage: updated.find(m => m.id === assistantId)
                    });

                    return updated;
                  });
                  break;

                case 'error':
                  throw new Error(data.error);

                case 'finish':
                  const finalMessage = messages.find(m => m.id === assistantId);
                  if (finalMessage && onFinish) {
                    onFinish(finalMessage);
                  }
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
        console.log('Request was aborted');
      } else {
        console.error('Chat error:', error);
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