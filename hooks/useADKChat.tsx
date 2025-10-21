import { useState, useCallback, useRef, useEffect } from 'react';

interface MessagePart {
  type: string;
  content?: string;
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

    // Create proper message structure
    let userMessage: Message;
    if ('content' in message && typeof message.content === 'string') {
      userMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        parts: [{ type: 'text', content: message.content }],
        createdAt: new Date(),
      };
    } else {
      userMessage = message as Message;
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
          selectedChatModel: 'gemini-2.0-flash-exp',
          selectedVisibilityType: 'private',
          walletAddress,
          userId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
                  currentContent += data.textDelta;
                  setMessages(prev => prev.map(msg =>
                    msg.id === assistantId
                      ? {
                          ...msg,
                          parts: [{ type: 'text', content: currentContent }],
                        }
                      : msg
                  ));
                  setStreamingMessage(prev => prev ? {
                    ...prev,
                    parts: [{ type: 'text', content: currentContent }],
                  } : null);
                  break;

                case 'tool-call':
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
                            },
                          ],
                        }
                      : msg
                  ));
                  break;

                case 'tool-result':
                  setMessages(prev => prev.map(msg =>
                    msg.id === assistantId
                      ? {
                          ...msg,
                          toolResults: [
                            ...(msg.toolResults || []),
                            {
                              toolCallId: data.toolCallId,
                              result: data.result,
                            },
                          ],
                          parts: msg.parts.map(part =>
                            part.toolCallId === data.toolCallId
                              ? { ...part, result: data.result }
                              : part
                          ),
                        }
                      : msg
                  ));
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
        setMessages(prev => prev.map(msg =>
          msg.id === assistantId
            ? {
                ...msg,
                parts: [{
                  type: 'text',
                  content: `Error: ${error.message || 'Failed to get response'}`,
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
      const content = lastUserMessage.parts
        .find(p => p.type === 'text')?.content;
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