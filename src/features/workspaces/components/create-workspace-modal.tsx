import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModel } from "../store/use-create-workspace-model";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useCreateWorkspace } from "@/features/workspaces/api/use-create-workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkspaceModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModel();
  const [name, setName] = useState<string>("");
  const { mutated, data, error, isError, isPending, isSettled, isSuccess } =
    useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutated(
      { name },
      {
        onSuccess: (id) => {
          toast.success("Workspace created successfully");
          router.push(`/workspace/${id}`);
          handleClose();
        },
        onError: (error) => {
          console.error(error);
        },
        onSettled: () => {
          console.log("Settled");
        },
      }
    );
    handleClose();
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className=" space-y-4" onSubmit={handleSubmit}>
          <Input
            disabled={isPending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'My Team', 'Personal', 'Home'"
          />
          <div className=" flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
