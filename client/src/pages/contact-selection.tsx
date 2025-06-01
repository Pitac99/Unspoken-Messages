import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAppData } from "@/hooks/use-storage";
import { useToast } from "@/hooks/use-toast";

export default function ContactSelectionPage() {
  const [, setLocation] = useLocation();
  const [newContactName, setNewContactName] = useState("");
  const { data, addContact } = useAppData();
  const { toast } = useToast();

  const handleBack = () => {
    setLocation("/home");
  };

  const handleCreateContact = () => {
    const name = newContactName.trim();
    if (!name) {
      toast({
        title: "Name Required",
        description: "Please enter a contact name.",
        variant: "destructive",
      });
      return;
    }

    if (data?.contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: "Contact Exists",
        description: "A contact with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    try {
      const contactId = addContact(name);
      toast({
        title: "Contact Created",
        description: `${name} has been added to your contacts.`,
      });
      
      // Navigate directly to chat with the new contact ID
      setLocation(`/chat/${contactId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContactClick = (contactId: string) => {
    setLocation(`/chat/${contactId}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateContact();
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-[#2D2D2D] hover:bg-[#383838] text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-[#F5F5F5]">New Conversation</h1>
        <div className="w-10"></div>
      </div>

      {/* Add New Contact */}
      <div className="px-6 mb-6">
        <div className="bg-[#2D2D2D] rounded-2xl p-4">
          <h3 className="font-medium mb-3 text-[#F5F5F5]">Create New Contact</h3>
          <Input
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter contact name..."
            className="w-full bg-[#1E1E1E] border border-gray-600 rounded-xl px-4 py-3 text-[#F5F5F5] placeholder-gray-400 focus:border-[#D49A6A] focus:outline-none transition-colors mb-3"
          />
          <Button
            onClick={handleCreateContact}
            className="w-full bg-[#D49A6A] hover:bg-amber-600 text-[#1E1E1E] font-medium py-3 px-4 rounded-xl transition-colors"
          >
            Create & Start Conversation
          </Button>
        </div>
      </div>

      {/* Existing Contacts */}
      {data?.contacts && data.contacts.length > 0 && (
        <div className="px-6">
          <h3 className="font-medium mb-4 text-gray-300">Recent Contacts</h3>
          <div className="space-y-3">
            {data.contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-[#2D2D2D] hover:bg-[#383838] rounded-xl p-4 transition-colors cursor-pointer"
                onClick={() => handleContactClick(contact.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${contact.color} rounded-full flex items-center justify-center text-white font-medium`}>
                    {contact.avatar}
                  </div>
                  <span className="font-medium text-[#F5F5F5]">{contact.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
