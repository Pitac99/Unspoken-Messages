import { Button } from "@/components/ui/button";
import { Fingerprint, Delete } from "lucide-react";
import { cn } from "@/lib/utils";

interface KeypadProps {
  onNumberPress: (number: string) => void;
  onDelete: () => void;
  onBiometric?: () => void;
  showBiometric?: boolean;
  className?: string;
}

export function Keypad({
  onNumberPress,
  onDelete,
  onBiometric,
  showBiometric = true,
  className,
}: KeypadProps) {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-4 max-w-xs mx-auto", className)}>
      {numbers.map((row, rowIndex) =>
        row.map((number) => (
          <Button
            key={number}
            variant="ghost"
            className="w-16 h-16 rounded-full bg-[#2D2D2D] hover:bg-[#383838] text-xl font-medium transition-all duration-200 transform active:scale-95"
            onClick={() => onNumberPress(number)}
          >
            {number}
          </Button>
        ))
      )}
      
      {/* Bottom row */}
      <Button
        variant="ghost"
        className={cn(
          "w-16 h-16 rounded-full bg-[#2D2D2D] hover:bg-[#383838] transition-all duration-200 transform active:scale-95",
          showBiometric ? "text-[#D49A6A]" : "invisible"
        )}
        onClick={onBiometric}
        disabled={!showBiometric}
      >
        <Fingerprint className="w-6 h-6" />
      </Button>
      
      <Button
        variant="ghost"
        className="w-16 h-16 rounded-full bg-[#2D2D2D] hover:bg-[#383838] text-xl font-medium transition-all duration-200 transform active:scale-95"
        onClick={() => onNumberPress("0")}
      >
        0
      </Button>
      
      <Button
        variant="ghost"
        className="w-16 h-16 rounded-full bg-[#2D2D2D] hover:bg-[#383838] text-gray-400 transition-all duration-200 transform active:scale-95"
        onClick={onDelete}
      >
        <Delete className="w-5 h-5" />
      </Button>
    </div>
  );
}
