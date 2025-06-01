import { Button } from "@/components/ui/button";
import { Shield, MessageCircle, Heart } from "lucide-react";
import { useLocation } from "wouter";
import logoPath from "@assets/logo_portocaliu.png";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    setLocation("/pin-setup");
  };

  const steps = [
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your messages are encrypted locally and never leave your device. Complete privacy guaranteed.",
      delay: "0s"
    },
    {
      icon: MessageCircle,
      title: "Therapeutic Writing",
      description: "Write messages to symbolic contacts - express emotions without expecting responses.",
      delay: "0.1s"
    },
    {
      icon: Heart,
      title: "Emotional Processing",
      description: "Track your mental health journey through organized conversations and insights.",
      delay: "0.2s"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#1E1E1E] p-6">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="w-20 h-20 mx-auto mb-4">
          <img 
            src={logoPath} 
            alt="UNSPOKEN Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-[#F5F5F5]">
          Welcome to Your Safe Space
        </h2>
        <p className="text-gray-300">Let's set up your therapeutic journey</p>
      </div>

      {/* Onboarding Steps */}
      <div className="flex-1 space-y-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-[#2D2D2D] rounded-2xl p-6 animate-slide-up"
            style={{ animationDelay: step.delay }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#D49A6A] rounded-full flex items-center justify-center text-[#1E1E1E] font-semibold">
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium mb-2 text-[#F5F5F5]">{step.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="pt-8">
        <Button
          onClick={handleContinue}
          className="w-full bg-[#D49A6A] hover:bg-amber-600 text-[#1E1E1E] font-medium py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg"
        >
          Set Up Security PIN
        </Button>
      </div>
    </div>
  );
}
