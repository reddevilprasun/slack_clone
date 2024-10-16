"use client";

import { useCreateOrGetConversations } from "@/features/conversations/api/use-create-or-get-conversations";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Conversation } from "./conversation";

export default function MemberPage() {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const [conversationId , setConversationId] = useState<Id<"conversations"> | null>(null)

  const { mutated , isPending } = useCreateOrGetConversations()

  useEffect(() => {
    mutated({
      workspaceId,
      memberId
    }, {
      onSuccess: (data) => {
        setConversationId(data)
      },
      onError: () => {
        toast.error("Failed to get conversation")
      }
    })
  }, [ memberId, workspaceId, mutated ])

  if (isPending) {
    return (
      <div className=" flex h-full items-center justify-center flex-1">
        <Loader className=" size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if(!conversationId) {
    return (
      <div className=" flex h-full items-center justify-center flex-1 flex-col gap-y-2">
        <TriangleAlert className=" size-6 text-muted-foreground" />
        <p className=" text-sm text-muted-foreground">Conversations not found</p>
      </div>
    )
  }

  return (
    <Conversation conversationId={conversationId} />
  )
}