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
        transition={{ duration: 0.3, ease: "easeOut" }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-[80%]",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-vet-border bg-vet-surface">
              <div className="translate-y-px">
                <SparklesIcon size={14} color="#E2008C" />
              </div>
            </div>
          )}
          {message.role === "system" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-vet-border bg-vet-surface">
              <div className="translate-y-px">
                <InfoIcon size={20} color="#E2008C" />
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

              // Debug: Log tool parts to identify duplicates
              if (type.startsWith("tool-")) {
                console.log(`[Message ${message.id}] Part ${index}:`, {
                  type,
                  toolCallId: part.toolCallId,
                  state: part.state,
                });
              }

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
                    <motion.div
                      key={key}
                      className="flex flex-row gap-2 items-start"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {message.role === "user" && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-vet-text-secondary opacity-0 group-hover/message:opacity-100 hover:bg-vet-surface/50 transition-all duration-200"
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
                          "vet-chat-user max-w-[80%] ml-auto bg-vet-accent text-white rounded-2xl p-4":
                            message.role === "user",
                          "vet-chat-ai max-w-[80%] bg-vet-surface border border-vet-border rounded-2xl p-4":
                            message.role === "assistant",
                        })}
                      >
                        <SuggestionAwareMarkdown
                          text={sanitizeText(part.text)}
                          sendMessage={sendMessage}
                        />
                      </div>
                    </motion.div>
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

                // Only show loading state during active streaming, not for saved messages
                if (state === "input-available" && isLoading) {
                  return (
                    <motion.div
                      key={uniqueKey}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <ToolCallLoader loadingMessage={`Running ${toolName}...`} />
                    </motion.div>
                  );
                }

                // Only render the final output, skip input-available states in saved messages
                if (state === "output-available") {
                  const { output } = part;

                  // Validate output structure
                  if (!output) {
                    return (
                      <motion.div
                        key={uniqueKey}
                        className="vet-tool-card mt-4 p-4 bg-red-500/10 rounded-xl border border-red-500"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <h3 className="font-semibold mb-2 text-sm text-red-500">
                          Error: No output data for {toolName}
                        </h3>
                      </motion.div>
                    );
                  }

                  // Wrap all tool cards with motion and vet-tool-card styling
                  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
                    <motion.div
                      className="vet-tool-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {children}
                    </motion.div>
                  );

                  // Map tool names to their respective card components
                  switch (toolType) {
                    case "get_balance":
                      return <CardWrapper key={uniqueKey}><BalanceCard result={output} /></CardWrapper>;

                    case "get_token_balance":
                      return <CardWrapper key={uniqueKey}><TokenBalancesCard result={output} /></CardWrapper>;

                    case "get_token_metadata":
                      return <CardWrapper key={uniqueKey}><TokenMetadataCard result={output} /></CardWrapper>;

                    case "get_token_price":
                    case "get_token_price_by_address":
                      return <CardWrapper key={uniqueKey}><TokenPriceCard result={output} /></CardWrapper>;

                    case "get_gas_price":
                      return <CardWrapper key={uniqueKey}><GasPriceCard result={output} /></CardWrapper>;

                    case "get_nfts_owned":
                    case "get_collections_for_owner":
                      return <CardWrapper key={uniqueKey}><NftsOwnedCard result={output} /></CardWrapper>;

                    case "get_transaction_history":
                      return <CardWrapper key={uniqueKey}><TransactionHistoryCard result={output} /></CardWrapper>;

                    case "prepare_eth_transfer":
                      return <CardWrapper key={uniqueKey}><TransferCard result={output} /></CardWrapper>;

                    case "prepare_token_transfer":
                      return <CardWrapper key={uniqueKey}><TokenTransferCard result={output} /></CardWrapper>;

                    case "prepare_token_approval":
                      return <CardWrapper key={uniqueKey}><TokenApprovalCard result={output} /></CardWrapper>;

                    case "prepare_contract_call":
                      return <CardWrapper key={uniqueKey}><ContractCallCard result={output} /></CardWrapper>;

                    default:
                      // Fallback to generic display for unmapped tools
                      return (
                        <motion.div
                          key={uniqueKey}
                          className="vet-tool-card mt-4 p-4 bg-vet-surface/70 backdrop-blur-sm border border-vet-border rounded-xl"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <h3 className="font-semibold mb-2 text-sm text-vet-text-secondary capitalize">
                            {toolName} Result
                          </h3>
                          <pre className="text-xs overflow-auto max-h-96 text-vet-text">
                            {JSON.stringify(output, null, 2)}
                          </pre>
                        </motion.div>
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
      <div className="flex gap-4 w-full">
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-vet-border bg-vet-surface">
          <SparklesIcon size={14} color="#E2008C" />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 vet-chat-ai max-w-[80%] bg-vet-surface border border-vet-border rounded-2xl p-4">
            <span className="text-vet-text-secondary">Thinking</span>
            <div className="vet-loading-dots flex items-center gap-1">
              <motion.div
                className="vet-loading-dot w-1.5 h-1.5 rounded-full bg-white/80"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="vet-loading-dot w-1.5 h-1.5 rounded-full bg-white/80"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="vet-loading-dot w-1.5 h-1.5 rounded-full bg-white/80"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
