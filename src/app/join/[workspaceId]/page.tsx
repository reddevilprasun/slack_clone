"use client";

import { Button } from "@/components/ui/button";
import { useGetWorkspaceByIdInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useNewJoin } from "@/features/workspaces/api/use-new-join";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";

export default function Join() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutated, isPending } = useNewJoin();
  const { data, isLoading } = useGetWorkspaceByIdInfo({ id: workspaceId });

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if(isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [ isMember, router, workspaceId ]);

  const handleComplete = (code: string) => {
    mutated({ id: workspaceId, code }, {
      onSuccess: (id) => {
        toast.success("Successfully joined workspace");
        // Redirect to workspace
        router.replace(`/workspace/${id}`)
      },
      onError: () => {
        // Handle error
        toast.error("Failed to join workspace");
      }
    });
  }

  if (isLoading) {
    return (
      <div className=" h-full flex items-center justify-center">
        <Loader className=" size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className=" h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src="/hashicon.png" width={60} height={60} alt="logo" />
      <div className=" flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className=" flex flex-col gap-y-2 items-center justify-center">
          <h1 className=" text-2xl font-bold">Join {data?.name}</h1>
          <p className=" text-md text-muted-foreground">
            Enter the code provided by the workspace admin
          </p>
        </div>
        <VerificationInput
          length={6}
          autoFocus
          classNames={{
            container: cn("flex gap-x-2", isPending && "opacity-50 cursor-not-allowed"),
            character:
              " uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          onComplete={handleComplete}
        />
      </div>
      <div className=" flex gap-x-4">
        <Button variant="outline" size="lg" asChild>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
