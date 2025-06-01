import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";
import { MessageBubble } from "@/components/message-bubble";
import { useAppData } from "@/hooks/use-storage";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/auth";

export default function ChatPage() {
  const [, setLocation] = useLocation();
  const { contactId } = useParams<{ contactId: string }>();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { data, addMessage, getContactMessages } = useAppData();
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
  const messages = getContactMessages(contactId || "");

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
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${displayContact.color} rounded-full flex items-center justify-center text-white font-medium`}>
            {displayContact.avatar}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#F5F5F5]">{displayContact.name}</h1>
            <p className="text-xs text-gray-400">Therapeutic conversation</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${displayContact.color} rounded-full flex items-center justify-center text-white text-2xl font-semibold`}>
              {displayContact.avatar}
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
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
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
    </div>
  );
}
