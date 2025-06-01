import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Keypad } from "@/components/keypad";
import { PinDots } from "@/components/pin-dots";
import { auth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function PinSetupPage() {
  const [, setLocation] = useLocation();
  const [pin, setPin] = useState("");
  const [confirmedPin, setConfirmedPin] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [status, setStatus] = useState("Enter your PIN");
  const { toast } = useToast();

  const handleNumberPress = (number: string) => {
    if (pin.length < 4) {
      const newPin = pin + number;
      setPin(newPin);

      if (newPin.length === 4) {
        if (!isConfirming) {
          // First PIN entry
          setConfirmedPin(newPin);
          setPin("");
          setIsConfirming(true);
          setStatus("Confirm your PIN");
        } else {
          // Confirmation
          if (newPin === confirmedPin) {
            try {
              auth.setPin(newPin);
              setStatus("PIN set successfully!");
              toast({
                title: "PIN Setup Complete",
                description: "Your PIN has been set successfully.",
              });
              setTimeout(() => setLocation("/home"), 1000);
            } catch (error) {
              setStatus("Failed to save PIN. Try again.");
              resetPin();
            }
          } else {
            setStatus("PINs do not match. Try again.");
            resetPin();
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const resetPin = () => {
    setPin("");
    setConfirmedPin("");
    setIsConfirming(false);
    setStatus("Enter your PIN");
  };

  const handleBiometric = () => {
    setBiometricEnabled(!biometricEnabled);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1E1E1E] p-6">
      {/* Header */}
      <div className="text-center mb-12 pt-8">
        <h2 className="text-2xl font-semibold mb-2 text-[#F5F5F5]">
          Create Your PIN
        </h2>
        <p className="text-gray-300">Choose a 4-digit PIN to secure your thoughts</p>
      </div>

      {/* PIN Display */}
      <div className="text-center mb-12">
        <PinDots length={4} filled={pin.length} className="mb-6" />
        <p className="text-sm text-gray-400">{status}</p>
      </div>

      {/* Custom Keypad */}
      <div className="flex-1 flex flex-col justify-center">
        <Keypad
          onNumberPress={handleNumberPress}
          onDelete={handleDelete}
          onBiometric={handleBiometric}
          showBiometric={true}
        />
      </div>

      {/* Biometric Option */}
      <div className="pt-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3">
            <Switch
              checked={biometricEnabled}
              onCheckedChange={setBiometricEnabled}
              className="data-[state=checked]:bg-[#D49A6A]"
            />
            <span className="text-sm text-gray-300">
              Enable biometric authentication
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
