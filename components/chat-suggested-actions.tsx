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
  Send,
  LineChart,
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
      name: "Balance & Account",
      icon: <Wallet className="w-4 h-4" />,
      accent: "#E2008C", // ChainPilot Pink
      actions: [
        {
          title: "Check ETH balance",
          label: "native balance lookup",
          action: "Check my ETH balance on Ethereum",
        },
        {
          title: "Token balances",
          label: "ERC20 token holdings",
          action: "Show my token balances on Base",
        },
        {
          title: "Transaction history",
          label: "recent on-chain activity",
          action: "Show my recent transaction history on Ethereum",
        },
        {
          title: "Multi-chain balance",
          label: "balance across all chains",
          action: "Check my balance on all supported chains",
        },
        {
          title: "USDC balance",
          label: "stablecoin holdings",
          action: "What's my USDC balance on Polygon?",
        },
      ],
    },
    {
      name: "NFTs & Collections",
      icon: <Image className="w-4 h-4" />,
      accent: "#9945FF", // Purple
      actions: [
        {
          title: "My NFTs",
          label: "owned NFT collections",
          action: "Show my NFTs on Base",
        },
        {
          title: "NFT metadata",
          label: "detailed NFT information",
          action: "Get metadata for my NFTs on Ethereum",
        },
        {
          title: "Floor price lookup",
          label: "collection floor stats",
          action: "What's the floor price of this NFT collection?",
        },
        {
          title: "Collections owned",
          label: "group NFTs by collection",
          action: "Show all my NFT collections",
        },
        {
          title: "NFT owners",
          label: "who owns this NFT",
          action: "Show me owners for a specific NFT",
        },
        {
          title: "Contract metadata",
          label: "NFT contract details",
          action: "Get contract metadata for an NFT collection",
        },
      ],
    },
    {
      name: "Token Research",
      icon: <Search className="w-4 h-4" />,
      accent: "#00D4FF", // Cyan
      actions: [
        {
          title: "Research Bitcoin",
          label: "comprehensive token analysis",
          action: "Research Bitcoin tokenomics and fundamentals",
        },
        {
          title: "Token safety check",
          label: "Solana token security",
          action: "Research SOL token safety metrics",
        },
        {
          title: "Create research plan",
          label: "structured analysis",
          action: "Create a research plan for analyzing a new token",
        },
        {
          title: "Web3 search",
          label: "crypto information lookup",
          action: "Search for information about Ethereum staking",
        },
        {
          title: "Token price",
          label: "current market price",
          action: "What is the price of LINK token?",
        },
      ],
    },
    {
      name: "Solana & Jupiter",
      icon: <LineChart className="w-4 h-4" />,
      accent: "#14F195", // Green
      actions: [
        {
          title: "Search Solana tokens",
          label: "token discovery & metrics",
          action: "Search for BONK token on Solana",
        },
        {
          title: "Swap quote",
          label: "Jupiter DEX pricing",
          action: "Get swap quote for 10 SOL to USDC",
        },
        {
          title: "Token safety",
          label: "security analysis",
          action: "Check safety metrics for a Solana token",
        },
        {
          title: "DEX routers",
          label: "available swap routers",
          action: "Show available Jupiter routers",
        },
        {
          title: "DBC pool info",
          label: "liquidity pool data",
          action: "Get DBC pool information for token pair",
        },
      ],
    },
    {
      name: "Transactions & Gas",
      icon: <Send className="w-4 h-4" />,
      accent: "#F7931A", // Bitcoin Orange
      actions: [
        {
          title: "Gas prices",
          label: "network fee estimates",
          action: "What are the current gas prices on Ethereum?",
        },
        {
          title: "Estimate gas",
          label: "transaction cost",
          action: "Estimate gas for a transaction",
        },
        {
          title: "Prepare ETH transfer",
          label: "native token send",
          action: "Prepare to send 0.1 ETH",
        },
        {
          title: "Token transfer",
          label: "ERC20 token send",
          action: "Prepare to transfer 100 USDC",
        },
        {
          title: "Token approval",
          label: "approve DEX spending",
          action: "Prepare token approval for Uniswap",
        },
        {
          title: "Contract call",
          label: "smart contract interaction",
          action: "Prepare a contract call transaction",
        },
      ],
    },
    {
      name: "Tokens & Prices",
      icon: <Coins className="w-4 h-4" />,
      accent: "#8B5CF6", // Purple
      actions: [
        {
          title: "Token metadata",
          label: "name, symbol, decimals",
          action: "Get metadata for USDT token",
        },
        {
          title: "Token price",
          label: "USD price lookup",
          action: "What's the current price of UNI token?",
        },
        {
          title: "Price by address",
          label: "contract address pricing",
          action: "Get price for token at contract address",
        },
        {
          title: "ENS resolution",
          label: "resolve ENS to address",
          action: "Resolve vitalik.eth to wallet address",
        },
        {
          title: "Multi-chain pricing",
          label: "prices across chains",
          action: "Compare USDC price on different chains",
        },
      ],
    },
  ];

  const handleActionClick = (action: string) => {
    onSelectSuggestion(action);
  };

  return (
    <div data-testid="suggested-actions" className="w-full max-w-full overflow-hidden space-y-4 px-4 md:px-0">
      {/* Category Pills - Terminal Style */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

      {/* Action Cards - Terminal Card Style */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                      <ArrowLeftRight
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
          30+ AI-powered operations • {categories.length} categories • EVM + Solana chains
        </span>
      </motion.div>
    </div>
  );
}

export const ChatSuggestedActions = memo(PureChatSuggestedActions);
