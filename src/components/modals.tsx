"use client";

import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { useEffect, useState } from "react";

export const Modals = () => {
  const [ mounted, setMounted] = useState<boolean>(false);

  useEffect(()=> {
    setMounted(true);
  }, [])

  if (!mounted) return null;
  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};
