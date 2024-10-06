import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sideBarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarItemProps {
  label: string;
  icon: LucideIcon | IconType;
  id: string;
  variant?: VariantProps<typeof sideBarItemVariants>["variant"];
}
export const SidebarItem = ({
  label,
  icon: Icon,
  id,
  variant,
}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      variant="transparent"
      size="sm"
      asChild
      className={cn(sideBarItemVariants({ variant: variant }))}
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className=" size-3.5 mr-1 shrink-0"/>
        <span className=" text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};  
