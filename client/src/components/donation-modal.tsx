import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageCount: number;
}

export function DonationModal({ isOpen, onClose, messageCount }: DonationModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to create slide-down animation
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleDonate = () => {
    window.open("https://buymeacoffee.com/unspokendonations", "_blank");
    onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div 
        className={`transform transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="bg-gradient-to-r from-[#D49A6A] to-amber-600 text-[#1E1E1E] px-6 py-4 mx-4 mt-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <Heart className="w-6 h-6 text-red-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-base">
                  Unspoken helped you?
                </h3>
                <p className="text-sm opacity-90 mt-1">
                  If this space brought you peace or clarity, consider supporting us.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Button
                onClick={handleDonate}
                size="sm"
                className="bg-[#1E1E1E] hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium"
              >
                Support Unspoken
              </Button>
              <Button
                onClick={handleClose}
                size="sm"
                variant="ghost"
                className="text-[#1E1E1E] hover:bg-black/10 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}