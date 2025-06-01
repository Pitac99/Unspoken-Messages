import { cn } from "@/lib/utils";

interface PinDotsProps {
  length: number;
  filled: number;
  className?: string;
}

export function PinDots({ length, filled, className }: PinDotsProps) {
  return (
    <div className={cn("flex justify-center space-x-4", className)}>
      {Array.from({ length }, (_, index) => (
        <div
          key={index}
          className={cn(
            "w-4 h-4 rounded-full border-2 transition-all duration-200",
            index < filled
              ? "bg-[#D49A6A] border-[#D49A6A]"
              : "border-gray-500"
          )}
        />
      ))}
    </div>
  );
}
