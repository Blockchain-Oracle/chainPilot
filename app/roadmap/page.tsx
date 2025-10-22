"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
  Brain,
  Shield,
  Zap,
  Code,
  Globe,
  Users,
  Target,
  Rocket
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

const roadmapPhases = [
  {
    phase: "Phase 1",
    title: "Foundation ✅ COMPLETED",
    status: "completed",
    timeframe: "SHIPPED",
    description: "50+ AI tools for multi-chain operations built with ADK-TS",
    milestones: [
      {
        title: "ADK-TS Agent Framework",
        description: "Built using AgentBuilder, SessionService, and streaming tools from ADK",
        status: "completed",
        icon: Code
      },
      {
        title: "Multi-Chain Integration",
        description: "Alchemy APIs for EVM chains + Jupiter for Solana DEX aggregation",
        status: "completed",
        icon: Globe
      },
      {
        title: "Real-time AI Streaming",
        description: "Live blockchain data with progressive AI responses using ADK streaming",
        status: "completed",
        icon: Zap
      },
      {
        title: "Web Interface & Wallet Connect",
        description: "Full-featured web app with RainbowKit integration",
        status: "completed",
        icon: Brain
      }
    ]
  },
  {
    phase: "Phase 2",
    title: "Enhanced Intelligence 🚧 IN PROGRESS",
    status: "in-progress",
    timeframe: "Q1 2025",
    description: "Advanced AI capabilities and cross-chain features",
    milestones: [
      {
        title: "Token Safety Analysis",
        description: "Comprehensive safety scoring for Solana tokens using Jupiter Ultra API",
        status: "in-progress",
        icon: Shield
      },
      {
        title: "Cross-Chain Swap Quotes",
        description: "Compare prices and routes across multiple DEXs and chains",
        status: "in-progress",
        icon: Target
      },
      {
        title: "Web3 Research Tools",
        description: "AI-powered token research with multi-source aggregation",
        status: "in-progress",
        icon: Brain
      },
      {
        title: "Transaction Preparation",
        description: "Prepare and validate transactions before execution",
        status: "planned",
        icon: Zap
      }
    ]
  },
  {
    phase: "Phase 3",
    title: "Plugin Ecosystem 🎯 Q2 2025",
    status: "planned",
    timeframe: "Q2 2025",
    description: "Building the ChatGPT plugin moment for blockchain",
    milestones: [
      {
        title: "MCP Server Integration",
        description: "Model Context Protocol for standardized AI tool plugins",
        status: "planned",
        icon: Code
      },
      {
        title: "Open Tool Registry",
        description: "Any protocol can add their tools to ChainPilot",
        status: "planned",
        icon: Target
      },
      {
        title: "Plugin Marketplace",
        description: "Discover and install new blockchain protocol integrations",
        status: "planned",
        icon: Globe
      },
      {
        title: "Developer SDK",
        description: "Build custom tools and integrations with ADK-TS",
        status: "planned",
        icon: Rocket
      }
    ]
  },
  {
    phase: "Phase 4",
    title: "Desktop & Local AI 🔮 Q2-Q3 2025",
    status: "planned",
    timeframe: "Q2-Q3 2025",
    description: "Breaking free from browsers and cloud dependencies",
    milestones: [
      {
        title: "Native Desktop App",
        description: "Windows, Mac, Linux apps with enhanced performance",
        status: "planned",
        icon: Brain
      },
      {
        title: "Local AI with Ollama",
        description: "Run everything locally with open-source models",
        status: "planned",
        icon: Users
      },
      {
        title: "Enhanced Privacy Mode",
        description: "All AI processing happens on your machine",
        status: "planned",
        icon: Shield
      },
      {
        title: "Performance Optimization",
        description: "Native performance benefits over web version",
        status: "planned",
        icon: Zap
      }
    ]
  }
];

const statusIcons = {
  completed: CheckCircle,
  "in-progress": Clock,
  planned: Calendar
};

export default function RoadmapPage() {
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
              <span className="text-muted-foreground">Product Roadmap</span>
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Building the Multi-Chain AI Operating System
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              We've shipped 50+ working tools built with ADK-TS. Now we're building the plugin ecosystem,
              advanced intelligence, and local AI capabilities that will transform blockchain interactions.
            </p>

            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/chat">
                Try Current Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">From Foundation to Future</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Phase 1 is complete - we've built a production-ready multi-chain AI assistant with ADK-TS.
              Now we're expanding capabilities and opening the platform to the ecosystem.
            </p>
          </motion.div>

          <div className="space-y-16">
            {roadmapPhases.map((phase, phaseIndex) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: phaseIndex * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Phase Header */}
                <div className="flex items-center gap-6 mb-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    phase.status === 'completed' ? 'bg-green-500' :
                    phase.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    {phase.phase.split(' ')[1]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-bold">{phase.title}</h3>
                      <Badge variant={phase.status === 'completed' ? 'default' : 'secondary'}>
                        {phase.status.charAt(0).toUpperCase() + phase.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="text-sm font-medium">{phase.timeframe}</span>
                      <span className="text-sm">•</span>
                      <span className="text-sm">{phase.description}</span>
                    </div>
                  </div>
                </div>

                {/* Milestones Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-22">
                  {phase.milestones.map((milestone, milestoneIndex) => {
                    const Icon = milestone.icon;
                    const StatusIcon = statusIcons[milestone.status as keyof typeof statusIcons];

                    return (
                      <motion.div
                        key={milestone.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 + milestoneIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{milestone.title}</h4>
                              <StatusIcon className={`h-4 w-4 ${
                                milestone.status === 'completed' ? 'text-green-500' :
                                milestone.status === 'in-progress' ? 'text-blue-500' : 'text-gray-400'
                              }`} />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Phase Connector */}
                {phaseIndex < roadmapPhases.length - 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="w-1 h-12 bg-gradient-to-b from-primary/50 to-muted"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the Multi-Chain Revolution</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Built with ADK-TS and powered by Alchemy & Jupiter. ChainPilot is production-ready today,
              with ambitious plans for tomorrow. Experience the future of blockchain interactions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/chat">
                  Try ChainPilot
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
