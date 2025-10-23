"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDown, Wallet, Copy, LogOut, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function WalletMenu() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        mounted,
      }) => {
        const ready = mounted;

        if (!ready || !account) {
          return null;
        }

        const copyAddress = () => {
          navigator.clipboard.writeText(account.address);
          toast.success("Address copied to clipboard!");
        };

        const viewOnExplorer = () => {
          const explorerUrl = chain?.blockExplorers?.default?.url;
          if (explorerUrl) {
            window.open(`${explorerUrl}/address/${account.address}`, "_blank");
          }
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-vet-surface/50 border border-vet-border/30 hover:bg-vet-surface/70 transition-all duration-200"
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-vet-accent animate-pulse" />
                <span className="text-xs sm:text-sm text-vet-text-primary font-medium hidden sm:inline">
                  ChainPilot Active
                </span>
                <span className="text-xs text-vet-text-primary font-medium sm:hidden">
                  Active
                </span>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-vet-text-secondary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-vet-surface/95 backdrop-blur-xl border-vet-border/50 shadow-xl"
            >
              <DropdownMenuLabel className="text-vet-text-primary">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-vet-text-secondary font-normal">
                    Connected Wallet
                  </span>
                  <span className="font-mono text-sm">{account.displayName}</span>
                  {account.displayBalance && (
                    <span className="text-xs text-vet-accent font-normal">
                      {account.displayBalance}
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-vet-border/30" />

              {chain && (
                <>
                  <DropdownMenuItem
                    onClick={openChainModal}
                    className="text-vet-text-primary hover:bg-vet-surface/50 cursor-pointer"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    <span>Network: {chain.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-vet-border/30" />
                </>
              )}

              <DropdownMenuItem
                onClick={copyAddress}
                className="text-vet-text-primary hover:bg-vet-surface/50 cursor-pointer"
              >
                <Copy className="w-4 h-4 mr-2" />
                <span>Copy Address</span>
              </DropdownMenuItem>

              {chain?.blockExplorers?.default && (
                <DropdownMenuItem
                  onClick={viewOnExplorer}
                  className="text-vet-text-primary hover:bg-vet-surface/50 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>View on Explorer</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="bg-vet-border/30" />

              <DropdownMenuItem
                onClick={openAccountModal}
                className="text-vet-error hover:bg-vet-error/10 cursor-pointer focus:bg-vet-error/10 focus:text-vet-error"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Disconnect Wallet</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }}
    </ConnectButton.Custom>
  );
}
