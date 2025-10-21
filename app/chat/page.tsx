"use client";

import { useState, useEffect } from "react";
import { Chat } from "@/components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { useAccount } from "wagmi";
import { RainbowConnectButton } from "@/components/rainbow-connect-button";

export default function Page() {
  const [id] = useState(() => generateUUID());
  const [chatModel, setChatModel] = useState(DEFAULT_CHAT_MODEL);
  const { isConnected } = useAccount();
  const isLoading = false; // wagmi loads instantly

  useEffect(() => {
    // Get chat model from cookie on client side
    const cookies = document.cookie.split(';');
    const chatModelCookie = cookies.find(cookie => 
      cookie.trim().startsWith('chat-model=')
    );
    
    if (chatModelCookie) {
      const modelValue = chatModelCookie.split('=')[1];
      setChatModel(modelValue);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-primary/30 animate-pulse"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-primary">ChainPilot</p>
          <p className="text-sm text-muted-foreground">Initializing AI systems...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Welcome to ChainPilot
          </h1>
          <p className="text-muted-foreground mb-6 text-lg">
            Your AI co-pilot for multi-chain blockchain interactions. Connect your wallet to get started and explore blockchain with intelligent assistance.
          </p>
          <RainbowConnectButton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-6xl">
          <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <h3 className="font-semibold mb-3 text-lg text-primary">Multi-Chain Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Get insights across Ethereum, Base, Polygon, Arbitrum, and Optimism with real-time data
            </p>
          </div>
          <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <h3 className="font-semibold mb-3 text-lg text-primary">Token & NFT Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Track balances, view NFT portfolios, and monitor token prices across all chains
            </p>
          </div>
          <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <h3 className="font-semibold mb-3 text-lg text-primary">Gas Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Monitor gas prices and get transaction fee estimates across different networks
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      initialChatModel={chatModel}
      initialVisibilityType="private"
      isReadonly={false}
      autoResume={false}
    />
  );
}
