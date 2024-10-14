import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useState } from "react";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: any) => void;
}

export const EmojiPopover = ({
  children,
  hint = "Emoji",
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);

  const onSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setPopoverVisible(false);
    setTimeout(() => {
      setTooltipVisible(false);
    }, 500);
  }

  return (
    <TooltipProvider>
      <Popover open={popoverVisible} onOpenChange={setPopoverVisible}>
        <Tooltip
          open={tooltipVisible}
          onOpenChange={setTooltipVisible}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className=" bg-black text-white border-white/5">
            <p className=" font-medium text-xs">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className=" p-0 w-full border-none shadow-none">
          <Picker
            data={data}
            onEmojiSelect={onSelect}
          ></Picker>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
