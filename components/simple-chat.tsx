"use client";

import { SparklesIcon } from "./icons";
import { SendHorizonal, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askChainPilot } from "@/app/_actions/chat";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Message = {
  role: "user" | "agent";
  content: string;
  id: string;
};

interface SimpleChatProps {
  chatId: string;
}

export const SimpleChat = ({ chatId }: SimpleChatProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount();

  const generateId = () =>
    crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

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

      if (result.success && result.response) {
        const agentMessage: Message = {
          id: generateId(),
          role: "agent",
          content: result.response,
        };
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

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto w-full">
      {/* Chat Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4 p-4 rounded-full bg-vet-accent/10">
              <SparklesIcon size={32} color="#E2008C" />
            </div>
            <h3 className="text-xl font-semibold text-vet-text-primary mb-2">
              Welcome to ChainPilot
            </h3>
            <p className="text-vet-text-secondary max-w-md">
              Your AI assistant for multi-chain blockchain operations. Ask me to check balances,
              track NFTs, or prepare transactions across Ethereum, Base, and more.
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

        {messages.map((msg, idx) => (
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
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "vet-chat-user"
                  : "bg-vet-surface border border-vet-border text-vet-text-primary"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
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
      <div className="border-t border-vet-border bg-vet-bg/50 backdrop-blur-xl p-4">
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
