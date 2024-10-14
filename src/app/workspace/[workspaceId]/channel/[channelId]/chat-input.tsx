import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic"
import Quill from "quill";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

interface ChatInputProps {
  placeholder?: string;
}

export const ChatInput = ({
  placeholder
}: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<Quill | null>(null);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { mutated:createMessage } = useCreateMessage();

  const handleSubmit = ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    createMessage({
      body,
      workspaceId,
      channelId,
    }, {
      onSuccess: () => {
      },
      onError: (error) => {
        console.error(error);
      }
    });
    setEditorKey((prevKey) => prevKey + 1);
  }

  return (
    <div className=" px-5 w-full">
      <Editor 
      variant="create"
      placeholder={placeholder}
      onSubmitted={handleSubmit}
      disabled={false}
      innerRef={editorRef}
      key={editorKey}
      />
    </div>
  )
}