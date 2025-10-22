"use client";

import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { ChatHeader } from "@/components/chat-header";
import { generateUUID } from "@/lib/utils";
import { MultimodalInput } from "./multimodal-input";
import { Messages } from "./messages";
import type { VisibilityType } from "./visibility-selector";
import { unstable_serialize } from "swr/infinite";
import { getChatHistoryPaginationKey } from "./sidebar-history";
import { toast } from "./toast";
import { useSearchParams } from "next/navigation";
import { useChatVisibility } from "@/hooks/use-chat-visibility";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { ChatSDKError } from "@/lib/errors";
import type { Attachment, ChatMessage } from "@/lib/types";
import { useDataStream } from "./data-stream-provider";
import { useADKChat } from "@/hooks/useADKChat";
import { useAccount } from "wagmi";

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
  session,
  autoResume,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
  initialVisibilityType: VisibilityType;
  isReadonly: boolean;
  session?: any;
  autoResume: boolean;
}) {
  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  });

  const { mutate } = useSWRConfig();
  const { setDataStream } = useDataStream();

  // Get wallet address from wagmi
  const { address: walletAddress, isConnected } = useAccount();

  // Use our custom ADK chat hook
  const {
    messages,
    append,
    reload,
    stop,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    setInput,
    streamingMessage,
  } = useADKChat({
    id,
    initialMessages,
    userId: session?.user?.id,
    walletAddress: walletAddress || undefined,
    onFinish: () => {
      console.log('[Chat] onFinish called - refreshing sidebar history');
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      toast({
        type: "error",
        description: error.message,
      });
    },
  });

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      append({
        id: generateUUID(),
        role: "user",
        parts: [{ type: "text", content: query }],
      });

      setHasAppendedQuery(true);
      window.history.replaceState({}, "", `/chat/${id}`);
    }
  }, [query, append, hasAppendedQuery, id]);

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  // Custom send message function to match the expected interface
  const sendMessage = (message: ChatMessage) => {
    append(message);
  };

  // Custom regenerate function
  const regenerate = () => {
    reload();
  };

  useAutoResume({
    autoResume,
    initialMessages,
    resumeStream: reload, // Use reload as resumeStream
    setMessages,
  });

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader />

        <Messages
          chatId={id}
          status={isLoading ? "pending" : "idle"}
          messages={messages}
          setMessages={setMessages}
          regenerate={regenerate}
          isReadonly={isReadonly}
          sendMessage={sendMessage}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-3 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              status={isLoading ? "pending" : "idle"}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              sendMessage={sendMessage}
              selectedVisibilityType={visibilityType}
            />
          )}
        </form>
      </div>
    </>
  );
}