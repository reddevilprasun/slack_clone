import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadURL } from "@/features/upload/api/use-generate-upload-url";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder?: string;
  conversationId: Id<"conversations">;
}

type CreateMessageValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage">;
};

export const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [pending, setPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);
  const workspaceId = useWorkspaceId();

  const { mutated: createMessage } = useCreateMessage();
  const { mutated: generateUploadUrl } = useGenerateUploadURL();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        conversationId,
        body,
        workspaceId,
        image: undefined,
      };

      if (image) {
        const uploadUrl = await generateUploadUrl({}, { throwError: true });

        if (!uploadUrl) {
          throw new Error("Failed to generate upload url");
        }

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await response.json();

        values.image = storageId;
      }

      await createMessage(values, {
        throwError: true,
      });
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setPending(false);
      editorRef.current?.enable(true);
    }
  };

  return (
    <div className=" px-5 w-full">
      <Editor
        variant="create"
        placeholder={placeholder}
        onSubmitted={handleSubmit}
        disabled={pending}
        innerRef={editorRef}
        key={editorKey}
      />
    </div>
  );
};
