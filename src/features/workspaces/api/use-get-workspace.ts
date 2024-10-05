import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaces {
  id: Id<"workspaces">;
}

export const useGetWorkspaceById = ({ id }:UseGetWorkspaces) => {
  const data = useQuery(api.workspaces.getById, { id });
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};
