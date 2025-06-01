import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export function MessageBubble({ message, className }: MessageBubbleProps) {
  const timeStr = format(new Date(message.timestamp), "h:mm a");

  return (
    <div className={cn("flex justify-end", className)}>
      <div className="max-w-xs">
        <div className="bg-[#D49A6A] text-[#1E1E1E] rounded-2xl rounded-br-md px-4 py-3 relative">
          <p className="text-sm leading-relaxed">{message.content}</p>
          {/* Message tail */}
          <div className="absolute bottom-0 right-[-8px] w-0 h-0 border-l-8 border-l-[#D49A6A] border-b-8 border-b-transparent"></div>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">{timeStr}</p>
      </div>
    </div>
  );
}
