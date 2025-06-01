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
            <p className="text-sm text-gray-400 mb-4">Last updated: May 28, 2025</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#D49A6A]">1. Purpose of the App</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Unspoken is a digital space for writing personal, unsent messages to people in your life. 
              Its purpose is emotional release, mental clarity, and self-reflection. This app is not a 
              messaging service and messages are not transmitted to others.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#D49A6A]">2. Data Storage and Security</h3>
            <div className="text-gray-300 text-sm leading-relaxed space-y-1">
              <p>• All messages and contact data are stored locally on your device.</p>
              <p>• Data is secured using encrypted local storage (e.g., Expo SecureStore).</p>
              <p>• We do not collect, transmit, or store any personal information, messages, or contact lists on our servers.</p>
              <p>• Biometric security (Face ID / Fingerprint) is optionally available for additional protection.</p>
              <p>• In case of app removal, phone loss, or reset, all data may be permanently lost. Backups are your responsibility.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#D49A6A]">3. User Responsibility</h3>
            <div className="text-gray-300 text-sm leading-relaxed space-y-1">
              <p>As data is stored only on your device:</p>
              <p>• You are solely responsible for securing your device and access to the app.</p>
              <p>• The development team cannot be held liable for unauthorized access or loss of content caused by external factors (e.g., device theft, third-party access, or malware).</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#D49A6A]">4. No Liability for Emotional Outcomes</h3>
            <div className="text-gray-300 text-sm leading-relaxed space-y-1">
              <p>Unspoken is a self-help tool and should not replace professional mental health support.</p>
              <p>We disclaim responsibility for:</p>
              <p>• Any psychological or emotional consequences of using the app.</p>
              <p>• Actions taken by users based on their messages or app usage.</p>
              <p>Please consult a licensed therapist for mental health issues.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#D49A6A]">5. Donations</h3>
            <div className="text-gray-300 text-sm leading-relaxed space-y-1">
              <p>• Donations made via platforms like BuyMeACoffee are optional.</p>
              <p>• These contributions support development, hosting, maintenance, and future updates.</p>
              <p>• Donations are processed externally and securely via third-party services.</p>
              <p>• No user data (e.g., messages or identities) is shared with or linked to donations.</p>
              <p>• Donations are non-refundable.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#D49A6A]">6. Age Requirement</h3>
            <div className="text-gray-300 text-sm leading-relaxed space-y-1">
              <p>• By using this app, you confirm that you are at least 13 years old (or the minimum legal age required in your jurisdiction).</p>
              <p>• If you are under 18, parental consent is recommended for use of emotional support tools.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#D49A6A]">7. Intellectual Property</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              All visual elements, design, and app logic are the property of the Unspoken development team. 
              You may not copy, redistribute, or alter any part of the app without written permission.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#D49A6A]">8. Updates and Changes</h3>
            <div className="text-gray-300 text-sm leading-relaxed space-y-1">
              <p>We reserve the right to modify these Terms and Conditions at any time.</p>
              <p>Changes will be announced through the app, and the "Last updated" date will be revised accordingly.</p>
              <p>Continued use of the app implies acceptance of any new terms.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#D49A6A]">9. Contact</h3>
            <div className="text-gray-300 text-sm leading-relaxed space-y-1">
              <p>For questions, feedback, or support:</p>
              <p>• Use the contact form or support feature available within the app.</p>
              <p>• For donation-related queries, refer to the respective donation platform.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#D49A6A]">10. Anonymous Usage Tracking</h3>
            <div className="text-gray-300 text-sm leading-relaxed space-y-1">
              <p>In order to better understand overall usage and improve the app, Unspoken tracks the total number of messages written across all users.</p>
              <p>• No content of the messages is collected.</p>
              <p>• No personal information, identifiers, or device data is tracked.</p>
              <p>• Only the numeric count of messages is incremented anonymously and stored in a secure backend.</p>
              <p>• By using the app, you consent to this non-invasive and privacy-respecting tracking.</p>
            </div>
          </div>

          <div className="bg-[#383838] p-4 rounded-xl border border-[#D49A6A]/20">
            <p className="text-sm text-gray-400">
              By using Unspoken, you confirm that you have read, understood, and agree to these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
