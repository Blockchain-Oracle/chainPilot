"use client";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Plus } from "lucide-react";
import { SidebarHistory } from "@/components/sidebar-history";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Image from "next/image";

export function AppSidebar() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { address, isConnected } = useAccount();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0 bg-gradient-to-b from-vet-surface/95 via-vet-surface/90 to-vet-surface/95 backdrop-blur-2xl border-r border-vet-border/30 shadow-2xl">
      <SidebarHeader className="border-b border-vet-border/30 bg-vet-surface/40 backdrop-blur-sm">
        <SidebarMenu>
          <div className="flex flex-col gap-4 p-1">
            {/* Logo and Title */}
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex items-center gap-3 group transition-all duration-300"
            >
              <Image
                src="/logo.png"
                alt="ChainPilot Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-vet-text-primary group-hover:text-vet-accent transition-colors duration-200 tracking-tight">
                  ChainPilot
                </h1>
                <span className="text-[10px] text-vet-text-muted font-medium tracking-wider uppercase">
                  AI Terminal
                </span>
              </div>
            </Link>

            {/* New Chat Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="w-full justify-start gap-3 h-11 bg-vet-gradient text-white hover:bg-vet-gradient hover:opacity-90 shadow-vet-glow-subtle hover:shadow-vet-glow transition-all duration-300 font-medium rounded-xl group relative overflow-hidden"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push("/chat");
                    router.refresh();
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span>New Conversation</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-vet-surface border-vet-border text-vet-text-primary">
                Start a new chat session
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-transparent px-2 py-4">
        {/* Quick Stats */}
        {isConnected && address && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-2 mb-4 p-3 rounded-xl bg-vet-surface/50 border border-vet-border/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-vet-text-muted font-medium">Connected</span>
            </div>
            <div className="text-xs text-vet-text-secondary font-mono truncate">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          </motion.div>
        )}

        <SidebarHistory
          user={isConnected && address ? { address } : undefined}
          status={isConnected && address ? "authenticated" : "unauthenticated"}
        />
      </SidebarContent>

      <SidebarFooter className="border-t border-vet-border/30 bg-vet-surface/40 backdrop-blur-sm p-4">
        <div className="text-[10px] text-center text-vet-text-muted">
          Powered by ADK & Alchemy
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
