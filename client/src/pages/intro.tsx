import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useLocation } from "wouter";

export default function IntroPage() {
  const [, setLocation] = useLocation();

  const handleAcceptTerms = () => {
    setLocation("/onboarding");
  };

  const handleViewTerms = () => {
    setLocation("/terms");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 text-center bg-[#1E1E1E]">
      <div className="animate-fade-in">
        {/* Logo Container */}
        <div className="mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#D49A6A] to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <Lock className="text-3xl text-[#1E1E1E]" size={48} />
          </div>
          <h1 className="text-4xl font-semibold mb-3 tracking-tight text-[#F5F5F5]">
            UNSPOKEN
          </h1>
          <p className="text-lg text-gray-300 font-light">
            A therapeutic space for your thoughts
          </p>
        </div>

        {/* Welcome Message */}
        <div className="mb-12 space-y-4">
          <p className="text-gray-300 leading-relaxed max-w-sm">
            Express your deepest thoughts in a secure, private environment designed for emotional healing.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 w-full max-w-sm">
          <Button
            onClick={handleAcceptTerms}
            className="w-full bg-[#D49A6A] hover:bg-amber-600 text-[#1E1E1E] font-medium py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Accept Terms & Continue
          </Button>
          <Button
            onClick={handleViewTerms}
            variant="ghost"
            className="w-full text-[#D49A6A] hover:text-amber-400 font-medium py-3 transition-colors duration-300 underline decoration-dotted"
          >
            View Terms & Conditions
          </Button>
        </div>
      </div>
    </div>
  );
}
