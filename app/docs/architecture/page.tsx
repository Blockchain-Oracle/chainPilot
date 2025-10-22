"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Database,
  Globe,
  Shield,
  Zap,
  Code,
  Layers,
  GitBranch,
  Server,
  Smartphone,
  Cloud,
  Lock,
  ArrowRight,
  Check,
  Cpu,
  Network,
  Workflow,
  Sparkles
} from "lucide-react";

const architecturePhases = [
  {
    layer: "Presentation Layer",
    description: "Next.js 15 App Router with React 19 RC providing modern SSR/SSG capabilities",
    icon: Globe,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    components: [
      "Next.js App Router",
      "React Server Components",
      "Static Generation",
      "Incremental Static Regeneration",
      "Edge Runtime Support"
    ]
  },
  {
    layer: "UI/UX Layer",
    description: "Component-driven architecture with Tailwind CSS and Framer Motion animations",
    icon: Layers,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    components: [
      "Radix UI Primitives",
      "Tailwind CSS Utilities",
      "Framer Motion Animations",
      "Dark/Light Theme System",
      "Responsive Design Patterns"
    ]
  },
  {
    layer: "ADK-TS Agent Layer",
    description: "Anthropic's Agent Development Kit powering stateful AI agents with session management",
    icon: Brain,
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    components: [
      "AgentBuilder Pattern",
      "SessionService Integration",
      "Tool Registry System",
      "Streaming Responses",
      "State Persistence"
    ]
  },
  {
    layer: "Multi-Chain Blockchain Layer",
    description: "Unified interface for EVM chains via Alchemy and Solana via Jupiter APIs",
    icon: Shield,
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    components: [
      "RainbowKit Wallet Integration",
      "Alchemy Multi-Chain APIs",
      "Jupiter Ultra (Solana)",
      "Transaction Management",
      "Cross-Chain Routing"
    ]
  },
  {
    layer: "Data & Storage Layer",
    description: "Multi-database architecture with ORM, caching, and external API integrations",
    icon: Database,
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    components: [
      "Drizzle ORM",
      "PostgreSQL Database",
      "Session Persistence",
      "Conversation History",
      "External API Gateway"
    ]
  }
];

const toolCategories = [
  {
    category: "EVM Chain Operations",
    count: 25,
    description: "Comprehensive multi-chain wallet and account management via Alchemy",
    tools: ["Token Balances", "Transaction History", "NFT Portfolios", "Gas Estimation"]
  },
  {
    category: "Solana Operations",
    count: 15,
    description: "Solana token data and DEX operations via Jupiter Ultra API",
    tools: ["Token Info", "Price Data", "Swap Quotes", "Liquidity Analysis"]
  },
  {
    category: "ENS & Name Services",
    count: 8,
    description: "Ethereum Name Service resolution and reverse lookups",
    tools: ["ENS Resolution", "Reverse Lookup", "Avatar Retrieval", "Profile Data"]
  },
  {
    category: "Transaction Tools",
    count: 12,
    description: "Transaction building, simulation, and execution across chains",
    tools: ["Send Tokens", "Transaction Status", "Receipt Lookup", "Gas Optimization"]
  },
  {
    category: "Analytics & Insights",
    count: 10,
    description: "Real-time blockchain analytics and portfolio tracking",
    tools: ["Portfolio Value", "Token Analytics", "Transaction Patterns", "Chain Statistics"]
  },
  {
    category: "DeFi Operations",
    count: 18,
    description: "Decentralized exchange and DeFi protocol interactions",
    tools: ["Swap Quotes", "Liquidity Pools", "Yield Farming", "Price Oracles"]
  }
];

const techStack = [
  {
    category: "ADK-TS Framework",
    technologies: [
      { name: "Agent Development Kit", version: "Latest", description: "Anthropic's stateful agent framework" },
      { name: "AgentBuilder", version: "Core", description: "Pattern for building conversational agents" },
      { name: "SessionService", version: "Core", description: "Persistent session and state management" }
    ]
  },
  {
    category: "Frontend Framework",
    technologies: [
      { name: "Next.js", version: "15.3.0", description: "React framework with App Router" },
      { name: "React", version: "19.0.0-rc", description: "UI library with concurrent features" },
      { name: "TypeScript", version: "5.6.3", description: "Type-safe development" }
    ]
  },
  {
    category: "Blockchain Infrastructure",
    technologies: [
      { name: "Alchemy APIs", version: "Latest", description: "Multi-chain EVM data and APIs" },
      { name: "Jupiter Ultra", version: "v1", description: "Solana token data and DEX aggregation" },
      { name: "RainbowKit", version: "2.0+", description: "Multi-chain wallet connectivity" }
    ]
  },
  {
    category: "Database & Storage",
    technologies: [
      { name: "Drizzle ORM", version: "0.34.0", description: "Type-safe database operations" },
      { name: "PostgreSQL", version: "Latest", description: "Production database with session storage" },
      { name: "Vercel Postgres", version: "Latest", description: "Managed database service" }
    ]
  }
];

export default function ArchitecturePage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <Badge variant="outline" className="mb-4">
          <Code className="mr-2 h-3 w-3" />
          <span className="text-muted-foreground">System Architecture</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          ADK-TS Agent Architecture
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl">
          ChainPilot is built on Anthropic's Agent Development Kit (ADK-TS), enabling stateful AI agents
          that persist conversation history and execute multi-chain blockchain operations. Our architecture
          combines modern web technologies with enterprise-grade blockchain infrastructure.
        </p>
      </motion.div>

      {/* ADK-TS Showcase */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <Card className="p-8 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-primary/20">
          <div className="flex flex-col items-center text-center mb-8">
            <Image
              src="/adk.webp"
              alt="Agent Development Kit (ADK)"
              width={80}
              height={80}
              className="object-contain mb-4"
            />
            <Badge className="mb-4 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
              <Sparkles className="mr-2 h-3 w-3" />
              Powered by ADK-TS
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Built on ADK-TS</h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              ChainPilot leverages Anthropic's Agent Development Kit to create stateful, conversational
              agents that maintain context across sessions and execute complex blockchain workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-xl bg-card/50">
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Session Persistence</h3>
              </div>
              <p className="text-muted-foreground">
                ADK's SessionService enables persistent conversation history stored in PostgreSQL,
                allowing agents to maintain context across multiple interactions and browser sessions.
              </p>
            </div>

            <div className="p-6 border rounded-xl bg-card/50">
              <div className="flex items-center gap-3 mb-3">
                <Workflow className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">AgentBuilder Pattern</h3>
              </div>
              <p className="text-muted-foreground">
                Structured agent creation using ADK's AgentBuilder with tool registration,
                instruction management, and streaming response capabilities built-in.
              </p>
            </div>

            <div className="p-6 border rounded-xl bg-card/50">
              <div className="flex items-center gap-3 mb-3">
                <Cpu className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Tool Integration</h3>
              </div>
              <p className="text-muted-foreground">
                Seamless integration of 88+ blockchain tools through ADK's tool registry system,
                with automatic parameter validation and error handling across all chains.
              </p>
            </div>

            <div className="p-6 border rounded-xl bg-card/50">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Streaming Responses</h3>
              </div>
              <p className="text-muted-foreground">
                Real-time streaming of AI responses and tool execution results, providing instant
                feedback as complex blockchain operations are processed.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 border rounded-xl bg-primary/5 border-primary/20">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">88+</div>
                <div className="text-sm text-muted-foreground">Blockchain Tools</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">ADK-Built Agent</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Supported Chains</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* System Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Workflow className="h-8 w-8 text-primary" />
          System Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              <div className="p-6 border rounded-xl bg-card/50">
                <h3 className="text-xl font-semibold mb-3">Conversational Interface</h3>
                <p className="text-muted-foreground">
                  Natural language processing transforms user intent into blockchain operations through
                  ADK's agent framework with 88+ specialized tools across EVM chains and Solana.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card/50">
                <h3 className="text-xl font-semibold mb-3">Stateful Agent System</h3>
                <p className="text-muted-foreground">
                  ADK's SessionService maintains conversation context and state across sessions,
                  enabling complex multi-step workflows and personalized interactions.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card/50">
                <h3 className="text-xl font-semibold mb-3">Multi-Chain Infrastructure</h3>
                <p className="text-muted-foreground">
                  Unified access to 10+ EVM chains via Alchemy and Solana via Jupiter Ultra,
                  with RainbowKit for seamless wallet connectivity across ecosystems.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur-3xl"></div>
            <Card className="relative p-8 bg-card/80 backdrop-blur border-primary/20">
              <div className="text-center space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm font-medium">Next.js Frontend</div>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm font-medium">ADK-TS Agent</div>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm font-medium">Multi-Chain APIs</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="p-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl">
                  <Zap className="h-10 w-10 text-primary mx-auto mb-2" />
                  <div className="font-semibold">Conversational Multi-Chain Operations</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Architecture Layers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Layers className="h-8 w-8 text-primary" />
          Architecture Layers
        </h2>

        <div className="space-y-6">
          {architecturePhases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={phase.layer}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 border rounded-xl ${phase.color} bg-card/50 backdrop-blur`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-background/50">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold">{phase.layer}</h3>
                      <Badge variant="secondary" className="text-xs">
                        Layer {index + 1}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {phase.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {phase.components.map((component, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{component}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Tool Registry */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Cpu className="h-8 w-8 text-primary" />
          Multi-Chain Tool Registry
        </h2>

        <div className="mb-8">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our ADK-TS agent leverages 88+ specialized tools organized into functional categories.
            Each tool is designed for specific blockchain operations with intelligent error handling and validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolCategories.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 border rounded-xl bg-card/50 hover:bg-card/70 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{category.category}</h3>
                <Badge variant="outline" className="text-xs">
                  {category.count} tools
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {category.description}
              </p>

              <div className="space-y-2">
                {category.tools.map((tool, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{tool}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Technology Stack */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Server className="h-8 w-8 text-primary" />
          Technology Stack
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {techStack.map((stack, index) => (
            <motion.div
              key={stack.category}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                {stack.category === "ADK-TS Framework" && (
                  <Image
                    src="/adk.webp"
                    alt="ADK"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
                {stack.category}
              </h3>

              <div className="space-y-3">
                {stack.technologies.map((tech, i) => (
                  <div key={i} className="p-4 border rounded-lg bg-card/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{tech.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {tech.version}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Security & Performance */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Lock className="h-8 w-8 text-primary" />
          Security & Performance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 bg-card/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Security Measures
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Client-Side Wallet Integration</div>
                  <div className="text-sm text-muted-foreground">No private keys stored on servers</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Multi-Chain Wallet Support</div>
                  <div className="text-sm text-muted-foreground">RainbowKit for secure cross-chain connectivity</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Input Validation & Sanitization</div>
                  <div className="text-sm text-muted-foreground">Comprehensive data validation pipeline</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">API Key Security</div>
                  <div className="text-sm text-muted-foreground">Server-side API key management for Alchemy/Jupiter</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Performance Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Edge Runtime Support</div>
                  <div className="text-sm text-muted-foreground">Global distribution and low latency</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">ADK Streaming Responses</div>
                  <div className="text-sm text-muted-foreground">Real-time agent responses and tool execution</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Session Caching</div>
                  <div className="text-sm text-muted-foreground">Optimized conversation history retrieval</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Progressive Enhancement</div>
                  <div className="text-sm text-muted-foreground">Graceful degradation and error handling</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Data Flow */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Network className="h-8 w-8 text-primary" />
          ADK-TS Agent Data Flow
        </h2>

        <Card className="p-8 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 bg-blue-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">User Input</h3>
              <p className="text-sm text-muted-foreground">
                Natural language commands processed through conversational interface
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">ADK Agent Processing</h3>
              <p className="text-sm text-muted-foreground">
                AgentBuilder analyzes intent, maintains session state, and selects tools
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-orange-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Multi-Chain Execution</h3>
              <p className="text-sm text-muted-foreground">
                Tools execute across EVM chains (Alchemy) and Solana (Jupiter)
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">Streaming Response</h3>
              <p className="text-sm text-muted-foreground">
                Real-time results with session persistence for future context
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {step}
                  </div>
                  {index < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
