import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMemberById } from "@/features/members/api/use-get-member-ById";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import { ConversationHeader } from "./header";
import { ChatInput } from "./chat-input";
import { MessageList } from "@/components/message-list";

interface ConversationProps {
  conversationId: Id<"conversations">;
}

export const Conversation = ({ conversationId }: ConversationProps) => {
  const memberId = useMemberId();

  const { data: member, isLoading: isMemberLoading } = useGetMemberById({
    id: memberId,
  });

  const { results, status, loadMore } = useGetMessages({ conversationId });

  if (isMemberLoading || status === "LoadingFirstPage") {
    return (
      <div className=" flex h-full items-center justify-center flex-1">
        <Loader className=" size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }


  return (
    <div className=" flex flex-col h-full">
      <ConversationHeader
        memberImage={member?.user.image}
        memberName={member?.user.name}
        onClick={() => {}}
      />
      <MessageList
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
        variant="conversation"
        memberImage={member?.user.image}
        memberName={member?.user.name}
      />
      <ChatInput placeholder={`Message # ${member?.user.name}`} conversationId={conversationId}/>
    </div>
  );
};
