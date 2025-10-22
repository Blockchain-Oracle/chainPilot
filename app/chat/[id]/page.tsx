"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { EnhancedChat } from "@/components/enhanced-chat";
import { JupiterSwapWidget } from "@/components/jupiter";

export default function ChatPage() {
  const params = useParams();
  const chatId = params?.id as string;
  const { address, isConnected } = useAccount();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    if (!chatId) {
      toast.error("Invalid chat ID");
      setIsValidating(false);
      return;
    }

    if (!isConnected || !address) {
      setIsValidating(false);
      return;
    }

    // Chat validation happens automatically through the agent
    setIsValidating(false);
  }, [chatId, address, isConnected]);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="vet-loading-dots mb-4">
            <span className="vet-loading-dot" />
            <span className="vet-loading-dot" />
            <span className="vet-loading-dot" />
          </div>
          <p className="text-vet-text-secondary">Loading chat...</p>
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
            Please connect your wallet to access this chat.
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
            Invalid Chat
          </h2>
          <p className="text-vet-text-secondary">
            This chat session could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vet-bg overflow-x-hidden">
      <EnhancedChat chatId={chatId} />
    </div>
  );
}
