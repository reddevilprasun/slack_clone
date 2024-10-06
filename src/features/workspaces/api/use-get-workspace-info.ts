import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceInfos {
  id: Id<"workspaces">;
}

export const useGetWorkspaceByIdInfo = ({ id }:UseGetWorkspaceInfos) => {
  const data = useQuery(api.workspaces.getInfoById, { id });
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};
