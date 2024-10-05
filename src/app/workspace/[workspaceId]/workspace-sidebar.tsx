import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id: workspaceId,
  });
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId: workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className=" flex flex-col items-center justify-center bg-[#5E2C5F] h-full">
        <Loader className=" size-5 animate-spin text-white" />
      </div>
    );
  };

  if (!workspace || !member) {
    return (
      <div className=" flex flex-col gap-y-2 items-center justify-center bg-[#5E2C5F] h-full">
        <AlertTriangle className=" size-5 animate-spin text-white" />
        <p className=" text-white text-sm">
          Workspace not found
        </p>
      </div>
    );
  };

  return (
    <div className=" flex flex-col gap-y-2 bg-[#5E2C5F] h-full">
      <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"}/>
    </div>
  );
};
