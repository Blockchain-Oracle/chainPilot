"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { createNewChat } from "@/app/_actions/chat";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { RainbowConnectButton } from "@/components/rainbow-connect-button";

export default function ChatHomePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Auto-create chat when wallet connects
    if (isConnected && address && !isCreating) {
      handleCreateChat();
    }
  }, [isConnected, address]);

  const handleCreateChat = async () => {
    if (!address) return;

    setIsCreating(true);
    try {
      const result = await createNewChat(address);
      if (result.success && result.chatId) {
        router.push(`/chat/${result.chatId}`);
      } else {
        toast.error(result.error || "Failed to create chat");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
    } finally {
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-vet-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-accent"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-vet-accent/30 animate-pulse"></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center"
        >
          <p className="text-lg font-semibold text-vet-accent">ChainPilot</p>
          <p className="text-sm text-vet-text-muted">Initializing AI systems...</p>
        </motion.div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 bg-vet-bg relative overflow-hidden overflow-x-hidden">
        {/* Ambient glow background */}
        <div className="vet-glow-bg" />

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md z-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-vet-text-primary mb-4 bg-clip-text">
            Welcome to ChainPilot
          </h1>
          <p className="text-vet-text-secondary mb-8 text-base md:text-lg leading-relaxed">
            Your AI co-pilot for multi-chain blockchain interactions. Connect your wallet to get started and explore blockchain with intelligent assistance.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <RainbowConnectButton />
          </motion.div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 max-w-6xl w-full px-4 z-10 overflow-x-hidden"
        >
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="vet-glass-card p-6 group"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-vet-accent/10 flex items-center justify-center group-hover:bg-vet-accent/20 transition-colors duration-200">
                <svg className="w-5 h-5 text-vet-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-base text-vet-text-primary">Multi-Chain Analytics</h3>
                <p className="text-sm text-vet-text-secondary leading-relaxed">
                  Get insights across Ethereum, Base, Polygon, Arbitrum, and Optimism with real-time data
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="vet-glass-card p-6 group"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-vet-accent/10 flex items-center justify-center group-hover:bg-vet-accent/20 transition-colors duration-200">
                <svg className="w-5 h-5 text-vet-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-base text-vet-text-primary">Token & NFT Tracking</h3>
                <p className="text-sm text-vet-text-secondary leading-relaxed">
                  Track balances, view NFT portfolios, and monitor token prices across all chains
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="vet-glass-card p-6 group"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-vet-accent/10 flex items-center justify-center group-hover:bg-vet-accent/20 transition-colors duration-200">
                <svg className="w-5 h-5 text-vet-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-base text-vet-text-primary">Gas Optimization</h3>
                <p className="text-sm text-vet-text-secondary leading-relaxed">
                  Monitor gas prices and get transaction fee estimates across different networks
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-vet-bg to-transparent pointer-events-none" />
      </div>
    );
  }

  return null;
}
