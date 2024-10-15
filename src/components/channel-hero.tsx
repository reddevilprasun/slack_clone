import { format } from "date-fns";

interface ChannelHeroProps {
  title: string;
  channelCreatedAt: number;
}

export const ChannelHero = ({ title, channelCreatedAt }: ChannelHeroProps) => {
  return (
    <div className=" mt-[88px] mx-5 mb-4">
      <p className=" text-2xl font-bold flex items-center mb-2"># {title}</p>
      <p className=" font-normal text-slate-800 mb-4">
        This channel was created on {format(channelCreatedAt, "MMMM do, yyyy")}.
        This is the very beginning of the <strong>{title}</strong> channel.
      </p>
    </div>
  );
};
