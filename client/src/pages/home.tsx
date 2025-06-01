import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Settings, Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { useAppData } from "@/hooks/use-storage";
import { format } from "date-fns";
import logoPath from "@assets/logo_portocaliu.png";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { data, isLoading, getConversationsWithContacts } = useAppData();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      setLocation("/pin-auth");
      return;
    }
    
    // Extend session on page load
    auth.extendSession();
  }, [setLocation]);

  const conversations = getConversationsWithContacts();

  const handleContactClick = (contactId: string) => {
    setLocation(`/chat/${contactId}`);
  };

  const handleSettingsClick = () => {
    setLocation("/settings");
  };

  const handleNewConversation = () => {
    setLocation("/contact-selection");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#D49A6A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8">
            <img 
              src={logoPath} 
              alt="UNSPOKEN" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-[#F5F5F5]">Conversations</h1>
        </div>
        <Button
          onClick={handleSettingsClick}
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-[#2D2D2D] hover:bg-[#383838] text-gray-400 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Conversations List */}
      <div className="px-6 space-y-3 mb-20">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#2D2D2D] rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start your therapeutic journey by creating your first conversation.
            </p>
            <Button
              onClick={handleNewConversation}
              className="bg-[#D49A6A] hover:bg-amber-600 text-[#1E1E1E]"
            >
              Create First Conversation
            </Button>
          </div>
        ) : (
          conversations.map((conv) => {
            const timeText = conv.lastMessageAt 
              ? format(new Date(conv.lastMessageAt), "h:mm a")
              : "No messages";

            return (
              <div
                key={conv.id}
                className="bg-[#2D2D2D] hover:bg-[#383838] rounded-2xl p-4 transition-all duration-300 cursor-pointer"
                onClick={() => handleContactClick(conv.contactId)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${conv.contact?.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                    {conv.contact?.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#F5F5F5]">
                      {conv.contact?.name}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      {conv.lastMessage || "Start your conversation..."}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{timeText}</p>
                    {conv.unreadCount > 0 && (
                      <div className="w-2 h-2 bg-[#D49A6A] rounded-full mt-1 ml-auto"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FAB Button */}
      {conversations.length > 0 && (
        <Button
          onClick={handleNewConversation}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#D49A6A] hover:bg-amber-600 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110"
        >
          <Plus className="w-6 h-6 text-[#1E1E1E]" />
        </Button>
      )}
    </div>
  );
}
