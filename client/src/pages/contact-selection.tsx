import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, UserPlus, Phone } from "lucide-react";
import { useAppData } from "@/hooks/use-storage";
import { useToast } from "@/hooks/use-toast";

export default function ContactSelectionPage() {
  const [, setLocation] = useLocation();
  const [newContactName, setNewContactName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [phoneContacts, setPhoneContacts] = useState<any[]>([]);
  const [showPhoneContacts, setShowPhoneContacts] = useState(false);
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

  const handleAccessPhoneContacts = async () => {
    try {
      // Request contacts permission and access
      if ('contacts' in navigator && 'ContactsManager' in window) {
        const contacts = await (navigator as any).contacts.select(['name', 'tel'], { multiple: true });
        setPhoneContacts(contacts);
        setShowPhoneContacts(true);
      } else {
        // Fallback for browsers that don't support Contacts API
        toast({
          title: "Contacts Access",
          description: "Phone contacts access is not available in this browser. Please create contacts manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Permission Denied",
        description: "Cannot access phone contacts. Please create contacts manually.",
        variant: "destructive",
      });
    }
  };

  const handlePhoneContactSelect = (contact: any) => {
    const name = contact.name && contact.name.length > 0 ? contact.name[0] : 'Unknown Contact';
    try {
      const contactId = addContact(name);
      toast({
        title: "Contact Added",
        description: `${name} has been added from your phone contacts.`,
      });
      setLocation(`/chat/${contactId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
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

      {/* Contact Options */}
      <div className="px-6 mb-6">
        {!showCreateForm && !showPhoneContacts ? (
          <div className="space-y-4">
            <h3 className="font-medium mb-4 text-[#F5F5F5]">Choose how to add a contact</h3>
            
            {/* Access Phone Contacts */}
            <Button
              onClick={handleAccessPhoneContacts}
              className="w-full bg-[#2D2D2D] hover:bg-[#383838] text-[#F5F5F5] border border-gray-600 py-4 px-4 rounded-xl transition-colors flex items-center space-x-3"
            >
              <Phone className="w-5 h-5" />
              <span>Access Phone Contacts</span>
            </Button>

            {/* Create New Contact */}
            <Button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-[#D49A6A] hover:bg-amber-600 text-[#1E1E1E] font-medium py-4 px-4 rounded-xl transition-colors flex items-center space-x-3"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create New Contact</span>
            </Button>
          </div>
        ) : showCreateForm ? (
          <div className="bg-[#2D2D2D] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-[#F5F5F5]">Create New Contact</h3>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-[#F5F5F5]"
              >
                Cancel
              </Button>
            </div>
            <Input
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter contact name..."
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-xl px-4 py-3 text-[#F5F5F5] placeholder-gray-400 focus:border-[#D49A6A] focus:outline-none transition-colors mb-3"
              autoFocus
            />
            <Button
              onClick={handleCreateContact}
              className="w-full bg-[#D49A6A] hover:bg-amber-600 text-[#1E1E1E] font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Create & Start Conversation
            </Button>
          </div>
        ) : (
          <div className="bg-[#2D2D2D] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-[#F5F5F5]">Phone Contacts</h3>
              <Button
                onClick={() => {setShowPhoneContacts(false); setPhoneContacts([]);}}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-[#F5F5F5]"
              >
                Cancel
              </Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {phoneContacts.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No contacts found or access denied</p>
              ) : (
                phoneContacts.map((contact, index) => (
                  <button
                    key={index}
                    onClick={() => handlePhoneContactSelect(contact)}
                    className="w-full text-left p-3 rounded-xl hover:bg-[#383838] transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#D49A6A] rounded-full flex items-center justify-center text-[#1E1E1E] font-medium">
                        {contact.name && contact.name.length > 0 ? contact.name[0][0].toUpperCase() : '?'}
                      </div>
                      <span className="text-[#F5F5F5]">
                        {contact.name && contact.name.length > 0 ? contact.name[0] : 'Unknown Contact'}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
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
