"use client";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModel } from "@/features/channels/store/use-create-channel-model";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Workspace() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModel();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      memberLoading ||
      !workspace ||
      !member
    )
      return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    workspaceLoading,
    channelsLoading,
    workspace,
    router,
    workspaceId,
    setOpen,
    open,
    memberLoading,
    member,
    isAdmin,
  ]);

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className=" h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className=" size-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className=" h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className=" size-6 text-muted-foreground" />
        <span className=" text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className=" h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className=" size-6 text-muted-foreground" />
      <span className=" text-sm text-muted-foreground">No channel found</span>
    </div>
  );
}
