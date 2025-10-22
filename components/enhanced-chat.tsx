"use client";

import { SparklesIcon } from "./icons";
import { SendHorizonal, User, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useEffect, useRef, useState, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askChainPilot, getChatHistory } from "@/app/_actions/chat";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import { Markdown } from "@/components/markdown";

// Import Alchemy card components for generative UI
import { BalanceCard } from "@/components/alchemy/cards/BalanceCard";
import { TokenPriceCard } from "@/components/alchemy/cards/TokenPriceCard";
import { GasPriceCard } from "@/components/alchemy/cards/GasPriceCard";
import { NftsOwnedCard } from "@/components/alchemy/cards/NftsOwnedCard";
import { TokenBalancesCard } from "@/components/alchemy/cards/TokenBalancesCard";
import { TransactionHistoryCard } from "@/components/alchemy/cards/TransactionHistoryCard";
import { TokenMetadataCard } from "@/components/alchemy/cards/TokenMetadataCard";
import { TransferCard } from "@/components/alchemy/cards/TransferCard";
import { TokenTransferCard } from "@/components/alchemy/cards/TokenTransferCard";
import { TokenApprovalCard } from "@/components/alchemy/cards/TokenApprovalCard";
import { ContractCallCard } from "@/components/alchemy/cards/ContractCallCard";

type MessagePart = {
  type: "text" | "tool_call" | "tool_result";
  text?: string;
  tool_name?: string;
  tool_call_id?: string;
  tool_result?: any;
};

type Message = {
  role: "user" | "agent";
  content: string | MessagePart[];
  id: string;
};

interface EnhancedChatProps {
  chatId: string;
}

export const EnhancedChat = ({ chatId }: EnhancedChatProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount();
  const { toggleSidebar, open: sidebarOpen } = useSidebar();

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      if (!isConnected || !address || !chatId) {
        setIsLoadingHistory(false);
        return;
      }

      try {
        const result = await getChatHistory(chatId, address);
        if (result.success && result.messages) {
          setMessages(result.messages);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [chatId, address, isConnected]);

  const generateId = () =>
    crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

  const createMessageParts = (
    textResponse: string,
    toolResults?: Array<{ toolName: string; result: any }>
  ): MessagePart[] => {
    console.log('[createMessageParts] Input:', { textResponse, toolResults });

    const parts: MessagePart[] = [];

    // Add tool result cards first
    if (toolResults && toolResults.length > 0) {
      console.log('[createMessageParts] Adding tool results:', toolResults.length);
      for (const toolResult of toolResults) {
        console.log('[createMessageParts] Adding tool result:', toolResult);
        parts.push({
          type: "tool_result",
          tool_name: toolResult.toolName,
          tool_result: toolResult.result,
        });
      }
    } else {
      console.log('[createMessageParts] No tool results to add');
    }

    // Add text response
    if (textResponse && textResponse.trim()) {
      console.log('[createMessageParts] Adding text response');
      parts.push({
        type: "text",
        text: textResponse,
      });
    }

    console.log('[createMessageParts] Final parts:', parts);
    return parts;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await askChainPilot(input, chatId, address);

      console.log('[EnhancedChat] Result from askChainPilot:', result);

      if (result.success && result.response) {
        console.log('[EnhancedChat] Tool results:', result.toolResults);

        const messageParts = createMessageParts(result.response, result.toolResults);
        console.log('[EnhancedChat] Created message parts:', messageParts);

        const agentMessage: Message = {
          id: generateId(),
          role: "agent",
          content: messageParts,
        };

        console.log('[EnhancedChat] Agent message:', agentMessage);
        setMessages((prev) => [...prev, agentMessage]);
      } else {
        throw new Error(result.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "agent",
          content: "❌ Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // CardWrapper for tool result cards with consistent styling - no animation to prevent shaking on re-renders
  const CardWrapper = memo(({ children, id }: { children: React.ReactNode; id: string }) => (
    <div key={id} className="vet-tool-card">
      {children}
    </div>
  ));

  // Render tool result card based on tool name
  const renderToolResultCard = (toolName: string, result: any, key: React.Key) => {
    console.log('[renderToolResultCard] Rendering card for:', toolName);
    console.log('[renderToolResultCard] Result data:', result);

    const cardId = `${toolName}-${key}`;

    // Map tool names to specific card components
    switch (toolName) {
      case "get_balance":
        return (
          <CardWrapper key={key} id={cardId}>
            <BalanceCard result={result} />
          </CardWrapper>
        );

      case "get_token_price":
      case "get_token_price_by_address":
        return (
          <CardWrapper key={key} id={cardId}>
            <TokenPriceCard result={result} />
          </CardWrapper>
        );

      case "get_gas_price":
        return (
          <CardWrapper key={key} id={cardId}>
            <GasPriceCard result={result} />
          </CardWrapper>
        );

      case "get_nfts_owned":
      case "get_collections_for_owner":
        return (
          <CardWrapper key={key} id={cardId}>
            <NftsOwnedCard result={result} />
          </CardWrapper>
        );

      case "get_token_balances":
        return (
          <CardWrapper key={key} id={cardId}>
            <TokenBalancesCard result={result} />
          </CardWrapper>
        );

      case "get_transaction_history":
        return (
          <CardWrapper key={key} id={cardId}>
            <TransactionHistoryCard result={result} />
          </CardWrapper>
        );

      case "get_token_metadata":
        return (
          <CardWrapper key={key} id={cardId}>
            <TokenMetadataCard result={result} />
          </CardWrapper>
        );

      case "prepare_eth_transfer":
        return (
          <CardWrapper key={key} id={cardId}>
            <TransferCard result={result} />
          </CardWrapper>
        );

      case "prepare_token_transfer":
        return (
          <CardWrapper key={key} id={cardId}>
            <TokenTransferCard result={result} />
          </CardWrapper>
        );

      case "prepare_token_approval":
        return (
          <CardWrapper key={key} id={cardId}>
            <TokenApprovalCard result={result} />
          </CardWrapper>
        );

      case "prepare_contract_call":
        return (
          <CardWrapper key={key} id={cardId}>
            <ContractCallCard result={result} />
          </CardWrapper>
        );

      default:
        console.log('[renderToolResultCard] No specific card for:', toolName);
        // Fallback to generic JSON display
        return (
          <CardWrapper key={key} id={cardId}>
            <div className="vet-glass-card p-4">
              <div className="text-sm font-medium text-vet-text-primary mb-2">
                {toolName}
              </div>
              <pre className="text-xs text-vet-text-secondary bg-vet-surface rounded p-2 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </CardWrapper>
        );
    }
  };

  const renderMessageContent = (content: string | MessagePart[]) => {
    // Handle simple string content
    if (typeof content === "string") {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    // Handle structured content with tool results
    return (
      <div className="space-y-3">
        {content.map((part, idx) => {
          if (part.type === "text" && part.text) {
            return (
              <p key={idx} className="whitespace-pre-wrap">
                {part.text}
              </p>
            );
          }

          if (part.type === "tool_result" && part.tool_result) {
            return renderToolResultCard(
              part.tool_name || "unknown",
              part.tool_result,
              idx
            );
          }

          return null;
        })}
      </div>
    );
  };

  if (isLoadingHistory) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="vet-loading-dots mb-4">
            <span className="vet-loading-dot" />
            <span className="vet-loading-dot" />
            <span className="vet-loading-dot" />
          </div>
          <p className="text-vet-text-secondary">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto w-full">
      {/* Header with Sidebar Toggle */}
      <div className="sticky top-0 z-10 border-b border-vet-border/30 bg-vet-bg/95 backdrop-blur-xl px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Sidebar Toggle Button */}
          <Button
            variant="ghost"
            onClick={toggleSidebar}
            className="h-9 px-3 gap-2 text-sm font-medium text-vet-text-primary hover:text-vet-accent hover:bg-vet-surface/50 transition-colors duration-200"
          >
            {sidebarOpen ? (
              <>
                <PanelLeftClose className="w-4 h-4" />
                <span>Hide</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="w-4 h-4" />
                <span>Show</span>
              </>
            )}
          </Button>

          {/* Status Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-vet-surface/50 border border-vet-border/30">
            <div className="w-2 h-2 rounded-full bg-vet-accent animate-pulse" />
            <span className="text-sm text-vet-text-primary font-medium">ChainPilot Active</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-2"
      >
        {messages.length === 0 && !isLoadingHistory && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4 p-4 rounded-full bg-vet-accent/10">
              <SparklesIcon size={32} color="#E2008C" />
            </div>
            <h3 className="text-xl font-semibold text-vet-text-primary mb-2">
              Welcome to ChainPilot
            </h3>
            <p className="text-vet-text-secondary max-w-md">
              Your AI assistant for multi-chain blockchain operations. Ask me to
              check balances, track NFTs, or prepare transactions across
              Ethereum, Base, and more.
            </p>

            {/* Suggested Actions */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {[
                "Check my ETH balance",
                "Show my NFTs on Base",
                "Get gas prices on Sepolia",
                "What's the price of USDC?",
              ].map((suggestion, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setInput(suggestion)}
                  className="vet-glass-card p-4 text-left hover:border-vet-accent/50 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <p className="text-sm text-vet-text-secondary">{suggestion}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "agent" && (
              <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-vet-border bg-vet-surface">
                <div className="translate-y-px">
                  <SparklesIcon size={14} color="#E2008C" />
                </div>
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl ${
                msg.role === "user"
                  ? "vet-chat-user px-4 py-3"
                  : "space-y-3"
              }`}
            >
              {msg.role === "user" ? (
                <div className="text-sm">
                  <Markdown>{msg.content as string}</Markdown>
                </div>
              ) : (
                <div className="space-y-3">
                  {typeof msg.content === "string" ? (
                    <div className="bg-vet-surface border border-vet-border rounded-2xl px-4 py-3 text-sm text-vet-text-primary prose prose-invert prose-sm max-w-none">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  ) : (
                    <>
                      {msg.content.map((part, idx) => {
                        if (part.type === "text" && part.text) {
                          return (
                            <div
                              key={idx}
                              className="bg-vet-surface border border-vet-border rounded-2xl px-4 py-3 text-sm text-vet-text-primary prose prose-invert prose-sm max-w-none"
                            >
                              <Markdown>{part.text}</Markdown>
                            </div>
                          );
                        }

                        if (part.type === "tool_result" && part.tool_result) {
                          return renderToolResultCard(
                            part.tool_name || "unknown",
                            part.tool_result,
                            idx
                          );
                        }

                        return null;
                      })}
                    </>
                  )}
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-vet-border bg-vet-surface">
                <User size={14} className="text-vet-text-secondary" />
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-vet-border bg-vet-surface">
              <div className="translate-y-px">
                <SparklesIcon size={14} color="#E2008C" />
              </div>
            </div>
            <div className="bg-vet-surface border border-vet-border rounded-2xl px-4 py-3 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-vet-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="inline-block w-2 h-2 bg-vet-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="inline-block w-2 h-2 bg-vet-accent rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-vet-border bg-vet-bg/95 backdrop-blur-xl px-4 py-6 pb-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your blockchain assets..."
            disabled={isLoading || !isConnected}
            className="vet-input min-h-[80px] resize-none"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || !isConnected}
              className="vet-button-primary vet-button-shimmer flex items-center gap-2"
            >
              {isLoading ? (
                <span className="animate-pulse">Thinking...</span>
              ) : (
                <>
                  <SendHorizonal className="w-4 h-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
