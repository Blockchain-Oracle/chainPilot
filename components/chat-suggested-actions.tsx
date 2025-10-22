"use client";

import { motion } from "framer-motion";
import { memo, useState } from "react";
import {
  Wallet,
  Coins,
  Image,
  TrendingUp,
  Code2,
  Zap,
  Search,
  ArrowLeftRight,
  ChevronRight,
} from "lucide-react";

interface ChatSuggestedActionsProps {
  onSelectSuggestion: (text: string) => void;
}

interface ToolCategory {
  name: string;
  icon: React.ReactNode;
  accent: string;
  actions: {
    title: string;
    label: string;
    action: string;
  }[];
}

function PureChatSuggestedActions({ onSelectSuggestion }: ChatSuggestedActionsProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories: ToolCategory[] = [
    {
      name: "Balance & Wallet",
      icon: <Wallet className="w-4 h-4" />,
      accent: "#E2008C", // ChainPilot Pink
      actions: [
        {
          title: "Check ETH balance",
          label: "view wallet balance",
          action: "Check my ETH balance on Ethereum",
        },
        {
          title: "Token balances on Base",
          label: "all tokens on Base chain",
          action: "Show my token balances on Base",
        },
        {
          title: "Balance on Polygon",
          label: "check Polygon wallet",
          action: "What's my wallet balance on Polygon?",
        },
        {
          title: "Multi-chain balances",
          label: "all chains at once",
          action: "Check my ETH balance on all chains",
        },
        {
          title: "Transaction history",
          label: "recent transactions",
          action: "Show my recent transaction history on Ethereum",
        },
      ],
    },
    {
      name: "NFTs & Collections",
      icon: <Image className="w-4 h-4" />,
      accent: "#9945FF", // Purple
      actions: [
        {
          title: "My NFTs on Base",
          label: "Base chain NFT collection",
          action: "Show my NFTs on Base",
        },
        {
          title: "Ethereum NFTs",
          label: "mainnet NFT holdings",
          action: "What NFTs do I own on Ethereum?",
        },
        {
          title: "All chain NFTs",
          label: "multi-chain NFT portfolio",
          action: "Show my NFT collections across all chains",
        },
        {
          title: "NFT metadata",
          label: "detailed NFT information",
          action: "Get my NFT metadata on Polygon",
        },
        {
          title: "NFT floor prices",
          label: "collection floor stats",
          action: "What's the floor price of popular NFT collections?",
        },
      ],
    },
    {
      name: "Token Research",
      icon: <Search className="w-4 h-4" />,
      accent: "#00D4FF", // Cyan
      actions: [
        {
          title: "Bitcoin research",
          label: "BTC fundamentals & tokenomics",
          action: "Research Bitcoin tokenomics",
        },
        {
          title: "USDC price",
          label: "stablecoin pricing",
          action: "What is the price of USDC?",
        },
        {
          title: "Ethereum overview",
          label: "ETH token details",
          action: "Tell me about Ethereum",
        },
        {
          title: "Solana safety check",
          label: "SOL security analysis",
          action: "Research SOL token safety",
        },
        {
          title: "Token price lookup",
          label: "real-time pricing",
          action: "What's the current price of LINK token?",
        },
      ],
    },
    {
      name: "Swaps & DEX",
      icon: <ArrowLeftRight className="w-4 h-4" />,
      accent: "#14F195", // Green
      actions: [
        {
          title: "ETH to USDC swap",
          label: "get swap quote",
          action: "How much would it cost to swap 1 ETH to USDC?",
        },
        {
          title: "Gas prices",
          label: "network fee estimates",
          action: "What are the current gas prices?",
        },
        {
          title: "Swap quote",
          label: "token exchange pricing",
          action: "Get a swap quote for 100 USDC to ETH",
        },
        {
          title: "Best swap route",
          label: "optimal DEX routing",
          action: "What's the best route to swap tokens on Ethereum?",
        },
        {
          title: "Solana swap quote",
          label: "Jupiter DEX pricing",
          action: "Get swap quote for 10 SOL to USDC on Solana",
        },
      ],
    },
    {
      name: "DeFi & Markets",
      icon: <TrendingUp className="w-4 h-4" />,
      accent: "#F7931A", // Bitcoin Orange
      actions: [
        {
          title: "NFT floor prices",
          label: "collection floor stats",
          action: "What's the floor price of Bored Apes?",
        },
        {
          title: "Trending tokens",
          label: "hot tokens on Ethereum",
          action: "Show me trending tokens on Ethereum",
        },
        {
          title: "Multi-chain gas",
          label: "gas across all chains",
          action: "Get real-time gas prices across chains",
        },
        {
          title: "DEX routes",
          label: "best swap paths",
          action: "What are the best DEX swap routes?",
        },
        {
          title: "Token prices",
          label: "market pricing",
          action: "Show me current token prices across chains",
        },
      ],
    },
    {
      name: "Smart Contracts",
      icon: <Code2 className="w-4 h-4" />,
      accent: "#8B5CF6", // Purple
      actions: [
        {
          title: "Read contract",
          label: "call read-only function",
          action: "Read a smart contract function",
        },
        {
          title: "Contract info",
          label: "get contract details",
          action: "Get contract information",
        },
        {
          title: "Contract events",
          label: "view contract logs",
          action: "Show me contract events",
        },
        {
          title: "Verify address",
          label: "check contract address",
          action: "Verify a contract address",
        },
        {
          title: "Prepare transaction",
          label: "build contract call",
          action: "Prepare a smart contract transaction",
        },
      ],
    },
  ];

  const handleActionClick = (action: string) => {
    onSelectSuggestion(action);
  };

  return (
    <div className="w-full max-w-full overflow-hidden space-y-4 px-4 md:px-0">
      {/* Category Pills - Terminal Style */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              type="button"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory(index);
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-md border text-xs sm:text-sm font-medium whitespace-nowrap transition-all snap-start flex-shrink-0 ${
                activeCategory === index
                  ? "bg-[#1A1A1A] border-vet-accent shadow-[0_0_15px_rgba(226,0,140,0.2)]"
                  : "bg-[#0A0A0A] border-[#2E2E2E] hover:border-vet-accent/50 hover:bg-[#1A1A1A]/50"
              }`}
              style={
                activeCategory === index
                  ? {
                      boxShadow: `0 0 15px ${category.accent}40`,
                      borderColor: category.accent,
                    }
                  : undefined
              }
            >
              <span style={activeCategory === index ? { color: category.accent } : undefined} className="flex-shrink-0">
                {category.icon}
              </span>
              <span className={`${activeCategory === index ? "text-[#E0E0E0]" : "text-[#A0A0A0]"}`}>
                {category.name}
              </span>
              <span className="text-[10px] sm:text-xs opacity-50">({category.actions.length})</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Cards - Horizontal Scroll */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 sm:gap-3">
            {categories[activeCategory].actions.map((suggestedAction, index) => (
              <motion.div
                key={`${suggestedAction.title}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px]"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleActionClick(suggestedAction.action);
                  }}
                  className="relative text-left border border-[#2E2E2E] rounded-lg px-3 sm:px-4 py-3 sm:py-4 w-full h-full bg-[#1A1A1A] hover:bg-[#242424] hover:border-vet-accent/50 transition-all group"
                  style={{
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {/* Accent bar on left */}
                  <div
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: categories[activeCategory].accent }}
                  />

                  {/* Content */}
                  <div className="pl-0 group-hover:pl-2 transition-all space-y-1.5 sm:space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-[#E0E0E0] text-sm sm:text-base leading-tight break-words">
                        {suggestedAction.title}
                      </span>
                      <ChevronRight
                        className="w-4 h-4 sm:w-5 sm:h-5 text-vet-accent opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5"
                      />
                    </div>
                    <span className="text-[#A0A0A0] text-[10px] sm:text-xs block break-words">
                      {suggestedAction.label}
                    </span>
                  </div>

                  {/* Subtle glow on hover */}
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      boxShadow: `0 0 20px ${categories[activeCategory].accent}15`,
                    }}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Footer - Terminal Style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[#A0A0A0] pt-2 border-t border-[#2E2E2E]/50"
      >
        <Zap className="w-3 h-3 text-vet-accent flex-shrink-0" />
        <span className="text-center break-words">
          {categories.reduce((sum, cat) => sum + cat.actions.length, 0)}+ AI-powered operations
          across {categories.length} categories • 15+ chains supported
        </span>
      </motion.div>
    </div>
  );
}

export const ChatSuggestedActions = memo(PureChatSuggestedActions);
