"use client";

import { useGetChannelById } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { ChannelHeader } from "./channel-header";
import { ChatInput } from "./chat-input";

export default function ChannelPage() {
  const channelId = useChannelId();

  const { data: channel, isLoading: channelLoading } = useGetChannelById({
    id: channelId,
  });

  if(channelLoading) {
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
      <div className=" flex-1"/>
      <ChatInput placeholder={`Message # ${channel.name}`}/>
    </div>
  );
}
