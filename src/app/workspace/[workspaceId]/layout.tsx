"use client";
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
      {children}
    </div>
  );
}
