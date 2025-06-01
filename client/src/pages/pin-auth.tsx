import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Keypad } from "@/components/keypad";
import { PinDots } from "@/components/pin-dots";
import { Lock } from "lucide-react";
import { auth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function PinAuthPage() {
  const [, setLocation] = useLocation();
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState("Enter PIN");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already authenticated
    if (auth.isAuthenticated()) {
      setLocation("/home");
    }
  }, [setLocation]);

  const handleNumberPress = (number: string) => {
    if (pin.length < 4 && !isLoading) {
      const newPin = pin + number;
      setPin(newPin);

      if (newPin.length === 4) {
        validatePin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isLoading) {
      setPin(pin.slice(0, -1));
      setStatus("Enter PIN");
    }
  };

  const validatePin = async (pinToValidate: string) => {
    setIsLoading(true);
    setStatus("Verifying...");

    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isValid = auth.authenticate(pinToValidate);
      
      if (isValid) {
        setStatus("Access granted");
        setTimeout(() => setLocation("/home"), 500);
      } else {
        setStatus("Incorrect PIN");
        setPin("");
        toast({
          title: "Authentication Failed",
          description: "Please check your PIN and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setStatus("Authentication error");
      setPin("");
      toast({
        title: "Error",
        description: "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometric = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setStatus("Authenticating...");

    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus("Access granted");
      setTimeout(() => setLocation("/home"), 500);
    } catch (error) {
      setStatus("Biometric authentication failed");
      toast({
        title: "Biometric Failed",
        description: "Please use your PIN instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#1E1E1E] p-6">
      {/* Logo */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#D49A6A] to-amber-600 rounded-2xl flex items-center justify-center">
          <Lock className="text-xl text-[#1E1E1E]" size={24} />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-[#F5F5F5]">
          Welcome Back
        </h2>
        <p className="text-gray-300">Enter your PIN to continue</p>
      </div>

      {/* PIN Display */}
      <div className="text-center mb-12">
        <PinDots length={4} filled={pin.length} className="mb-6" />
        <p className="text-sm text-gray-400">{status}</p>
      </div>

      {/* Keypad */}
      <Keypad
        onNumberPress={handleNumberPress}
        onDelete={handleDelete}
        onBiometric={handleBiometric}
        showBiometric={true}
      />
    </div>
  );
}
