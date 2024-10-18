"use client";

import { useCreateWorkspaceModel } from "@/features/workspaces/store/use-create-workspace-model";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const { data, isLoading } = useGetWorkspaces();
  const [open, setOpen] = useCreateWorkspaceModel();

  const workspaceID = useMemo(() => data?.at(0)?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceID) {
      router.replace(`/workspace/${workspaceID}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceID, isLoading, open, setOpen, router]);

  return (
    <div className=" flex flex-col items-center justify-center bg-[#5E2C5F] h-full">
      <Loader className=" size-5 animate-spin text-white" />
    </div>
  );
}
