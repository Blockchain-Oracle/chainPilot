"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  Coins,
  Image,
  Activity,
  Fuel,
  Globe,
  ArrowUpDown,
  Search
} from "lucide-react";

const tools = [
  {
    icon: Wallet,
    title: "Multi-Chain Wallets",
    description: "Check balances across Ethereum, Base, Polygon, Arbitrum, and Optimism",
    example: "What's my balance on Base?"
  },
  {
    icon: Coins,
    title: "Token Management",
    description: "View token balances, metadata, and prices across all chains",
    example: "Show me my USDC balance"
  },
  {
    icon: Image,
    title: "NFT Portfolio",
    description: "Discover and manage NFTs across multiple blockchains",
    example: "What NFTs do I own?"
  },
  {
    icon: Activity,
    title: "Transaction History",
    description: "Track transactions and transfers across all supported chains",
    example: "Show my recent transactions"
  },
  {
    icon: Fuel,
    title: "Gas Optimization",
    description: "Get real-time gas prices and transaction cost estimates",
    example: "What's the gas price on Ethereum?"
  },
  {
    icon: Globe,
    title: "ENS Resolution",
    description: "Resolve ENS names and reverse lookups",
    example: "Resolve vitalik.eth"
  },
  {
    icon: ArrowUpDown,
    title: "Cross-Chain Swaps",
    description: "Get swap quotes and execute trades (coming soon)",
    example: "Swap 1 ETH to USDC"
  },
  {
    icon: Search,
    title: "Blockchain Explorer",
    description: "Query any address, transaction, or block across chains",
    example: "Check address 0x742d..."
  }
];

export default function AlchemyToolsSection() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powered by Alchemy's Multi-Chain Infrastructure
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access the entire Ethereum ecosystem and L2s through natural conversation.
            No more switching between chains or interfaces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{tool.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {tool.description}
                </p>
                <div className="text-xs bg-muted/50 rounded-md px-3 py-2 font-mono">
                  "{tool.example}"
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-lg text-muted-foreground">
            Plus many more tools for DeFi, staking, and blockchain analytics
          </p>
        </motion.div>
      </div>
    </section>
  );
}