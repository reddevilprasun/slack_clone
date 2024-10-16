import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMessageProps {
  messageId: Id<"messages">;
}

export const useGetMessageById = ({ messageId }: UseGetMessageProps) => {
  const data = useQuery(api.messages.getById, { messageId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
