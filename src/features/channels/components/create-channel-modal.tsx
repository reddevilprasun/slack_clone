import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";

import { useCreateChannelModel } from "../store/use-create-channel-model";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";


export const CreateChannelModal = () => {
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModel();

  const [channelName, setChannelName] = useState("");
  const { mutated, isPending } = useCreateChannel();

  const handleChannelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setChannelName(value);
  }

  const handleCreateChannel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // create channel
    mutated({ name: channelName, workspaceId }, {
      onSuccess: () => {
        toast.success("Channel created successfully");
        handleClose();
      },
      onError: () => {
        // handle error
        toast.error("Failed to create channel");
      }
    });
  };

  const handleClose = () => {
    setChannelName("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleCreateChannel}>
          <Input
            placeholder="Channel name e.g. plan-budget"
            required
            autoFocus
            onChange={handleChannelNameChange}
            minLength={3}
            maxLength={80}
            disabled={isPending}
            value={channelName}
          />
          <div className=" flex justify-end">
            <Button
              disabled={isPending}
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}