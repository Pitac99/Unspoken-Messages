import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import type { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  className?: string;
  onEdit?: (messageId: string, newContent: string) => void;
  isEditMode?: boolean;
}

export function MessageBubble({ message, className, onEdit, isEditMode = true }: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const timeStr = format(new Date(message.timestamp), "h:mm a");

  const handleSave = () => {
    if (editContent.trim() && onEdit) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleClick = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div className={cn("flex justify-end", className)}>
      <div className="max-w-xs">
        {isEditing ? (
          <div className="bg-[#2D2D2D] border border-[#383838] rounded-2xl rounded-br-md px-4 py-3 relative">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-transparent border-none text-[#F5F5F5] text-sm resize-none focus:ring-0 focus:outline-none p-0 min-h-[20px]"
              rows={1}
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-[#D49A6A] hover:bg-amber-600 text-[#1E1E1E] h-7 px-2"
              >
                <Check className="w-3 h-3" />
              </Button>
              <Button
                onClick={handleCancel}
                size="sm"
                variant="outline"
                className="border-[#383838] text-[#F5F5F5] hover:bg-[#383838] h-7 px-2"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            {/* Message tail */}
            <div className="absolute bottom-0 right-[-8px] w-0 h-0 border-l-8 border-l-[#2D2D2D] border-b-8 border-b-transparent"></div>
          </div>
        ) : (
          <div 
            className={cn(
              "bg-[#D49A6A] text-[#1E1E1E] rounded-2xl rounded-br-md px-4 py-3 relative",
              isEditMode && "cursor-pointer hover:bg-amber-600 transition-colors"
            )}
            onClick={handleClick}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
            <p className="text-xs text-[#8B5A2B] mt-2 italic">
              (This message was released. It was not sent.)
            </p>
            {/* Message tail */}
            <div className="absolute bottom-0 right-[-8px] w-0 h-0 border-l-8 border-l-[#D49A6A] border-b-8 border-b-transparent"></div>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1 text-right">{timeStr}</p>
      </div>
    </div>
  );
}
