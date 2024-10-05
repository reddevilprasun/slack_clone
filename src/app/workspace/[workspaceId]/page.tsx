"use client";

import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export default function Workspace() {
  const workspaceId = useWorkspaceId();
  const { data, isLoading} = useGetWorkspaceById({ id: workspaceId });
  return (
    <div>
      <h1>Data: {JSON.stringify(data)}</h1>
    </div>
  );
}