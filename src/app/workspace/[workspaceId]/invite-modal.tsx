import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirmModal } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const [confirm, ConfirmDialog] = useConfirmModal(
    "Are you sure?",
    "This action cannot be undone. This will invalidate the current join code."
  );

  const { mutated, isPending } = useNewJoinCode();

  const handleNewCode = async() => {
    const confirmed = await confirm();
    if (!confirmed) return;
    mutated(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success("New join code generated successfully");
        },
        onError: () => {
          toast.error("Failed to generate new join code");
        },
      }
    );
  };

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("Link copied to clipboard");
    });
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a member to {name}</DialogTitle>
            <DialogDescription>
              Share the join code below to invite someone to this workspace.
            </DialogDescription>
          </DialogHeader>
          <div className=" flex flex-col gap-y-4 items-center justify-center py-10">
            <p className=" text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button variant="ghost" size="sm" onClick={handleCopyLink}>
              Copy link
              <CopyIcon className=" size-4 ml-2" />
            </Button>
          </div>
          <div className=" flex items-center justify-between w-full">
            <Button
              variant="outline"
              onClick={handleNewCode}
              disabled={isPending}
            >
              New Code
              <RefreshCcw className=" size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
