"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Wallet,
  Shield,
  Code,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
  Sparkles,
  Globe
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    category: "getting-started",
    question: "What is ChainPilot?",
    answer: "ChainPilot is an AI-powered multi-chain blockchain terminal built with Anthropic's ADK-TS framework. It allows you to interact with 15+ blockchains using natural language - simply tell the AI what you want to accomplish like 'check my ETH balance on Base' or 'show my NFTs across all chains' and it handles the technical complexity."
  },
  {
    category: "getting-started",
    question: "How do I get started with ChainPilot?",
    answer: "Getting started is simple: 1) Connect your wallet (MetaMask, Coinbase Wallet, Rainbow, or any WalletConnect-compatible wallet), 2) Start typing what you want to do in natural language, 3) The ADK-TS agent will guide you through each step. No technical knowledge required!"
  },
  {
    category: "getting-started",
    question: "What blockchains does ChainPilot support?",
    answer: "ChainPilot supports 15+ blockchains including Ethereum, Base, Arbitrum, Optimism, Polygon, Polygon zkEVM, zkSync, Scroll, Blast, Linea, Avalanche, BNB Chain, Fantom, and Solana. All EVM chains are powered by Alchemy's infrastructure, and Solana by Jupiter Ultra API."
  },
  {
    category: "getting-started",
    question: "Is ChainPilot free to use?",
    answer: "Yes, ChainPilot is free to use. You only pay standard network gas fees for transactions you choose to execute. The AI interface and all blockchain tools are provided at no additional cost."
  },
  {
    category: "getting-started",
    question: "What is ADK-TS?",
    answer: "ADK-TS (Agent Development Kit for TypeScript) is Anthropic's framework for building stateful AI agents. ChainPilot is built entirely on ADK-TS, which provides session persistence, tool registration, streaming responses, and intelligent conversation management."
  },

  // Wallet & Balances
  {
    category: "wallet",
    question: "What wallets are supported?",
    answer: "ChainPilot supports all major multi-chain wallets through RainbowKit integration: MetaMask, Coinbase Wallet, Rainbow, WalletConnect, Trust Wallet, and more. For Solana operations, you can also use Phantom wallet."
  },
  {
    category: "wallet",
    question: "How do I check my token balances?",
    answer: "Simply ask: 'What's my ETH balance on Base?' or 'Show all my token balances'. The AI will fetch and display your native and ERC20 token balances across all connected chains instantly."
  },
  {
    category: "wallet",
    question: "Can I view my NFT collection?",
    answer: "Yes! Ask 'Show me my NFTs' or 'What NFTs do I own?' and ChainPilot will display all your NFTs across supported chains with metadata, images, and collection information."
  },
  {
    category: "wallet",
    question: "How do I check balances on specific chains?",
    answer: "You can specify the chain in your query: 'Check my USDC balance on Arbitrum' or 'What's my ETH on Optimism?'. The AI understands chain names and will query the correct network."
  },

  // Multi-Chain Operations
  {
    category: "multichain",
    question: "How does multi-chain support work?",
    answer: "ChainPilot uses Alchemy's multi-chain infrastructure for EVM chains and Jupiter Ultra for Solana. You can query data, check balances, and get information across all supported chains from a single interface."
  },
  {
    category: "multichain",
    question: "Can I compare balances across chains?",
    answer: "Yes! Ask 'Show my USDC balance across all chains' and the AI will aggregate and display your balances from Ethereum, Base, Arbitrum, Polygon, and other supported networks."
  },
  {
    category: "multichain",
    question: "What Solana features are available?",
    answer: "For Solana, ChainPilot provides token balance queries, token metadata, price data, and DEX swap quotes through Jupiter Ultra API integration. More Solana features are coming soon!"
  },
  {
    category: "multichain",
    question: "How do I switch between chains?",
    answer: "You don't need to manually switch! Simply mention the chain name in your query: 'Check gas price on Ethereum' or 'Show NFTs on Polygon'. The AI handles chain routing automatically."
  },

  // Transactions & Gas
  {
    category: "transactions",
    question: "How do I check transaction history?",
    answer: "Ask 'Show my recent transactions' or 'What are my latest transactions on Base?' and the AI will display your transaction history with details like value, gas used, and status."
  },
  {
    category: "transactions",
    question: "Can I check gas prices?",
    answer: "Yes! Say 'What's the current gas price on Ethereum?' or 'Show me gas prices across chains'. ChainPilot provides real-time gas price data to help you optimize transaction timing."
  },
  {
    category: "transactions",
    question: "How do I look up a specific transaction?",
    answer: "Provide the transaction hash: 'Show me details for transaction 0x...' and the AI will fetch and explain the transaction details including status, gas used, and any events."
  },
  {
    category: "transactions",
    question: "Can I estimate transaction costs?",
    answer: "Yes, ask 'Estimate gas for sending ETH' or 'What would it cost to transfer tokens on Arbitrum?' and the AI will provide gas estimates based on current network conditions."
  },

  // ENS & Name Services
  {
    category: "ens",
    question: "Does ChainPilot support ENS names?",
    answer: "Yes! You can use ENS names instead of addresses: 'Check balance for vitalik.eth' or 'Show NFTs owned by ethereum.eth'. The AI automatically resolves ENS names to addresses."
  },
  {
    category: "ens",
    question: "Can I do reverse ENS lookups?",
    answer: "Absolutely! Provide any address and ask 'What's the ENS name for 0x...' and ChainPilot will perform a reverse lookup to find associated ENS names."
  },
  {
    category: "ens",
    question: "How do I get ENS avatar images?",
    answer: "ENS avatars are automatically displayed when available. Ask 'Show me the avatar for vitalik.eth' to retrieve NFT or URL-based avatars associated with ENS names."
  },

  // DeFi & Swap Quotes
  {
    category: "defi",
    question: "Can I get DEX swap quotes?",
    answer: "Yes! For Solana, ask 'Get me a swap quote for 1 SOL to USDC' and Jupiter Ultra will provide real-time DEX quotes with routes and price impact. EVM DEX features coming soon!"
  },
  {
    category: "defi",
    question: "What DeFi data can I access?",
    answer: "Currently: Solana token prices, swap quotes, and liquidity data via Jupiter. Token prices and metadata across all EVM chains via Alchemy. More DeFi features are in development!"
  },
  {
    category: "defi",
    question: "Can I track token prices?",
    answer: "Yes! Ask 'What's the price of ETH?' or 'Show me SOL price in USD'. ChainPilot provides real-time token price data across supported chains."
  },

  // AI & ADK-TS Features
  {
    category: "ai",
    question: "How does the AI understand my requests?",
    answer: "ChainPilot uses ADK-TS agents powered by advanced language models (GPT-4o or Gemini 2.0 Flash). The agent is trained to understand blockchain terminology and natural language queries."
  },
  {
    category: "ai",
    question: "Does ChainPilot remember my conversation?",
    answer: "Yes! ADK-TS provides session persistence, so the AI remembers context within each chat session. Your conversation history is stored securely and sessions persist across browser refreshes."
  },
  {
    category: "ai",
    question: "What blockchain tools does the AI have access to?",
    answer: "The ADK-TS agent has 88+ specialized blockchain tools including: balance queries, NFT lookups, transaction analysis, gas price monitoring, ENS resolution, token metadata, swap quotes, and more."
  },
  {
    category: "ai",
    question: "Can I customize which AI model to use?",
    answer: "Yes! ChainPilot supports multiple AI models including OpenAI's GPT-4o and Google's Gemini 2.0 Flash. You can configure your preferred model in the settings."
  },

  // Troubleshooting
  {
    category: "troubleshooting",
    question: "Why isn't my wallet connecting?",
    answer: "Common solutions: 1) Ensure your wallet extension is installed and unlocked, 2) Try refreshing the page, 3) Check you're using a supported wallet (MetaMask, Coinbase Wallet, Rainbow, etc.), 4) Clear browser cache if issues persist."
  },
  {
    category: "troubleshooting",
    question: "The AI says it can't find my data",
    answer: "Try these steps: 1) Verify your wallet is connected, 2) Make sure you specified the correct chain, 3) Check if the address/ENS name is valid, 4) Some chains may have delayed data - try again in a moment."
  },
  {
    category: "troubleshooting",
    question: "AI doesn't understand my request",
    answer: "Try rephrasing more simply: instead of complex technical terms, use plain language like 'check balance', 'show NFTs', or 'what's the gas price'. The AI is trained on natural conversation patterns."
  },
  {
    category: "troubleshooting",
    question: "How do I report a bug or issue?",
    answer: "If you encounter bugs or issues, please report them on our GitHub repository. Include details about what you were trying to do and any error messages you received."
  },

  // Advanced & Technical
  {
    category: "advanced",
    question: "What API providers does ChainPilot use?",
    answer: "ChainPilot uses Alchemy for EVM chain data (Ethereum, Base, Arbitrum, Optimism, Polygon, etc.) and Jupiter Ultra API for Solana operations. Both provide enterprise-grade, reliable blockchain infrastructure."
  },
  {
    category: "advanced",
    question: "How is user data handled?",
    answer: "ChainPilot only accesses public blockchain data. Your private keys never leave your wallet. Conversation history is stored securely with encryption. No private data is shared with third parties."
  },
  {
    category: "advanced",
    question: "Can I integrate ChainPilot into my app?",
    answer: "ChainPilot is open source! Check our GitHub repository for the codebase. It's built with Next.js, ADK-TS, and modern Web3 libraries - perfect for learning or integrating into your own projects."
  },
  {
    category: "advanced",
    question: "What's the difference between ChainPilot and other blockchain interfaces?",
    answer: "ChainPilot is built specifically with ADK-TS for stateful conversational AI. Unlike traditional block explorers, it understands natural language, maintains conversation context, and provides AI-powered insights across 15+ chains from one interface."
  }
];

const categories = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: HelpCircle,
    description: "Basic questions about ChainPilot"
  },
  {
    id: "wallet",
    name: "Wallet & Balances",
    icon: Wallet,
    description: "Managing wallets and checking balances"
  },
  {
    id: "multichain",
    name: "Multi-Chain",
    icon: Globe,
    description: "Multi-chain operations and support"
  },
  {
    id: "transactions",
    name: "Transactions & Gas",
    icon: Activity,
    description: "Transaction history and gas prices"
  },
  {
    id: "ens",
    name: "ENS & Names",
    icon: Code,
    description: "ENS resolution and name services"
  },
  {
    id: "defi",
    name: "DeFi & Swaps",
    icon: Zap,
    description: "DEX quotes and token prices"
  },
  {
    id: "ai",
    name: "AI & ADK-TS",
    icon: Sparkles,
    description: "AI features and capabilities"
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    icon: AlertCircle,
    description: "Common issues and solutions"
  },
  {
    id: "advanced",
    name: "Advanced",
    icon: Shield,
    description: "Technical details and integrations"
  }
];

function FAQCategory({ category, items }: { category: typeof categories[0], items: FAQItem[] }) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <category.icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{category.name}</h3>
            <p className="text-sm text-muted-foreground font-normal">{category.description}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openItems.includes(index);
            return (
              <div key={index} className="border border-border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto text-left bg-muted/50 hover:bg-muted/70 rounded-none"
                  onClick={() => toggleItem(index)}
                >
                  <span className="font-medium pr-4">{item.question}</span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                </Button>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4 bg-background"
                  >
                    <div className="pt-4 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState("getting-started");

  const filteredFAQs = faqData.filter(faq => faq.category === selectedCategory);
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="py-12 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <HelpCircle className="mr-2 h-3 w-3" />
          <span className="text-muted-foreground">FAQ</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
          Find answers to common questions about ChainPilot. From wallet connections to multi-chain operations,
          we've got you covered.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">{faqData.length}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">88+</div>
            <div className="text-sm text-muted-foreground">AI Tools</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">15+</div>
            <div className="text-sm text-muted-foreground">Chains</div>
          </div>
        </div>
      </motion.div>

      <div className="w-full">
        <div className="bg-muted/50 rounded-lg p-2 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-md h-auto flex flex-col items-center gap-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-background text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center leading-tight">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FAQCategory
            category={categories.find(cat => cat.id === selectedCategory)!}
            items={faqData.filter(faq => faq.category === selectedCategory)}
          />
        </motion.div>
      </div>

      {/* Help CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/20">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Try asking ChainPilot directly -
            it's designed to understand and answer questions in natural language.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/chat">
                <Sparkles className="w-4 h-4 mr-2" />
                Try ChainPilot
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs/getting-started">
                <Info className="w-4 h-4 mr-2" />
                Getting Started
              </Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
