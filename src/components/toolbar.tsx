import { MessageSquareTextIcon, Pencil, SmileIcon, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
}: ToolbarProps) => {
  return (
    <div className=" absolute top-0 right-5">
      <div className="opacity-0 group-hover:opacity-100 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="React to message"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <SmileIcon className=" size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint hint="Reply to message">
            <Button variant="ghost" size="iconSm" disabled={isPending}>
              <MessageSquareTextIcon className=" size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint hint="Edit message">
              <Button variant="ghost" size="iconSm" disabled={isPending}>
                <Pencil className=" size-4" />
              </Button>
            </Hint>
            <Hint hint="Delete message">
              <Button variant="ghost" size="iconSm" disabled={isPending}>
                <Trash className=" size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};
