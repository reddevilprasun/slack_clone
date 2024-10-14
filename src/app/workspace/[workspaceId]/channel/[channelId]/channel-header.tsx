import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useDeleteChannel } from "@/features/channels/api/use-remove-channel";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useConfirmModal } from "@/hooks/use-confirm";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface ChannelHeaderProps {
  channelName: string;
}

export const ChannelHeader = ({ channelName }: ChannelHeaderProps) => {
  const router = useRouter();

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [value, setValue] = useState(channelName);
  const [editOpen, setEditOpen] = useState(false);

  const [confirm, ConfirmDialog] = useConfirmModal(
    "Delete this channel?",
    "Are you sure you want to delete this channel? This action cannot be undone."
  );

  const { mutated: updateChannel, isPending: updateChannelPending } =
    useUpdateChannel();
  const { mutated: deleteChannel, isPending: deleteChannelPending } =
    useDeleteChannel();
  const { data:member, isLoading:memberLoading } = useCurrentMember({
    workspaceId
  });

  const handleChannelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success("Channel name updated successfully");
          setValue("");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel name");
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted successfully");
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <div className=" bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className=" text-lg font-semibold px-2 overflow-hidden w-auto"
              size="sm"
            >
              <span className=" truncate"># {channelName}</span>
              <FaChevronDown className=" size-2.5 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className=" p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className=" p-4 border-b bg-white">
              <DialogTitle># {channelName}</DialogTitle>
            </DialogHeader>
            <div className=" px-4 pb-4 flex flex-col gap-y-2">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <div className=" px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className=" flex items-center justify-between">
                      <p className=" text-sm font-semibold">Channel name</p>
                      <p className=" text-sm text-[#1264a3] hover:underline font-semibold">
                        Edit
                      </p>
                    </div>
                    <p className=" text-sm text-muted-foreground">
                      # {channelName}
                    </p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this workspace</DialogTitle>
                  </DialogHeader>
                  <form className=" space-y-4" onSubmit={handleEdit}>
                    <Input
                      value={value}
                      disabled={updateChannelPending}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      onChange={handleChannelNameChange}
                      placeholder="Channel name e.g. plan-budget"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          disabled={updateChannelPending || memberLoading}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={updateChannelPending || member?.role === "member"}>
                        {member?.role === "member" ? "Only admins can edit" : "Save"} 
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <button
                className=" flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 text-rose-600"
                onClick={handleDelete}
                disabled={deleteChannelPending || member?.role === "member"}
              >
                <TrashIcon className=" size-5" />
                <span className=" text-sm font-semibold">
                  {member?.role === "member" ? "Only admins can delete" : "Delete channel"}
                </span>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
