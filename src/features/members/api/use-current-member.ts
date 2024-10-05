import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface CurrentMember {
  workspaceId: Id<"workspaces">;
}
export const useCurrentMember = ({ workspaceId }: CurrentMember) => {
  const data = useQuery(api.members.current, {
    workspaceId,
  });
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};
