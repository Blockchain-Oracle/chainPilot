"use client";

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
import Image from "next/image";
import { ChatSuggestedActions } from "@/components/chat-suggested-actions";

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

// Import Web3 Research card components for generative UI
import {
  SearchResultsCard,
  ResearchPlanCard,
  ResearchStatusCard,
  ResourceListCard,
  ContentCard,
  ResearchLoadingCard
} from "@/components/web3-research";

// Import Jupiter card components for generative UI
import { TokenSearchCard } from "@/components/jupiter/TokenSearchCard";
import { SwapQuoteCard } from "@/components/jupiter/SwapQuoteCard";
import { RoutersCard } from "@/components/jupiter/RoutersCard";
import { DBCPoolCard } from "@/components/jupiter/DBCPoolCard";
import { IntegratedPluginCard } from "@/components/jupiter/IntegratedPluginCard";

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
  const [isResearching, setIsResearching] = useState(false);
  const [researchTokenName, setResearchTokenName] = useState<string | undefined>();
  const [researchTokenTicker, setResearchTokenTicker] = useState<string | undefined>();
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

    // Detect research queries
    const isResearchQuery = /research|tokenomics|analyze|investigate|study/i.test(input);

    // Extract token name/ticker from query if it's a research query
    if (isResearchQuery) {
      // Simple regex to extract potential token names (capitalize words after "research", etc.)
      const tokenMatch = input.match(/(?:research|analyze|study)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*(?:\(([A-Z]+)\))?/i);
      if (tokenMatch) {
        setResearchTokenName(tokenMatch[1]);
        setResearchTokenTicker(tokenMatch[2]);
      }
      setIsResearching(true);
    }

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
      setIsResearching(false);
      setResearchTokenName(undefined);
      setResearchTokenTicker(undefined);
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
  CardWrapper.displayName = 'CardWrapper';

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

      // Jupiter Tools
      case "jupiter_search_tokens":
        return (
          <CardWrapper key={key} id={cardId}>
            <TokenSearchCard result={result} />
          </CardWrapper>
        );

      case "jupiter_get_swap_quote":
        return (
          <CardWrapper key={key} id={cardId}>
            <SwapQuoteCard result={result} />
          </CardWrapper>
        );

      case "jupiter_get_routers":
        return (
          <CardWrapper key={key} id={cardId}>
            <RoutersCard result={result} />
          </CardWrapper>
        );

      case "jupiter_get_dbc_pool":
        return (
          <CardWrapper key={key} id={cardId}>
            <DBCPoolCard result={result} />
          </CardWrapper>
        );

      case "jupiter_show_plugin":
        return (
          <CardWrapper key={key} id={cardId}>
            <IntegratedPluginCard result={result} />
          </CardWrapper>
        );

      // Web3 Research Tools
      case "web3_search":
        return (
          <CardWrapper key={key} id={cardId}>
            <SearchResultsCard result={result} />
          </CardWrapper>
        );

      case "create_research_plan":
        return (
          <CardWrapper key={key} id={cardId}>
            <ResearchPlanCard result={result} />
          </CardWrapper>
        );

      case "research_token":
        return (
          <CardWrapper key={key} id={cardId}>
            <ResearchPlanCard result={result} />
          </CardWrapper>
        );

      case "research_with_keywords":
        return (
          <CardWrapper key={key} id={cardId}>
            <SearchResultsCard result={result} />
          </CardWrapper>
        );

      case "update_research_status":
        return (
          <CardWrapper key={key} id={cardId}>
            <ResearchStatusCard result={result} />
          </CardWrapper>
        );

      case "fetch_content":
        return (
          <CardWrapper key={key} id={cardId}>
            <ContentCard result={result} />
          </CardWrapper>
        );

      case "search_source":
        return (
          <CardWrapper key={key} id={cardId}>
            <SearchResultsCard result={result} />
          </CardWrapper>
        );

      case "list_resources":
        return (
          <CardWrapper key={key} id={cardId}>
            <ResourceListCard result={result} />
          </CardWrapper>
        );

      case "get_research_status":
        return (
          <CardWrapper key={key} id={cardId}>
            <ResearchStatusCard result={result} />
          </CardWrapper>
        );

      case "complete_research":
        return (
          <CardWrapper key={key} id={cardId}>
            <ResearchStatusCard result={result} />
          </CardWrapper>
        );

      case "list_research_sessions":
        return (
          <CardWrapper key={key} id={cardId}>
            <ResourceListCard result={result} />
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
      <div className="sticky top-0 z-10 border-b border-vet-border/30 bg-vet-bg/95 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Sidebar Toggle Button */}
          <Button
            variant="ghost"
            onClick={toggleSidebar}
            className="h-8 sm:h-9 px-2 sm:px-3 gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-vet-text-primary hover:text-vet-accent hover:bg-vet-surface/50 transition-colors duration-200"
          >
            {sidebarOpen ? (
              <>
                <PanelLeftClose className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Hide</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Show</span>
              </>
            )}
          </Button>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-vet-surface/50 border border-vet-border/30">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-vet-accent animate-pulse" />
            <span className="text-xs sm:text-sm text-vet-text-primary font-medium">ChainPilot Active</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4 pb-2"
      >
        {messages.length === 0 && !isLoadingHistory && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-full bg-vet-accent/10">
              <Image
                src="/logo.png"
                alt="ChainPilot"
                width={40}
                height={40}
                className="object-contain sm:w-12 sm:h-12"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-vet-text-primary mb-1.5 sm:mb-2">
              Welcome to ChainPilot
            </h3>
            <p className="text-sm sm:text-base text-vet-text-secondary max-w-md">
              Your AI assistant for multi-chain blockchain operations and Web3 research.
              Ask me to check balances, track NFTs, prepare transactions, or research
              tokens across Ethereum, Base, and more.
            </p>

            {/* Suggested Actions */}
            <div className="mt-6 sm:mt-8 w-full">
              <ChatSuggestedActions onSelectSuggestion={setInput} />
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-2 sm:gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "agent" && (
              <div className="size-7 sm:size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-vet-border bg-vet-surface">
                <Image
                  src="/logo.png"
                  alt="ChainPilot"
                  width={18}
                  height={18}
                  className="object-contain sm:w-5 sm:h-5"
                />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl ${
                msg.role === "user"
                  ? "vet-chat-user px-3 sm:px-4 py-2.5 sm:py-3"
                  : "space-y-2 sm:space-y-3"
              }`}
            >
              {msg.role === "user" ? (
                <div className="text-xs sm:text-sm">
                  <Markdown>{msg.content as string}</Markdown>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {typeof msg.content === "string" ? (
                    <div className="bg-vet-surface border border-vet-border rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-vet-text-primary prose prose-invert prose-sm max-w-none">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  ) : (
                    <>
                      {msg.content.map((part, idx) => {
                        if (part.type === "text" && part.text) {
                          return (
                            <div
                              key={idx}
                              className="bg-vet-surface border border-vet-border rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-vet-text-primary prose prose-invert prose-sm max-w-none"
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
              <div className="size-7 sm:size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-vet-border bg-vet-surface">
                <User size={12} className="text-vet-text-secondary sm:w-3.5 sm:h-3.5" />
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
          isResearching ? (
            // Show research-specific loading card
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2 sm:gap-3 justify-start w-full"
            >
              <div className="size-7 sm:size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-vet-border bg-vet-surface">
                <Image
                  src="/logo.png"
                  alt="ChainPilot"
                  width={18}
                  height={18}
                  className="object-contain sm:w-5 sm:h-5"
                />
              </div>
              <div className="flex-1 max-w-[85%] sm:max-w-[80%]">
                <ResearchLoadingCard
                  tokenName={researchTokenName}
                  tokenTicker={researchTokenTicker}
                />
              </div>
            </motion.div>
          ) : (
            // Show generic loading indicator
            <div className="flex items-start gap-2 sm:gap-3 justify-start">
              <div className="size-7 sm:size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-vet-border bg-vet-surface">
                <Image
                  src="/logo.png"
                  alt="ChainPilot"
                  width={18}
                  height={18}
                  className="object-contain sm:w-5 sm:h-5"
                />
              </div>
              <div className="bg-vet-surface border border-vet-border rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-vet-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-vet-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-vet-accent rounded-full animate-bounce" />
              </div>
            </div>
          )
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-vet-border bg-vet-bg/95 backdrop-blur-xl px-3 sm:px-4 py-4 sm:py-6 pb-6 sm:pb-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-2 sm:space-y-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your blockchain assets..."
            disabled={isLoading || !isConnected}
            className="vet-input min-h-[60px] sm:min-h-[80px] resize-none text-sm sm:text-base"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || !isConnected}
              className="vet-button-primary vet-button-shimmer flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base px-4 sm:px-6"
            >
              {isLoading ? (
                <span className="animate-pulse">Thinking...</span>
              ) : (
                <>
                  <SendHorizonal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
