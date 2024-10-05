"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../api/use-current-user";
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

export const UserButton = () => {
  const router = useRouter();
  const { data, isLoading} = useCurrentUser();
  const { signOut } = useAuthActions();

  if(isLoading) {
    return <Loader className=" animate-spin size-4 text-muted-foreground"/>
  }

  if(!data) {
    return null;
  }

  return (
    <DropdownMenu modal={isLoading}>
      <DropdownMenuTrigger className=" outline-none relative">
        <Avatar className=" size-10 hover:opacity-75 transition">
          <AvatarImage
            src={data.image}
            alt={data.name}
          />
          <AvatarFallback className=" bg-sky-500 text-white">
            {data.name!.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={() => signOut().then(() => router.push("/auth"))} className="h-10 cursor-pointer">
          <LogOut className=" size-4 mr-2"/>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}