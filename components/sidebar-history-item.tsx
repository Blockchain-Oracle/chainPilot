import type { Chat } from '@/lib/db/schema';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  CheckCircleFillIcon,
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
  ShareIcon,
  TrashIcon,
} from './icons';
import { memo } from 'react';
import { useChatVisibility } from '@/hooks/use-chat-visibility';

const PureChatItem = ({
  chat,
  isActive,
  onDelete,
  setOpenMobile,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
}) => {
  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId: chat.id,
    initialVisibilityType: chat.visibility,
  });

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} className={`
        transition-all duration-200
        ${isActive
          ? 'bg-vet-accent/10 text-vet-accent border-l-2 border-vet-accent hover:bg-vet-accent/15'
          : 'text-vet-text-secondary hover:bg-vet-hover hover:text-vet-text-primary'
        }
      `}>
        <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
          <span className="truncate">{chat.title}</span>
        </Link>
      </SidebarMenuButton>

      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            className={`
              transition-all duration-200 mr-0.5
              data-[state=open]:bg-vet-hover data-[state=open]:text-vet-accent
              ${isActive ? 'text-vet-accent' : 'text-vet-text-muted hover:text-vet-text-secondary'}
            `}
            showOnHover={!isActive}
          >
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end" className="bg-vet-surface border-vet-border">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer text-vet-text-secondary hover:bg-vet-hover hover:text-vet-text-primary transition-colors">
              <ShareIcon />
              <span>Share</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-vet-surface border-vet-border">
                <DropdownMenuItem
                  className="cursor-pointer flex-row justify-between text-vet-text-secondary hover:bg-vet-hover hover:text-vet-text-primary transition-colors"
                  onClick={() => {
                    setVisibilityType('private');
                  }}
                >
                  <div className="flex flex-row gap-2 items-center">
                    <LockIcon size={12} />
                    <span>Private</span>
                  </div>
                  {visibilityType === 'private' ? (
                    <div className="text-vet-accent">
                      <CheckCircleFillIcon />
                    </div>
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer flex-row justify-between text-vet-text-secondary hover:bg-vet-hover hover:text-vet-text-primary transition-colors"
                  onClick={() => {
                    setVisibilityType('public');
                  }}
                >
                  <div className="flex flex-row gap-2 items-center">
                    <GlobeIcon />
                    <span>Public</span>
                  </div>
                  {visibilityType === 'public' ? (
                    <div className="text-vet-accent">
                      <CheckCircleFillIcon />
                    </div>
                  ) : null}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem
            className="cursor-pointer text-vet-error hover:bg-vet-error/15 focus:bg-vet-error/15 focus:text-vet-error transition-colors"
            onSelect={() => onDelete(chat.id)}
          >
            <TrashIcon />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  return true;
});
