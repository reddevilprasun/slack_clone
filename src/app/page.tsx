"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { useCreateWorkspaceModel } from "@/features/workspaces/store/use-create-workspace-model";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

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
    <div>
      <UserButton />
    </div>
  );
}
