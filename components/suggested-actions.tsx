"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { memo } from "react";
import type { SendMessage } from "@/lib/adk/types";
import type { VisibilityType } from "./visibility-selector";
import type { ChatMessage } from "@/lib/types";
import { toast } from "sonner";
import { useAccount } from "wagmi";

interface SuggestedActionsProps {
  chatId: string;
  sendMessage: SendMessage;
  selectedVisibilityType: VisibilityType;
}

function PureSuggestedActions({
  chatId,
  sendMessage,
  selectedVisibilityType,
}: SuggestedActionsProps) {
  const { isConnected } = useAccount();

  const suggestedActions = [
    {
      title: "Check my token balances",
      label: "view wallet ERC20 balances",
      action: "Show me my token balances",
    },
    {
      title: "Get network statistics",
      label: "current blockchain metrics",
      action: "What are the current network statistics?",
    },
    {
      title: "View my NFT collections",
      label: "check ERC-721 NFT holdings",
      action: "Show me my NFT collections and balances",
    },
    {
      title: "Check gas prices",
      label: "current network gas fees",
      action: "What are the current gas prices on Ethereum and Base?",
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className="block"
        >
          <Button
            variant="ghost"
            onClick={async (e) => {
              e.preventDefault();
              if (!isConnected) {
                toast.error("Please connect your wallet to send a message");
                return;
              }

              window.history.replaceState({}, "", `/chat/${chatId}`);

              sendMessage({
                role: "user",
                parts: [{ type: "text", text: suggestedAction.action }],
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex flex-col gap-1 w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType)
      return false;

    return true;
  }
);
