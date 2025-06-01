import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Send, MoreVertical, Trash2, Edit, Image, X, LogOut } from "lucide-react";
import { MessageBubble } from "@/components/message-bubble";
import { Keypad } from "@/components/keypad";
import { PinDots } from "@/components/pin-dots";
import { useAppData } from "@/hooks/use-storage";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/auth";
import type { AvatarColor } from "@/types";

export default function ChatPage() {
  const [, setLocation] = useLocation();
  const { contactId } = useParams<{ contactId: string }>();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
  const [unlockPin, setUnlockPin] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { data, addMessage, editMessage, getContactMessages, updateData } = useAppData();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      setLocation("/pin-auth");
      return;
    }
    
    // Extend session on page load
    auth.extendSession();
  }, [setLocation]);

  const contact = data?.contacts.find(c => c.id === contactId);
  const conversation = data?.conversations.find(c => c.contactId === contactId);
  const messages = getContactMessages(contactId || "");
  const isClosed = conversation?.isClosed || false;

  useEffect(() => {
    // Only redirect if no contactId is provided
    if (!contactId) {
      setLocation("/home");
      return;
    }
  }, [contactId, setLocation]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
    }
  }, [message]);

  const handleBack = () => {
    setLocation("/home");
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !contactId || isLoading) return;

    setIsLoading(true);
    try {
      addMessage(contactId, trimmedMessage);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const avatarColors: AvatarColor[] = [
    "from-pink-500 to-rose-600",
    "from-blue-500 to-indigo-600", 
    "from-purple-500 to-violet-600",
    "from-green-500 to-emerald-600",
    "from-orange-500 to-amber-600",
    "from-red-500 to-pink-600",
    "from-cyan-500 to-blue-600",
    "from-violet-500 to-purple-600"
  ];

  const handleDeleteAllMessages = () => {
    if (!contactId || !data) return;
    
    updateData(prevData => ({
      ...prevData,
      conversations: prevData.conversations.map(conv => 
        conv.contactId === contactId 
          ? { ...conv, messageIds: [], lastMessage: "", lastMessageAt: undefined }
          : conv
      ),
      messages: prevData.messages.filter(msg => msg.contactId !== contactId)
    }));

    toast({
      title: "Success",
      description: "All messages deleted successfully.",
    });
  };

  const handleRenameContact = () => {
    const currentContact = data?.contacts.find(c => c.id === contactId);
    if (currentContact) {
      setNewContactName(currentContact.name);
      setRenameDialogOpen(true);
    }
  };

  const handleSaveRename = () => {
    if (!newContactName.trim() || !contactId || !data) return;

    updateData(prevData => ({
      ...prevData,
      contacts: prevData.contacts.map(contact =>
        contact.id === contactId 
          ? { ...contact, name: newContactName.trim() }
          : contact
      )
    }));

    setRenameDialogOpen(false);
    setNewContactName("");
    
    toast({
      title: "Success",
      description: "Contact renamed successfully.",
    });
  };

  const handleChangeAvatar = (newColor: AvatarColor) => {
    if (!contactId || !data) return;

    updateData(prevData => ({
      ...prevData,
      contacts: prevData.contacts.map(contact =>
        contact.id === contactId 
          ? { ...contact, color: newColor }
          : contact
      )
    }));

    toast({
      title: "Success",
      description: "Avatar color changed successfully.",
    });
  };

  const handleDeleteCurrentPhoto = () => {
    if (!contactId || !data) return;

    updateData(prevData => ({
      ...prevData,
      contacts: prevData.contacts.map(contact =>
        contact.id === contactId 
          ? { ...contact, imageUrl: undefined }
          : contact
      )
    }));

    toast({
      title: "Success",
      description: "Avatar photo deleted successfully.",
    });
  };

  const handleUploadImage = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Create a FileReader to read the image
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageDataUrl = event.target?.result as string;
          
          if (!contactId || !data) return;
          
          updateData(prevData => ({
            ...prevData,
            contacts: prevData.contacts.map(contact =>
              contact.id === contactId 
                ? { ...contact, imageUrl: imageDataUrl }
                : contact
            )
          }));

          toast({
            title: "Success",
            description: "Avatar image updated successfully.",
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleDeleteConversation = () => {
    if (!contactId || !data) return;

    updateData(prevData => ({
      ...prevData,
      contacts: prevData.contacts.filter(contact => contact.id !== contactId),
      conversations: prevData.conversations.filter(conv => conv.contactId !== contactId),
      messages: prevData.messages.filter(msg => msg.contactId !== contactId)
    }));

    toast({
      title: "Success",
      description: "Conversation deleted successfully.",
    });

    setLocation("/home");
  };

  const handleClosure = () => {
    if (!contactId || !data) return;

    updateData(prevData => ({
      ...prevData,
      conversations: prevData.conversations.map(conv =>
        conv.contactId === contactId 
          ? { ...conv, isClosed: true }
          : conv
      )
    }));

    toast({
      title: "Conversation Closed",
      description: "Your therapeutic journey for this conversation has been completed.",
    });
  };

  const handleUnlockRequest = () => {
    setUnlockDialogOpen(true);
  };

  const handleUnlockConfirm = () => {
    if (!auth.authenticate(unlockPin)) {
      toast({
        title: "Invalid PIN",
        description: "Please enter the correct PIN to unlock this conversation.",
        variant: "destructive",
      });
      return;
    }

    if (!contactId || !data) return;

    updateData(prevData => ({
      ...prevData,
      conversations: prevData.conversations.map(conv =>
        conv.contactId === contactId 
          ? { ...conv, isClosed: false }
          : conv
      )
    }));

    setUnlockDialogOpen(false);
    setUnlockPin("");
    toast({
      title: "Conversation Unlocked",
      description: "You can now continue your therapeutic conversation.",
    });
  };

  const handleUnlockCancel = () => {
    setUnlockDialogOpen(false);
    setUnlockPin("");
  };

  const handleUnlockNumberPress = (number: string) => {
    if (unlockPin.length < 4) {
      setUnlockPin(prev => prev + number);
    }
  };

  const handleUnlockDelete = () => {
    setUnlockPin(prev => prev.slice(0, -1));
  };

  // Auto-submit PIN when 4 digits are entered
  useEffect(() => {
    if (unlockPin.length === 4 && unlockDialogOpen) {
      const timer = setTimeout(() => {
        handleUnlockConfirm();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [unlockPin, unlockDialogOpen]);

  // Show loading state while data is being loaded
  if (!data) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If contact doesn't exist yet, we can still show the chat interface
  // The contact will be created when the first message is sent
  const displayContact = contact || {
    id: contactId,
    name: "New Contact",
    avatar: "?",
    color: "from-blue-500 to-indigo-600"
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-4 p-6 pb-4 bg-[#1E1E1E] border-b border-[#2D2D2D]">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-[#2D2D2D] hover:bg-[#383838] text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center space-x-3 flex-1">
          <div className={`w-10 h-10 bg-gradient-to-br ${displayContact.color} rounded-full flex items-center justify-center text-white font-medium overflow-hidden`}>
            {contact?.imageUrl ? (
              <img 
                src={contact.imageUrl} 
                alt={displayContact.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              displayContact.avatar
            )}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#F5F5F5]">{displayContact.name}</h1>
            <p className="text-xs text-gray-400">Therapeutic conversation</p>
          </div>
        </div>
        
        {/* Chat Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-400 hover:text-[#F5F5F5] hover:bg-[#383838]"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#2D2D2D] border-gray-600" align="end">
            <DropdownMenuItem 
              onClick={handleDeleteAllMessages}
              className="text-[#F5F5F5] hover:bg-[#383838] cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete all messages
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleRenameContact}
              className="text-[#F5F5F5] hover:bg-[#383838] cursor-pointer"
            >
              <Edit className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleUploadImage}
              className="text-[#F5F5F5] hover:bg-[#383838] cursor-pointer"
            >
              <Image className="w-4 h-4 mr-2" />
              Change Image
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDeleteCurrentPhoto}
              className="text-red-400 hover:bg-[#383838] cursor-pointer"
            >
              <X className="w-4 h-4 mr-2" />
              Delete Current Photo
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={isClosed ? handleUnlockRequest : handleClosure}
              className="text-[#F5F5F5] hover:bg-[#383838] cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isClosed ? "Unlock" : "Closure"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isClosed ? (
          <div className="space-y-4">
            {/* Show Message History First */}
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                onEdit={editMessage}
                isEditMode={!isClosed}
              />
            ))}
            
            {/* Closure Message at the End */}
            <div className="text-center py-8 bg-[#2D2D2D] rounded-2xl mt-6 mx-4">
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold`}>
                ✓
              </div>
              <h3 className="text-lg font-medium text-[#F5F5F5] mb-3">
                We are glad you found closure
              </h3>
              <p className="text-gray-300 text-sm mb-2 px-6">
                We're glad Unspoken has helped you express yourself.
              </p>
              <p className="text-gray-400 text-xs px-6">
                This therapeutic conversation has reached its closure.
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${displayContact.color} rounded-full flex items-center justify-center text-white text-2xl font-semibold overflow-hidden`}>
              {contact?.imageUrl ? (
                <img 
                  src={contact.imageUrl} 
                  alt={displayContact.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                displayContact.avatar
              )}
            </div>
            <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
              Start your conversation with {displayContact.name}
            </h3>
            <p className="text-gray-400 text-sm">
              This is a safe space to express your thoughts and feelings.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              onEdit={editMessage}
              isEditMode={!isClosed}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input or Unlock Button */}
      {isClosed ? (
        <div className="p-6 pt-4 bg-[#1E1E1E] border-t border-[#2D2D2D]">
          <div className="text-center">
            <Button
              onClick={handleUnlockRequest}
              className="bg-[#D49A6A] hover:bg-amber-600 text-[#1E1E1E] px-8 py-3 rounded-full font-medium"
            >
              Continue Conversation
            </Button>
            <p className="text-gray-400 text-xs mt-2">
              Unlock to add new messages to this conversation
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 pt-4 bg-[#1E1E1E] border-t border-[#2D2D2D]">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write your thoughts..."
                className="w-full bg-[#2D2D2D] border border-gray-600 rounded-2xl px-4 py-3 text-[#F5F5F5] placeholder-gray-400 focus:border-[#D49A6A] focus:outline-none transition-colors resize-none min-h-[44px] max-h-32 overflow-hidden"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="w-12 h-12 bg-[#D49A6A] hover:bg-amber-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-[#1E1E1E]" />
            </Button>
          </div>
        </div>
      )}

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="bg-[#2D2D2D] border-gray-600">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F5]">Rename Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Contact Name</label>
              <Input
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSaveRename()}
                placeholder="Enter new name..."
                className="bg-[#1E1E1E] border-gray-600 text-[#F5F5F5]"
                autoFocus
              />
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setRenameDialogOpen(false)}
                variant="outline"
                className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-[#383838]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRename}
                className="flex-1 bg-[#D49A6A] hover:bg-amber-600 text-[#1E1E1E]"
                disabled={!newContactName.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unlock PIN Dialog */}
      <Dialog open={unlockDialogOpen} onOpenChange={setUnlockDialogOpen}>
        <DialogContent className="bg-[#2D2D2D] border-gray-600 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F5] text-center">Enter PIN to Unlock</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-4">
                Please enter your PIN to continue this conversation
              </p>
              <PinDots length={4} filled={unlockPin.length} className="justify-center" />
            </div>
            
            <Keypad
              onNumberPress={handleUnlockNumberPress}
              onDelete={handleUnlockDelete}
              className="w-full"
            />
            
            <div className="flex space-x-3">
              <Button
                onClick={handleUnlockCancel}
                variant="outline"
                className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-[#383838]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
