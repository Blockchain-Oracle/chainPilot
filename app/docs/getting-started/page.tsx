"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Wallet,
  MessageSquare,
  Search,
  Code,
  ExternalLink,
  Layers
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    title: "Connect Your Wallet",
    description: "Connect your multi-chain wallet to access all features across EVM chains and Solana",
    icon: Wallet,
    details: [
      "MetaMask & WalletConnect",
      "Coinbase Wallet",
      "Rainbow Wallet",
      "Phantom (for Solana)"
    ]
  },
  {
    number: "02",
    title: "Explore the Interface",
    description: "Familiarize yourself with the AI-powered chat interface",
    icon: MessageSquare,
    details: [
      "Natural language queries",
      "Real-time multi-chain data",
      "Cross-chain operations",
      "Transaction analysis"
    ]
  },
  {
    number: "03",
    title: "Start Querying",
    description: "Begin exploring blockchain data with simple questions across 15+ chains",
    icon: Search,
    details: [
      "Ask about token balances",
      "Analyze transaction history",
      "Track NFT portfolios",
      "Monitor gas prices"
    ]
  }
];

const features = [
  {
    title: "Multi-Chain Analytics",
    description: "Get real-time insights across Ethereum, Base, Arbitrum, Optimism, Polygon, Solana, and more"
  },
  {
    title: "AI-Powered Queries",
    description: "Ask questions in natural language powered by ADK-TS agents for intelligent blockchain insights"
  },
  {
    title: "Token & NFT Management",
    description: "Track ERC20 tokens, NFTs, and Solana tokens across all supported chains"
  },
  {
    title: "DeFi Operations",
    description: "Get swap quotes, track liquidity pools, and monitor DeFi protocols across chains"
  }
];

export default function GettingStartedPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <span className="text-muted-foreground">Getting Started</span>
        </Badge>

        <h1 className="text-4xl font-bold mb-4">Welcome to ChainPilot</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          ChainPilot is your AI-powered co-pilot for multi-chain blockchain operations.
          Built with ADK-TS, it provides conversational access to 15+ blockchains.
          This guide will help you get started in just a few minutes.
        </p>
      </motion.div>

      {/* Quick Start */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Quick Start Guide</h2>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 p-6 border rounded-xl bg-card/50 backdrop-blur-sm"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold">
                    {step.number}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            Ready to start?
          </h4>
          <p className="text-muted-foreground mb-4">
            Launch ChainPilot and connect your wallet to begin exploring across 15+ blockchains.
          </p>
          <Button asChild>
            <Link href="/chat">
              Launch ChainPilot
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* Key Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Key Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Supported Chains */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Supported Chains</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          ChainPilot supports 15+ blockchains through Alchemy's multi-chain infrastructure and Jupiter Ultra for Solana:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            "Ethereum",
            "Base",
            "Arbitrum",
            "Optimism",
            "Polygon",
            "Polygon zkEVM",
            "zkSync",
            "Scroll",
            "Blast",
            "Linea",
            "Avalanche",
            "BNB Chain",
            "Fantom",
            "Solana",
            "+ more"
          ].map((chain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.05 * index }}
              viewport={{ once: true }}
              className="p-4 border rounded-lg bg-card/30 backdrop-blur-sm text-center font-medium"
            >
              {chain}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Example Queries */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Example Queries</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Here are some example questions you can ask ChainPilot:
        </p>

        <div className="space-y-4">
          {[
            "What's my ETH balance on Base?",
            "Show me my NFTs across all chains",
            "What's the current gas price on Ethereum?",
            "Get me a swap quote for 1 ETH to USDC on Arbitrum",
            "Show my transaction history on Polygon",
            "What's the price of SOL right now?",
            "Track all my token balances across chains"
          ].map((query, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="p-4 border rounded-lg bg-card/30 backdrop-blur-sm font-mono text-sm"
            >
              <Code className="h-4 w-4 text-primary inline mr-2" />
              {query}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Next Steps */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="bg-card/50 backdrop-blur-sm border rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Now that you know the basics, explore these advanced topics:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/docs/architecture" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <Layers className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Architecture</div>
              <div className="text-sm text-muted-foreground">Learn about ADK-TS integration</div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>

          <Link href="/docs/api-reference" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <ExternalLink className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">API Reference</div>
              <div className="text-sm text-muted-foreground">Complete API documentation</div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>

          <Link href="/docs/integration-guides" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <Code className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Integration Guides</div>
              <div className="text-sm text-muted-foreground">Integration tutorials</div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
