"use client";

import { motion } from "motion/react";
import { Brain, Shield, Zap, Users, Globe, ArrowRight, Code2, Rocket, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero Section */}
      <section className="py-32 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-6">
              <span className="text-muted-foreground">About ChainPilot</span>
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Multi-Chain AI Assistant<br />Built with Agent Development Kit
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of blockchain interactions. ChainPilot brings together the power of
              Alchemy's multi-chain infrastructure and Anthropic's ADK framework to create the most
              intelligent blockchain assistant ever built.
            </p>

            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/chat">
                Try ChainPilot
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ADK-TS Showcase Section - HIGHLIGHTED */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <Image
                  src="/adk.webp"
                  alt="Agent Development Kit (ADK)"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <Badge className="mb-4 bg-primary text-primary-foreground">
                <Sparkles className="mr-2 h-4 w-4" />
                Powered by ADK-TS
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Built on Agent Development Kit
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                ChainPilot is a flagship implementation of ADK-TS (Agent Development Kit), showcasing
                how advanced AI agents can revolutionize blockchain interactions across multiple chains.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Code2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Stateful Agent Architecture</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Leveraging ADK's powerful session management and state persistence for continuous,
                        context-aware conversations across multiple blockchain operations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Tool Integration Framework</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Built using ADK's standardized tool integration pattern, enabling seamless connection
                        to 50+ blockchain APIs across EVM chains and Solana.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Advanced Streaming & Real-time Data</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Utilizing ADK's streaming capabilities for progressive tool execution and real-time
                        blockchain data updates, creating a fluid user experience.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Session Persistence & Recovery</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Implementing ADK's database session service for reliable conversation history,
                        wallet context, and seamless chat resumption across sessions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-border">
                <h4 className="text-lg font-semibold mb-4 text-center">How ADK-TS Powers ChainPilot</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-primary/5 rounded-xl">
                    <div className="text-3xl font-bold text-primary mb-2">50+</div>
                    <div className="text-sm text-muted-foreground">
                      ADK Tools Integrated
                      <br />
                      (Alchemy, Jupiter, Research)
                    </div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-xl">
                    <div className="text-3xl font-bold text-primary mb-2">100%</div>
                    <div className="text-sm text-muted-foreground">
                      Built with ADK Framework
                      <br />
                      (AgentBuilder, SessionService)
                    </div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-xl">
                    <div className="text-3xl font-bold text-primary mb-2">3</div>
                    <div className="text-sm text-muted-foreground">
                      Blockchain Ecosystems
                      <br />
                      (EVM, Solana, Cross-chain)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Problem We're Solving</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              The blockchain ecosystem is exploding with innovation across multiple chains, but users are drowning
              in interfaces. Switching between Ethereum, Solana, Base, and others requires managing different wallets,
              interfaces, and mental models. We solved it with one conversational interface powered by AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm text-center"
            >
              <Brain className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">Multi-Chain Native</h3>
              <p className="text-muted-foreground">
                Access Ethereum, Base, Arbitrum, Optimism, Polygon, and Solana through one AI assistant.
                Check balances, track NFTs, get swap quotes - all chains, one conversation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm text-center"
            >
              <Rocket className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">Production Ready</h3>
              <p className="text-muted-foreground">
                Not a demo - a fully functional platform. Real Alchemy API integration, live Jupiter DEX aggregation,
                comprehensive Web3 research tools. Built for real users, real transactions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm text-center"
            >
              <Globe className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">Extensible Architecture</h3>
              <p className="text-muted-foreground">
                Built on ADK's plugin-friendly architecture. Any protocol can integrate their tools into ChainPilot,
                creating a unified interface for the entire blockchain ecosystem.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built with Best-in-Class Technology</h2>
            <p className="text-xl text-muted-foreground">
              ChainPilot combines enterprise-grade infrastructure with cutting-edge AI capabilities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/adk.webp"
                  alt="ADK"
                  width={48}
                  height={48}
                  className="object-contain"
                />
                <h3 className="text-2xl font-bold">Anthropic ADK-TS</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Agent Development Kit provides the foundation for stateful, context-aware AI agents with:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Session persistence and conversation history management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Standardized tool integration patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Streaming capabilities for real-time responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Multi-model support (GPT-4, Claude, Gemini)</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Alchemy & Jupiter</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Enterprise blockchain infrastructure powering real-time data and transactions:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Alchemy APIs for EVM chains (Ethereum, Base, Arbitrum, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Jupiter Ultra API for Solana token data and DEX aggregation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Real-time balance, NFT, and transaction data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Cross-chain swap quotes and safety analysis</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Vision</h2>
            <p className="text-xl text-muted-foreground">
              Making multi-chain blockchain interactions accessible to everyone through AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Safety First</h3>
                  <p className="text-muted-foreground">
                    Comprehensive token safety analysis, price impact warnings, and transaction verification.
                    ChainPilot helps users make informed decisions across all supported chains.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Accessibility Revolution</h3>
                  <p className="text-muted-foreground">
                    Making DeFi operations as simple as sending a message. No need to understand different
                    chains, protocols, or technical details - just ask ChainPilot.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <Zap className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Continuous Innovation</h3>
                  <p className="text-muted-foreground">
                    Built on ADK's extensible architecture, ChainPilot will continuously evolve with new chains,
                    protocols, and AI capabilities as they emerge.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Brain className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Context-Aware Intelligence</h3>
                  <p className="text-muted-foreground">
                    Leveraging ADK's session management, ChainPilot remembers your context, preferences,
                    and goals across the entire conversation.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Experience the Future of Multi-Chain DeFi
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Built with ADK-TS and powered by Alchemy & Jupiter. ChainPilot demonstrates what's possible
              when cutting-edge AI meets enterprise blockchain infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/chat">
                  Start Using ChainPilot
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/docs">
                  Technical Documentation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
