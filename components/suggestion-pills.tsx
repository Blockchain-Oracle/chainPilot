// components/SuggestionPills.tsx
"use client";
import Image from "next/image";
import { ChatMessage } from "@/lib/types";
import { SendMessage } from "@/lib/adk/types";
import { generateUUID } from "@/lib/utils";
import React from "react";

export function SuggestionPills({
  label,
  sendMessage,
}: {
  label: string;
  sendMessage: SendMessage;
}) {
  return (
    <button
      onClick={() => {
        sendMessage({
          id: generateUUID(),
          role: "user",
          parts: [{ type: "text", text: label }],
        });
      }}
      className=""
    >
      <div className="inline-flex items-center rounded-lg px-3 py-1 text-sm border border-neutral-700/50  hover:bg-neutral-900 mx-1 font-semibold gap-2 mt-2">
        <Image src="/logo.png" alt="logo" width={12} height={12}/>
        <span>{label}</span>
      </div>
    </button>
  );
}
