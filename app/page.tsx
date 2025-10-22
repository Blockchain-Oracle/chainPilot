"use client";

import { ArrowRight, Brain, Shield, Zap, Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ChainPilotLanding() {
  return (
    <div className="min-h-screen bg-vet-bg text-white">
      {/* Navigation */}
      <header className="vet-nav">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="ChainPilot Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-lg font-medium tracking-wide">ChainPilot</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-vet-text-secondary">
            <Link href="/docs" className="hover:text-white transition hidden md:block">
              Documentation
            </Link>
            <Link href="/about" className="hover:text-white transition hidden md:block">
              About
            </Link>
            <Link href="/roadmap" className="hover:text-white transition hidden md:block">
              Roadmap
            </Link>
            <Button asChild className="vet-button-primary">
              <Link href="/chat">
                Launch Terminal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="vet-hero">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <Badge className="bg-vet-accent/10 border-vet-accent/20 text-vet-accent hover:bg-vet-accent/20 flex items-center gap-2 px-4 py-2">
              <Image
                src="/adk.webp"
                alt="ADK"
                width={20}
                height={20}
                className="object-contain"
              />
              Powered by ADK & Alchemy Multi-Chain Infrastructure
            </Badge>
          </div>

          <h1 className="vet-heading mb-6">
            AI Agents that <span className="text-vet-accent">Act</span>, not just chat.
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="vet-body max-w-2xl mx-auto mb-10"
          >
            A minimal, intelligent terminal for multi-chain blockchain operations. Check balances, track NFTs,
            execute transactions across Ethereum, Base, Polygon, and more — all through natural conversation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild className="vet-button-primary px-8 py-6 text-base">
              <Link href="/chat">
                Start Multi-Chain Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild className="vet-button-secondary px-8 py-6 text-base">
              <Link href="/docs">
                <Github className="mr-2 h-5 w-5" />
                View Documentation
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Subtle Ambient Glow */}
        <div className="vet-glow-bg" />
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-vet-border">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="vet-subheading mb-4">Built for serious builders.</h2>
            <p className="vet-body max-w-2xl mx-auto">
              ChainPilot connects conversational AI with real blockchain operations — manage balances,
              execute transactions, and visualize actions within one unified interface.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Multi-Chain Native",
                desc: "Real-time data across 10+ EVM chains. Check balances, track NFTs, monitor gas prices - all in one conversation.",
              },
              {
                icon: Shield,
                title: "Powered by ADK",
                desc: "Built with Agent Development Kit for reliable AI interactions. Extensible architecture for adding new chains easily.",
              },
              {
                icon: Zap,
                title: "Alchemy Infrastructure",
                desc: "Enterprise-grade reliability with Alchemy's proven APIs. Real-time data, instant responses, seamless chain switching.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="vet-glass-card p-8 hover:bg-vet-surface/70 transition"
              >
                <feature.icon className="h-12 w-12 text-vet-accent mb-4" />
                <h3 className="text-xl font-medium mb-3 text-vet-text-primary">{feature.title}</h3>
                <p className="vet-caption leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="py-24 border-t border-vet-border">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="vet-subheading mb-4">What You Can Do</h2>
            <p className="vet-body max-w-2xl mx-auto">
              From balance checks to swap quotes — everything through natural language.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Token Balances", desc: "Check ERC20 balances across all chains instantly" },
              { title: "NFT Portfolios", desc: "View and track NFT ownership across networks" },
              { title: "Gas Optimization", desc: "Monitor gas prices and estimate transaction fees" },
              { title: "Transaction History", desc: "Track and analyze transaction history" },
              { title: "Swap Quotes", desc: "Get real-time DEX swap quotes across chains" },
              { title: "ENS Resolution", desc: "Resolve ENS names and reverse lookups" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="vet-tool-card hover:bg-vet-surface/90 transition"
              >
                <h3 className="font-semibold text-vet-accent mb-2">{item.title}</h3>
                <p className="vet-caption">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-28 border-t border-vet-border text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-6"
        >
          <h2 className="vet-subheading mb-4">Ready to unify your blockchain experience?</h2>
          <p className="vet-body mb-10 max-w-xl mx-auto">
            Access all EVM chains through one conversation. Built for professionals who value precision, speed, and reliability.
          </p>
          <Button asChild className="vet-button-primary px-8 py-6 text-base">
            <Link href="/chat">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-vet-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/logo.png"
                  alt="ChainPilot Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="text-lg font-medium">ChainPilot</span>
              </div>
              <p className="vet-caption max-w-md">
                The most advanced AI-powered terminal for multi-chain blockchain operations.
                Powered by ADK and Alchemy.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-vet-text-primary">Product</h3>
              <ul className="space-y-2 vet-caption">
                <li><Link href="/docs" className="hover:text-vet-text-primary transition">Documentation</Link></li>
                <li><Link href="/about" className="hover:text-vet-text-primary transition">About</Link></li>
                <li><Link href="/roadmap" className="hover:text-vet-text-primary transition">Roadmap</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-vet-text-primary">Community</h3>
              <ul className="space-y-2 vet-caption">
                <li>
                  <a href="https://github.com/Blockchain-Oracle/chainPilot" target="_blank" rel="noopener noreferrer" className="hover:text-vet-text-primary transition flex items-center">
                    GitHub
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-vet-border pt-6 text-center vet-caption">
            <p>&copy; 2024 ChainPilot. Built for the Agentic Era.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
