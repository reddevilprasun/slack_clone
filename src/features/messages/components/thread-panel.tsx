import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useGetMessageById } from "../api/use-get-message";
import { Message } from "@/components/message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useGenerateUploadURL } from "@/features/upload/api/use-generate-upload-url";
import { useCreateMessage } from "../api/use-create-message";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useGetMessages } from "../api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

interface ThreadPanelProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image?: Id<"_storage">;
};

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

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export const ThreadPanel = ({ messageId, onClose }: ThreadPanelProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>();
  const [editorKey, setEditorKey] = useState(0);
  const [pending, setPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { mutated: createMessage } = useCreateMessage();
  const { mutated: generateUploadUrl } = useGenerateUploadURL();

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: loadingMessage } = useGetMessageById({
    messageId,
  });
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
        parentMessageId: messageId,
      };

      if (image) {
        const uploadUrl = await generateUploadUrl({}, { throwError: true });

        if (!uploadUrl) {
          throw new Error("Failed to generate upload url");
        }

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await response.json();

        values.image = storageId;
      }

      await createMessage(values, {
        throwError: true,
      });
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setPending(false);
      editorRef.current?.enable(true);
    }
  };

  const groupByDateMessages = results?.reduce(
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
    {} as Record<string, typeof results>
  );

  if (loadingMessage || status === "LoadingFirstPage") {
    return (
      <div className=" h-full flex flex-col">
        <div className=" flex justify-between items-center px-4 h-[49px] border-b">
          <p className=" text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className=" w-5 h-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className=" flex h-full items-center justify-center">
          <Loader className=" size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className=" h-full flex flex-col">
        <div className=" flex justify-between items-center px-4 h-[49px] border-b">
          <p className=" text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className=" w-5 h-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className=" flex h-full items-center justify-center">
          <AlertTriangle className=" size-5 text-muted-foreground" />
          <p className=" text-lg text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" h-full flex flex-col">
      <div className=" flex justify-between items-center px-4 h-[49px] border-b">
        <p className=" text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className=" w-5 h-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className=" flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(groupByDateMessages || {}).map(
          ([dateKey, messages]) => (
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
                      message.user._id === currentMember?.userId
                        ? "You"
                        : message.user.name
                    }
                    isAuthor={message.memberId === currentMember?._id}
                    reactions={message.reactions}
                    body={message.body}
                    image={message.image}
                    updatedAt={message.updatedAt}
                    createdAt={message._creationTime}
                    isEditing={editingId === message._id}
                    setEditingId={setEditingId}
                    isCompact={isCompact}
                    hideThreadButton
                    threadCount={message.threadCount}
                    threadImage={message.threadImage}
                    threadTimestamp={message.threadTimeStamp}
                  />
                ) : null;
              })}
            </div>
          )
        )}

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
              <Loader className=" size-4 animate-spin" />
            </span>
          </div>
        )}

        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={
            message.memberId === currentMember?._id ? "You" : message.user.name
          }
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>
      <div className=" px-4">
        <Editor
          onSubmitted={handleSubmit}
          disabled={pending}
          placeholder="Reply to this message..."
          key={editorKey}
          innerRef={editorRef}
        />
      </div>
    </div>
  );
};
