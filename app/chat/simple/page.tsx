"use client";

import { EnhancedChat } from "@/components/enhanced-chat";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createNewChat } from "@/app/_actions/chat";
import { toast } from "sonner";

export default function SimpleChatPage() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const initializeChat = async () => {
      if (!isConnected || !address) {
        setIsInitializing(false);
        return;
      }

      try {
        const result = await createNewChat(address);
        if (result.success && result.chatId) {
          setChatId(result.chatId);
        } else {
          toast.error("Failed to initialize chat");
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Failed to initialize chat");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChat();
  }, [address, isConnected]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="vet-loading-dots mb-4">
            <span className="vet-loading-dot" />
            <span className="vet-loading-dot" />
            <span className="vet-loading-dot" />
          </div>
          <p className="text-vet-text-secondary">Initializing chat...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center vet-glass-card p-8 max-w-md">
          <h2 className="text-xl font-semibold text-vet-text-primary mb-4">
            Wallet Not Connected
          </h2>
          <p className="text-vet-text-secondary">
            Please connect your wallet to start chatting with ChainPilot.
          </p>
        </div>
      </div>
    );
  }

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center vet-glass-card p-8 max-w-md">
          <h2 className="text-xl font-semibold text-vet-error mb-4">
            Failed to Initialize
          </h2>
          <p className="text-vet-text-secondary mb-4">
            Unable to create chat session. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="vet-button-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vet-bg">
      <EnhancedChat chatId={chatId} />
    </div>
  );
}
