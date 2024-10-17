import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMemberById } from "../api/use-get-member-ById";
import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useDeleteMember } from "../api/use-delete-member";
import { useUpdateMemberRole } from "../api/use-update-member-role";
import { useConfirmModal } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "../api/use-current-member";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfilePanelProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const ProfilePanel = ({ memberId, onClose }: ProfilePanelProps) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });
  const { data: member, isLoading: isMemberLoading } = useGetMemberById({
    id: memberId,
  });

  const { mutated: memberDelete, isPending: isMemberDeleting } =
    useDeleteMember();
  const { mutated: memberUpdate, isPending: isMemberUpdaing } =
    useUpdateMemberRole();

  const disabled = isMemberDeleting || isMemberUpdaing;

  const [removeMember, ConfirmRemoveMemberModel] = useConfirmModal(
    "Are you sure Admin?",
    "You are about to remove this member from the workspace and all the data will be lost. Do you want to continue?"
  );

  const [leaveWorkspace, ConfirmLeaveWorkspaceModel] = useConfirmModal(
    "Are you sure?",
    "You are about to leave this workspace and all the data will be lost. Do you want to continue?"
  );

  const [updateRole, ConfirmUpdateRoleModel] = useConfirmModal(
    "Are you sure Admin?",
    "You are about to update this member role. Do you want to continue?"
  );

  const onRemoveMember = async () => {
    const ok = await removeMember();
    if (!ok) return;

    memberDelete(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("Member Removed successfully");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      }
    );
  };

  const onLeave = async () => {
    const ok = await leaveWorkspace();
    if (!ok) return;

    memberDelete(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("Left Workspace successfully");
          onClose();
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to leave workspace");
        },
      }
    );
  };

  const onMemberRoleUpdate = async (role: "admin" | "member") => {
    const ok = await updateRole();
    if (!ok) return;

    memberUpdate(
      { id: memberId, role },
      {
        onSuccess: () => {
          setTimeout(()=> setOpen(false) , 50);
          toast.success("Member role updated successfully");
        },
        onError: () => {
          toast.error("Failed to update member role");
        },
      }
    );
  };

  if (isMemberLoading || isLoadingCurrentMember) {
    return (
      <div className=" h-full flex flex-col">
        <div className=" flex justify-between items-center px-4 h-[49px] border-b">
          <p className=" text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className=" w-5 h-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className=" flex h-full items-center justify-center">
          <Loader className=" size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className=" h-full flex flex-col">
        <div className=" flex justify-between items-center px-4 h-[49px] border-b">
          <p className=" text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className=" w-5 h-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className=" flex h-full flex-col items-center justify-center">
          <AlertTriangle className=" size-5 text-muted-foreground" />
          <p className=" text-lg text-muted-foreground">profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmRemoveMemberModel />
      <ConfirmLeaveWorkspaceModel />
      <ConfirmUpdateRoleModel />
      <div className=" h-full flex flex-col">
        <div className=" flex justify-between items-center px-4 h-[49px] border-b">
          <p className=" text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className=" w-5 h-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className=" flex p-4 flex-col items-center justify-center">
          <Avatar className=" max-w-[256px] max-h-[256px] size-full">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="max-w-[256px] max-h-[256px] bg-sky-500 text-white text-6xl">
              {member.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className=" flex flex-col p-4">
          <p className=" text-xl font-bold">
            {member.user.name}
            {currentMember?.role === "admin" &&
            currentMember?._id !== memberId ? (
              <div className=" flex items-center gap-2 mt-4">
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className=" w-full capitalize">
                      {member.role}{" "}
                      <ChevronDownIcon className=" w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className=" w-full">
                    <DropdownMenuRadioGroup
                      value={member.role}
                      onValueChange={(role) =>
                        onMemberRoleUpdate(role as "admin" | "member")
                      }
                    >
                      <DropdownMenuRadioItem value="admin">
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="member">
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  className=" w-full "
                  onClick={onRemoveMember}
                  disabled={disabled}
                >
                  Remove
                </Button>
              </div>
            ) : currentMember?.role !== "admin" &&
              currentMember?._id === memberId ? (
              <div className="mt-4">
                <Button
                  variant="outline"
                  className=" w-full"
                  onClick={onLeave}
                  disabled={disabled}
                >
                  Leave Workspace
                </Button>
              </div>
            ) : null}
          </p>
        </div>
        <Separator />
        <div className=" flex flex-col p-4">
          <p className=" text-sm font-bold mb-4">Contact Information</p>
          <div className=" flex items-center gap-2">
            <div className=" size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className=" size-4 " />
            </div>
            <div className=" flex flex-col">
              <p className=" text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className=" text-sm hover:underline text-[#1264a3]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
