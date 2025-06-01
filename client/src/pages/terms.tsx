import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    // Check if we came from settings or intro
    const referrer = sessionStorage.getItem("termsReferrer") || "/";
    sessionStorage.removeItem("termsReferrer");
    setLocation(referrer);
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      {/* Header */}
      <div className="flex items-center space-x-4 p-6 pb-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-[#2D2D2D] hover:bg-[#383838] text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-[#F5F5F5]">Terms & Conditions</h1>
      </div>

      {/* Terms Content */}
      <div className="px-6 pb-6">
        <div className="bg-[#2D2D2D] rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3 text-[#F5F5F5]">Privacy & Security</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              UNSPOKEN is designed with your privacy as the top priority. All messages are encrypted locally on your device and never transmitted to external servers. Your therapeutic conversations remain completely private and secure.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-[#F5F5F5]">Therapeutic Purpose</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              This application is designed as a tool for emotional expression and mental wellness through therapeutic writing. It is not a replacement for professional mental health treatment. If you're experiencing severe mental health issues, please consult with a qualified healthcare professional.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-[#F5F5F5]">Data Usage</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              No personal data is collected, transmitted, or shared. All information remains on your device. You have full control over your data and can export or delete it at any time through the Settings page.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-[#F5F5F5]">Security Features</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your conversations are protected by PIN authentication, optional biometric security, and AES encryption. Regular security updates ensure your therapeutic space remains safe and private.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-[#F5F5F5]">Limitation of Liability</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              UNSPOKEN is provided "as is" without warranty of any kind. The developers are not liable for any damages arising from the use of this application. Users are responsible for maintaining the security of their device and PIN.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-[#F5F5F5]">Changes to Terms</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              These terms may be updated from time to time. Users will be notified of significant changes through the application. Continued use of UNSPOKEN constitutes acceptance of updated terms.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-600">
            <p className="text-xs text-gray-500">
              Last updated: December 2024<br />
              Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
