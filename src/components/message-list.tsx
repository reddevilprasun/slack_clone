import { GetMessagesResponse } from "@/features/messages/api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Message } from "./message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { ChannelHero } from "./channel-hero";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { Loader } from "lucide-react";
import { ConversationHero } from "./conversation-hero";
interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreatedAt?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesResponse | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const TIME_THRESHOLD = 5;

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);

  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "EEEE, MMMM d");
};

export const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreatedAt,
  variant = "channel",
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const workspaceId = useWorkspaceId();
  const currentMember = useCurrentMember({ workspaceId });

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const groupByDateMessages = data?.reduce(
    (acc, message) => {
      if (message) {
        const date = new Date(message._creationTime);
        const dateKey = format(date, "yyyy-MM-dd");

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }

        acc[dateKey].unshift(message);
      }
      return acc;
    },
    {} as Record<string, typeof data>
  );

  return (
    <div className=" flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupByDateMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className=" text-center my-2 relative">
            <hr className=" absolute top-1/2 left-0 right-0 border-b border-gray-300" />
            <span className=" relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const previousMessage = messages[index - 1];
            const isCompact =
              previousMessage &&
              previousMessage?.user?._id === message?.user?._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(previousMessage._creationTime)
              ) < TIME_THRESHOLD
                ? true
                : undefined;

            return message ? (
              <Message
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={
                  message.user._id === currentMember.data?.userId
                    ? "You"
                    : message.user.name
                }
                isAuthor={message.memberId === currentMember.data?._id}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === "thread"}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadTimeStamp}
                threadName={message.threadName}
              />
            ) : null;
          })}
        </div>
      ))}

      <div 
        className="h-1"
        ref={(el) => {
          if (!el || !canLoadMore) return;
          const observer = new IntersectionObserver(
            ([entries]) => {
              if (entries.isIntersecting && canLoadMore) {
                loadMore();
              }
            },
            { threshold: 1.0 }
          );
          observer.observe(el);
          return () => observer.disconnect();
        }}
      />

      {isLoadingMore && (
        <div className=" text-center my-2 relative">
          <hr className=" absolute top-1/2 left-0 right-0 border-b border-gray-300" />
          <span className=" relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
            <Loader className=" size-4 animate-spin"/>
          </span>
        </div>
      )}

      {variant === "channel" && channelName && channelCreatedAt && (
        <ChannelHero title={channelName} channelCreatedAt={channelCreatedAt} />
      )}

      {variant === "conversation" && (
        <ConversationHero
          title={memberName}
          image={memberImage}
        />
      )}
    </div>
  );
};
