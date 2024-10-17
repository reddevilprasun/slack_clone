import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDeleteMessage } from "@/features/messages/api/use-delete-message";
import { useConfirmModal } from "@/hooks/use-confirm";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reactions";
import { Reactions } from "./reactions";
import { usePanel } from "@/hooks/use-pannel";
import { ThreadBar } from "./thread-bar";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
const RenderMessage = dynamic(() => import("@/components/render-message"), {
  ssr: false,
});

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorName?: string;
  authorImage?: string;
  isAuthor?: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
  threadTimestamp?: number;
}

const formatFullDate = (dateStr: number) => {
  const date = new Date(dateStr);
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "HH:mm")}`;
};

export const Message = ({
  id,
  memberId,
  authorName = "Member",
  authorImage,
  isAuthor = false,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
  threadName,
}: MessageProps) => {
  const { mutated: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutated: deleteMessage, isPending: isDeletingMessage } =
    useDeleteMessage();
  const { mutated: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const [confirm, ConfirmModel] = useConfirmModal(
    "Delete message",
    "Are you sure you want to delete this message?"
  );

  const { onClose, onOpenMessage, parentMessageId, onOpenProfile } = usePanel();

  const isPending =
    isUpdatingMessage || isDeletingMessage || isTogglingReaction;

  const handleUpdateMessage = ({ body }: { body: string }) => {
    updateMessage(
      { body, messageId: id },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const handleDeleteMessage = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteMessage(
      { messageId: id },
      {
        onSuccess: () => {
          toast.success("Message deleted");
          if (parentMessageId === id) {
            onClose();
          }
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  const handleToggleReaction = (type: string) => {
    toggleReaction(
      { messageId: id, type },
      {
        onError: () => {
          toast.error("Failed to add reaction");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmModel />
        <div
          className={cn(
            " flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && " bg-[#f2c74433] hover:bg-[#f2c74433]",
            isDeletingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className=" flex items-start gap-2">
            <Hint hint={formatFullDate(createdAt)}>
              <button className=" text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] hover:underline">
                {format(new Date(createdAt), "HH:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className=" w-full h-full">
                <Editor
                  defaultValue={JSON.parse(body)}
                  onSubmitted={handleUpdateMessage}
                  onCancel={() => setEditingId(null)}
                  disabled={isPending}
                  variant="update"
                />
              </div>
            ) : (
              <div className=" flex flex-col w-full">
                <RenderMessage value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className=" text-xs text-muted-foreground">
                    (Edited) {formatFullDate(updatedAt)}
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={handleToggleReaction} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  name={threadName}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleDelete={handleDeleteMessage}
              handleThread={() => onOpenMessage(id)}
              handleReaction={handleToggleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }
  return (
    <>
      <ConfirmModel />
      <div
        className={cn(
          " flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && " bg-[#f2c74433] hover:bg-[#f2c74433]",
          isDeletingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className=" flex items-start gap-2">
          <button onClick={() => onOpenProfile(memberId)}>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback className=" bg-sky-500 text-white text-sm">
                {authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className=" w-full h-full">
              <Editor
                defaultValue={JSON.parse(body)}
                onSubmitted={handleUpdateMessage}
                onCancel={() => setEditingId(null)}
                disabled={isPending}
                variant="update"
              />
            </div>
          ) : (
            <div className=" flex flex-col w-full overflow-hidden">
              <div className=" text-sm">
                <button
                  onClick={() => onOpenProfile(memberId)}
                  className=" font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint hint={formatFullDate(createdAt)}>
                  <button className=" text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "HH:mm")}
                  </button>
                </Hint>
              </div>
              <RenderMessage value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className=" text-xs text-muted-foreground">
                  (Edited) {formatFullDate(updatedAt)}
                </span>
              ) : null}
              <Reactions data={reactions} onChange={handleToggleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
                name={threadName}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleDelete={handleDeleteMessage}
            handleThread={() => onOpenMessage(id)}
            handleReaction={handleToggleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
