"use client";

import { useGetChannelById } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { ChannelHeader } from "./channel-header";
import { ChatInput } from "./chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { MessageList } from "@/components/message-list";

export default function ChannelPage() {
  const channelId = useChannelId();

  const { data: channel, isLoading: channelLoading } = useGetChannelById({
    id: channelId,
  });

  const { results,status, loadMore } = useGetMessages({ channelId })

  console.log(results);

  if(channelLoading || status === "LoadingFirstPage") {
    return (
      <div className=" flex h-full items-center justify-center flex-1">
        <Loader className=" size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if(!channel) {
    return (
      <div className=" flex h-full items-center justify-center flex-1 flex-col gap-y-2">
        <TriangleAlert className=" size-6 text-muted-foreground" />
        <p className=" text-sm text-muted-foreground">Channel not found</p>
      </div>
    )
  }

  return (
    <div className=" flex flex-col h-full">
      <ChannelHeader channelName={channel.name}/>
      <MessageList
        channelName={channel.name}
        channelCreatedAt={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message # ${channel.name}`}/>
    </div>
  );
}
