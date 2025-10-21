"use client";

import { ArrowRight, Brain, Shield, Zap, Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

import BeamsBackground from "@/components/ui/beams-background";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar, NavbarLeft, NavbarRight } from "@/components/ui/navbar";
import Navigation from "@/components/ui/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import AlchemyToolsSection from "@/components/alchemy-tools-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 -mb-4 px-4 pb-4">
        <div className="fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg"></div>
        <div className="max-w-7xl relative mx-auto">
          <Navbar>
            <NavbarLeft>
              <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                ChainPilot
              </Link>
              <Navigation />
            </NavbarLeft>
            <NavbarRight>
              <Link
                href="/docs"
                className="hidden text-sm md:block hover:text-primary transition-colors"
              >
                Documentation
              </Link>
              <Button asChild variant="outline">
                <Link href="/chat">
                  Launch Terminal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="grid gap-6 text-lg font-medium">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                      <span>ChainPilot</span>
                    </Link>
                    <Link href="/about" className="text-muted-foreground hover:text-foreground">
                      About
                    </Link>
                    <Link href="/earn" className="text-muted-foreground hover:text-foreground">
                      Earn
                    </Link>
                    <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                      Documentation
                    </Link>
                    <Link href="/roadmap" className="text-muted-foreground hover:text-foreground">
                      Roadmap
                    </Link>
                    <Link href="/portfolio" className="text-muted-foreground hover:text-foreground">
                      Portfolio
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </NavbarRight>
          </Navbar>
        </div>
      </header>

      {/* Hero Section with BeamsBackground */}
      <BeamsBackground intensity="medium">
        <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center min-h-screen justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 animate-pulse">
              <span className="text-muted-foreground">
                Powered by ADK and Alchemy's Multi-Chain Infrastructure
              </span>
              <ArrowRight className="ml-2 h-3 w-3" />
            </Badge>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Alchemy <span className="text-primary">AI</span> Terminal
            </h1>
            
            {/* Hero Hook */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-orange-500 bg-clip-text text-transparent">
                Stop switching chains.<br />
                Start talking to blockchain.
              </h2>
            </div>

            {/* Story Section */}
            <div className="text-center mb-8 max-w-5xl mx-auto">
              <p className="text-xl md:text-2xl text-muted-foreground mb-6 leading-relaxed">
                Remember when we used to open apps for everything? Now we just talk to AI.
              </p>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                The same revolution is hitting blockchain. Why navigate complex DeFi interfaces when you can say{" "}
                <span className="bg-primary/20 text-primary px-2 py-1 rounded font-mono text-base">
                  "swap 1 ETH for USDC on Base"
                </span>? Why check multiple explorers when you can ask{" "}
                <span className="bg-primary/20 text-primary px-2 py-1 rounded font-mono text-base">
                  "what's my balance across all chains"
                </span>?
              </p>
            </div>

            {/* Key Message */}
            <div className="text-center mb-8">
              <p className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                ChainPilot isn't just another blockchain tool -<br />
                it's <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">the unified interface for all EVM chains.</span>
              </p>
            </div>

            {/* Stats */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center gap-4 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-8 py-4">
                <span className="text-primary font-bold text-lg">10+ chains</span>
                <div className="w-1 h-1 bg-primary/60 rounded-full"></div>
                <span className="text-primary font-bold text-lg">Real-time data</span>
                <div className="w-1 h-1 bg-primary/60 rounded-full"></div>
                <span className="text-primary font-bold text-lg">1 conversation</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" asChild className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white font-bold">
                <Link href="/chat">
                  🚀 Start Multi-Chain Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/docs">
                  <Github className="mr-2 h-5 w-5" />
                  Documentation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </BeamsBackground>

      {/* Features Section */}
      <section className="py-32 bg-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              We've Built What Everyone Else Is Promising
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From ETH transfers to NFT portfolios, token swaps to gas optimization - everything through natural language.
              One interface for Ethereum, Base, Polygon, Arbitrum, Optimism, and more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300"
            >
              <Brain className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Multi-Chain Native</h3>
              <p className="text-muted-foreground">
                Real-time blockchain data across 10+ EVM chains. Check balances, track NFTs, monitor gas prices - all in one place.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300"
            >
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Powered by ADK</h3>
              <p className="text-muted-foreground">
                Built with Agent Development Kit for reliable AI interactions. Extensible architecture allows adding new chains and features easily.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300"
            >
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Alchemy Infrastructure</h3>
              <p className="text-muted-foreground">
                Enterprise-grade reliability with Alchemy's proven APIs. Real-time data, instant responses, and seamless chain switching.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Alchemy Tools Section */}
      <AlchemyToolsSection />

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to unify your blockchain experience?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Access all EVM chains through one conversation. Check balances, track NFTs, monitor gas prices,
              and execute transactions - all with natural language.
            </p>
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/chat">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold">ChainPilot</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                The most advanced AI-powered terminal for multi-chain blockchain operations powered by ADK and Alchemy.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/roadmap" className="hover:text-foreground transition-colors">Roadmap</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://github.com/alchemy-ai-terminal" className="hover:text-foreground transition-colors flex items-center">
                    GitHub
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
                <li><Link href="/chat" className="hover:text-foreground transition-colors">Discord</Link></li>
                <li><Link href="/chat" className="hover:text-foreground transition-colors">Twitter</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ChainPilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}