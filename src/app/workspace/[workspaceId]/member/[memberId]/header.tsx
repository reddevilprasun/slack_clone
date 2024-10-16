import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { FaChevronDown } from "react-icons/fa";

interface ChannelHeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const ConversationHeader = ({ 
  memberImage,
  memberName,
  onClick,
 }: ChannelHeaderProps) => {
  

  return (
    <>
      <div className=" bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Button
          variant="ghost"
          className="text-lg font-semibold px-2 overflow-hidden w-auto"
          size="sm"
          onClick={onClick}
        >
          <Avatar className=" size-6 mr-2">
            <AvatarImage src={memberImage}/>
            <AvatarFallback  className=" bg-sky-500 text-white text-sm">{memberName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="">
            {memberName}
          </span>
          <FaChevronDown className="size-2.5 ml-2" />
        </Button>
      </div>
    </>
  );
};
