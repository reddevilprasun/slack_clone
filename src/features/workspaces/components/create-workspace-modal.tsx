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
  const { mutated, isPending } = useCreateWorkspace();

  // Handle modal close and reset name field
  const handleClose = () => {
    setName(""); // Reset workspace name
    setOpen(false);
  };

  // Handle form submit and workspace creation
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutated(
      { name },
      {
        onSuccess: (id) => {
          toast.success("Workspace created successfully");
          router.push(`/workspace/${id}`); // Redirect to the new workspace
          handleClose(); // Close the modal before redirecting
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to create workspace");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            disabled={isPending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'My Team', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
