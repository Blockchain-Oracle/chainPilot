"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import {
  Wallet,
  Coins,
  Image,
  TrendingUp,
  Code2,
  Zap,
  Search,
  ArrowLeftRight,
} from "lucide-react";

interface ChatSuggestedActionsProps {
  onSelectSuggestion: (text: string) => void;
}

interface SuggestionCategory {
  name: string;
  icon: React.ElementType;
  suggestions: string[];
}

const categories: SuggestionCategory[] = [
  {
    name: "Balance & Wallet",
    icon: Wallet,
    suggestions: [
      "Check my ETH balance on Ethereum",
      "Show my token balances on Base",
      "What's my wallet balance on Polygon?",
      "Check my ETH balance on all chains",
    ],
  },
  {
    name: "NFTs & Collections",
    icon: Image,
    suggestions: [
      "Show my NFTs on Base",
      "What NFTs do I own on Ethereum?",
      "Show my NFT collections across all chains",
      "Get my NFT metadata on Polygon",
    ],
  },
  {
    name: "Token Research",
    icon: Search,
    suggestions: [
      "Research Bitcoin tokenomics",
      "What is the price of USDC?",
      "Tell me about Ethereum",
      "Research SOL token safety",
    ],
  },
  {
    name: "Transactions & Swaps",
    icon: ArrowLeftRight,
    suggestions: [
      "How much would it cost to swap 1 ETH to USDC?",
      "Show my recent transaction history",
      "What are the current gas prices?",
      "Get a swap quote for 100 USDC to ETH",
    ],
  },
  {
    name: "DeFi & Markets",
    icon: TrendingUp,
    suggestions: [
      "What's the floor price of Bored Apes?",
      "Show me trending tokens on Ethereum",
      "Get real-time gas prices across chains",
      "What are the best DEX swap routes?",
    ],
  },
  {
    name: "Smart Contracts",
    icon: Code2,
    suggestions: [
      "Read a smart contract function",
      "Get contract information",
      "Show me contract events",
      "Verify a contract address",
    ],
  },
];

function PureChatSuggestedActions({ onSelectSuggestion }: ChatSuggestedActionsProps) {
  // Get 8 random suggestions from different categories
  const getRandomSuggestions = () => {
    const suggestions: string[] = [];
    const categoriesUsed = new Set<number>();

    while (suggestions.length < 8 && categoriesUsed.size < categories.length) {
      const randomCategoryIndex = Math.floor(Math.random() * categories.length);

      if (!categoriesUsed.has(randomCategoryIndex)) {
        const category = categories[randomCategoryIndex];
        const randomSuggestion = category.suggestions[
          Math.floor(Math.random() * category.suggestions.length)
        ];
        suggestions.push(randomSuggestion);
        categoriesUsed.add(randomCategoryIndex);
      }
    }

    return suggestions;
  };

  const suggestions = getRandomSuggestions();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 text-sm text-vet-text-secondary"
      >
        <Zap className="w-4 h-4 text-vet-accent" />
        <span>Try asking about...</span>
      </motion.div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((suggestion, idx) => (
          <motion.button
            key={idx}
            onClick={() => onSelectSuggestion(suggestion)}
            className="vet-glass-card p-4 text-left hover:border-vet-accent/50 transition-all group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <p className="text-sm text-vet-text-secondary group-hover:text-vet-text-primary transition-colors">
              {suggestion}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex items-center justify-center gap-2 text-xs text-vet-text-secondary/60"
      >
        <span>{categories.reduce((sum, cat) => sum + cat.suggestions.length, 0)}+ operations</span>
        <span>•</span>
        <span>{categories.length} categories</span>
        <span>•</span>
        <span>15+ chains supported</span>
      </motion.div>
    </div>
  );
}

export const ChatSuggestedActions = memo(PureChatSuggestedActions);
