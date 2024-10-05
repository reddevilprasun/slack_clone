"use client";
import { Sidebar } from "./sidebar";
import { ToolBar } from "./toolbar";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}
export default function WorkspaceIdLayout({
  children,
}: WorkspaceIdLayoutProps) {
  return (
    <div className=" h-full">
      <ToolBar />
      <div className=" flex h-[calc(100vh-40px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
