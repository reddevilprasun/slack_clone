import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ConversationHeroProps {
  title?: string;
  image?: string;
}

export const ConversationHero = ({ title = "Member", image }: ConversationHeroProps) => {
  return (
    <div className=" mt-[88px] mx-5 mb-4">
      <div className=" flex items-center gap-x-1 mb-2">
        <Avatar className=" size-14 mr-2">
          <AvatarImage src={image} />
          <AvatarFallback className=" bg-sky-500 text-white text-sm">
            {title?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p className=" text-2xl font-bold"># {title}</p>
      </div>
      <p className=" font-normal text-slate-800 mb-4">
        This conversation is just between you and <strong>{title}</strong>
      </p>
    </div>
  );
};
