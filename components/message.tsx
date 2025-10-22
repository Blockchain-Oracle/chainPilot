"use client";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";
import { PencilEditIcon, SparklesIcon } from "./icons";
import { Markdown } from "./markdown";
import { MessageActions } from "./message-actions";
import { PreviewAttachment } from "./preview-attachment";
import equal from "fast-deep-equal";
import { cn, sanitizeText } from "@/lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { MessageEditor } from "./message-editor";
import { MessageReasoning } from "./message-reasoning";
import type { SetMessages, SendMessage, Regenerate } from "@/lib/adk/types";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "./data-stream-provider";
import ToolCallLoader from "@/components/tool-call-loader";
import { SuggestionAwareMarkdown } from "@/components/SuggestionAwareMarkdown";
import { InfoIcon } from "lucide-react";

// Alchemy/ADK Tool Display Components
import {
  BalanceCard,
  TokenBalancesCard,
  TokenMetadataCard,
  TokenPriceCard,
  GasPriceCard,
  NftsOwnedCard,
  TransactionHistoryCard,
  TransferCard,
  TokenTransferCard,
  TokenApprovalCard,
  ContractCallCard,
} from "@/components/alchemy/cards";

const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  setMessages,
  sendMessage,
  regenerate,
  isReadonly,
  requiresScrollPadding,
}: {
  chatId: string;
  message: ChatMessage;
  isLoading: boolean;
  setMessages: SetMessages;
  sendMessage: SendMessage;
  regenerate: Regenerate;
  isReadonly: boolean;
  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const attachmentsFromMessage = message.parts.filter(
    (part) => part.type === "file"
  );

  useDataStream();

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} color="#fc8d36" />
              </div>
            </div>
          )}
          {message.role === "system" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <InfoIcon size={20} color="white" />
              </div>
            </div>
          )}

          <div
            className={cn(
              "flex flex-col gap-4 w-full  overflow-clip break-words whitespace-normal",
              {
                "min-h-96":
                  message.role === "assistant" && requiresScrollPadding,
              }
            )}
          >
            {attachmentsFromMessage.length > 0 && (
              <div
                data-testid={`message-attachments`}
                className="flex flex-row justify-end gap-2"
              >
                {attachmentsFromMessage.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={{
                      name: attachment.filename ?? "file",
                      contentType: attachment.mediaType,
                      url: attachment.url,
                    }}
                  />
                ))}
              </div>
            )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === "reasoning" && part.text?.trim().length > 0) {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.text}
                  />
                );
              }

              if (type === "text") {
                if (mode === "view") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start ">
                      {message.role === "user" && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                              onClick={() => {
                                setMode("edit");
                              }}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn("flex flex-col gap-4", {
                          "bg-primary text-primary-foreground px-3 py-2 rounded-xl":
                            message.role === "user",
                        })}
                      >
                        <SuggestionAwareMarkdown
                          text={sanitizeText(part.text)}
                          sendMessage={sendMessage}
                        />
                      </div>
                    </div>
                  );
                }

                if (mode === "edit") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        regenerate={regenerate}
                      />
                    </div>
                  );
                }
              }

              // Tool handler for Alchemy/ADK tools with custom cards
              if (type.startsWith("tool-")) {
                const { toolCallId, state } = part;
                const toolType = type.replace("tool-", "");
                const toolName = toolType.replace(/_/g, " ");

                // Use index in key to prevent duplicate key errors
                const uniqueKey = `${toolCallId}-${index}`;

                if (state === "input-available") {
                  return (
                    <div key={uniqueKey}>
                      <ToolCallLoader loadingMessage={`Running ${toolName}...`} />
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;

                  // Validate output structure
                  if (!output) {
                    return (
                      <div key={uniqueKey} className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500">
                        <h3 className="font-semibold mb-2 text-sm text-red-500">
                          Error: No output data for {toolName}
                        </h3>
                      </div>
                    );
                  }

                  // Map tool names to their respective card components
                  switch (toolType) {
                    case "get_balance":
                      return <BalanceCard key={uniqueKey} result={output} />;

                    case "get_token_balance":
                      return <TokenBalancesCard key={uniqueKey} result={output} />;

                    case "get_token_metadata":
                      return <TokenMetadataCard key={uniqueKey} result={output} />;

                    case "get_token_price":
                    case "get_token_price_by_address":
                      return <TokenPriceCard key={uniqueKey} result={output} />;

                    case "get_gas_price":
                      return <GasPriceCard key={uniqueKey} result={output} />;

                    case "get_nfts_owned":
                    case "get_collections_for_owner":
                      return <NftsOwnedCard key={uniqueKey} result={output} />;

                    case "get_transaction_history":
                      return <TransactionHistoryCard key={uniqueKey} result={output} />;

                    case "prepare_eth_transfer":
                      return <TransferCard key={uniqueKey} result={output} />;

                    case "prepare_token_transfer":
                      return <TokenTransferCard key={uniqueKey} result={output} />;

                    case "prepare_token_approval":
                      return <TokenApprovalCard key={uniqueKey} result={output} />;

                    case "prepare_contract_call":
                      return <ContractCallCard key={uniqueKey} result={output} />;

                    default:
                      // Fallback to generic display for unmapped tools
                      return (
                        <div key={uniqueKey} className="mt-4 p-4 bg-muted/50 rounded-lg border">
                          <h3 className="font-semibold mb-2 text-sm text-muted-foreground capitalize">
                            {toolName} Result
                          </h3>
                          <pre className="text-xs overflow-auto max-h-96">
                            {JSON.stringify(output, null, 2)}
                          </pre>
                        </div>
                      );
                  }
                }
              }

              /* REMOVED: VeChain-specific transaction tool handlers (makeSendTransaction, makeContractTransaction, makeBridgeTransaction, makeTokenTransfer, makeTokenApproval) */
              /* REMOVED: VeChain Portfolio Tools (getVETVTHOBalance, getAccountStats, getTokenList, getNFTList) */
              /* REMOVED: VeChain Network Tools (getNetworkStats, getTransactionInfo, getContractInfo) */
              /* REMOVED: VeChain Carbon Emission Tools (getAddressEmission, getBlockEmission, getTransactionEmission, getNetworkEmission) */
              /* REMOVED: VeChain Bridge Tools (getTokenPairs, getQuotaAndFee, checkBridgeStatus, getXFlowsQuote, buildXFlowsTransaction, checkXFlowsStatus) */
              /* REMOVED: VeChain StarGate Tools (getStakingLevels, stakeVET, getUserStakes, getStakeInfo, claimVTHORewards, unstakeStargate) */


            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

    return true; // ✅ Props are equal, skip re-render
  }
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
