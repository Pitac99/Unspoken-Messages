import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Shield, KeyRound, LifeBuoy, ChevronRight, Download, RefreshCw, ExternalLink, Info, Database, Trash2 } from "lucide-react";
import { useAppData } from "@/hooks/use-storage";
import { auth } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const { data, updateSettings, resetDonationCounter, clearAllData } = useAppData();
  const { toast } = useToast();
  
  const [pinChangeOpen, setPinChangeOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleBack = () => {
    setLocation("/home");
  };

  const handleBiometricToggle = (enabled: boolean) => {
    updateSettings({ biometricEnabled: enabled });
    toast({
      title: "Settings Updated",
      description: `Biometric authentication ${enabled ? "enabled" : "disabled"}.`,
    });
  };

  const handleAutoDeleteToggle = (enabled: boolean) => {
    updateSettings({ autoDeleteEnabled: enabled });
    toast({
      title: "Settings Updated",
      description: `Auto-delete messages ${enabled ? "enabled" : "disabled"}.`,
    });
  };

  const handlePinChange = () => {
    if (!currentPin || !newPin || !confirmPin) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPin !== confirmPin) {
      toast({
        title: "PIN Mismatch",
        description: "New PIN and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits.",
        variant: "destructive",
      });
      return;
    }

    const success = auth.changePin(currentPin, newPin);
    if (success) {
      toast({
        title: "PIN Changed",
        description: "Your PIN has been updated successfully.",
      });
      setPinChangeOpen(false);
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } else {
      toast({
        title: "Incorrect PIN",
        description: "Current PIN is incorrect.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    try {
      const exportedData = storage.exportData();
      const blob = new Blob([exportedData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `unspoken-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your encrypted data has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetOnboarding = () => {
    if (confirm("This will reset the app to initial setup. All data will be preserved but you'll need to go through onboarding again. Continue?")) {
      updateSettings({ onboardingCompleted: false });
      auth.logout();
      setLocation("/");
    }
  };

  const handleTerms = () => {
    setLocation("/terms");
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
        <h1 className="text-xl font-semibold text-[#F5F5F5]">Settings</h1>
      </div>

      {/* Settings Content */}
      <div className="px-6 space-y-6">
        {/* Security Section */}
        <div className="bg-[#2D2D2D] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-[#F5F5F5]">
            <Shield className="text-[#D49A6A] mr-3" size={20} />
            Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#F5F5F5]">Biometric Authentication</p>
                <p className="text-sm text-gray-400">Use fingerprint or Face ID</p>
              </div>
              <Switch
                checked={data?.settings.biometricEnabled || false}
                onCheckedChange={handleBiometricToggle}
                className="data-[state=checked]:bg-[#D49A6A]"
              />
            </div>
            
            <Dialog open={pinChangeOpen} onOpenChange={setPinChangeOpen}>
              <DialogTrigger asChild>
                <button className="w-full text-left p-3 rounded-xl hover:bg-[#383838] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F5F5]">Change PIN</span>
                    <ChevronRight className="text-gray-400" size={16} />
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#2D2D2D] border-gray-600">
                <DialogHeader>
                  <DialogTitle className="text-[#F5F5F5]">Change PIN</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Current PIN</label>
                    <Input
                      type="password"
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value)}
                      maxLength={4}
                      className="bg-[#1E1E1E] border-gray-600 text-[#F5F5F5]"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">New PIN</label>
                    <Input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      maxLength={4}
                      className="bg-[#1E1E1E] border-gray-600 text-[#F5F5F5]"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Confirm New PIN</label>
                    <Input
                      type="password"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      maxLength={4}
                      className="bg-[#1E1E1E] border-gray-600 text-[#F5F5F5]"
                    />
                  </div>
                  <Button
                    onClick={handlePinChange}
                    className="w-full bg-[#D49A6A] hover:bg-amber-600 text-[#1E1E1E]"
                  >
                    Update PIN
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-[#2D2D2D] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-[#F5F5F5]">
            <KeyRound className="text-[#D49A6A] mr-3" size={20} />
            Privacy
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#F5F5F5]">Auto-delete Messages</p>
                <p className="text-sm text-gray-400">Remove messages after 30 days</p>
              </div>
              <Switch
                checked={data?.settings.autoDeleteEnabled || false}
                onCheckedChange={handleAutoDeleteToggle}
                className="data-[state=checked]:bg-[#D49A6A]"
              />
            </div>
            <button
              onClick={handleExportData}
              className="w-full text-left p-3 rounded-xl hover:bg-[#383838] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#F5F5F5]">Export Data</span>
                <Download className="text-gray-400" size={16} />
              </div>
            </button>
            <button
              onClick={handleResetOnboarding}
              className="w-full text-left p-3 rounded-xl hover:bg-[#383838] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#F5F5F5]">Reset Onboarding</span>
                <RefreshCw className="text-gray-400" size={16} />
              </div>
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-[#2D2D2D] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-[#F5F5F5]">
            <LifeBuoy className="text-[#D49A6A] mr-3" size={20} />
            Support
          </h2>
          <div className="space-y-2">
            <button className="w-full text-left p-3 rounded-xl hover:bg-[#383838] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[#F5F5F5]">Support Development</span>
                <ExternalLink className="text-gray-400" size={16} />
              </div>
            </button>
            <button
              onClick={handleTerms}
              className="w-full text-left p-3 rounded-xl hover:bg-[#383838] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#F5F5F5]">Terms & Conditions</span>
                <ChevronRight className="text-gray-400" size={16} />
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-xl hover:bg-[#383838] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[#F5F5F5]">About UNSPOKEN</span>
                <Info className="text-gray-400" size={16} />
              </div>
            </button>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-[#2D2D2D] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-[#F5F5F5]">
            <Database className="text-[#D49A6A] mr-3" size={20} />
            Data Management
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => {
                if (window.confirm('This will delete all your data including messages, contacts, and reset the donation counter. This action cannot be undone. Are you sure?')) {
                  clearAllData();
                  window.location.href = '/intro';
                }
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-red-600/20 transition-colors border border-red-600/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-red-400">Clear All Data</span>
                <Trash2 className="text-red-400" size={16} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
