import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings, Plus, MoreVertical, Edit, Trash2, ImageIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { useAppData } from "@/hooks/use-storage";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import logoPath from "@assets/logo_portocaliu.png";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { data, isLoading, getConversationsWithContacts, deleteContact, updateData } = useAppData();
  const { toast } = useToast();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [newContactName, setNewContactName] = useState("");

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

  const handleRenameContact = (contact: any) => {
    setSelectedContact(contact);
    setNewContactName(contact.name);
    setRenameDialogOpen(true);
  };

  const handleSaveRename = () => {
    if (!selectedContact || !newContactName.trim()) return;

    updateData(data => ({
      ...data,
      contacts: data.contacts.map(c => 
        c.id === selectedContact.id 
          ? { ...c, name: newContactName.trim(), avatar: newContactName.trim().charAt(0).toUpperCase() }
          : c
      )
    }));

    toast({
      title: "Contact Renamed",
      description: `Contact renamed to ${newContactName.trim()}`,
    });

    setRenameDialogOpen(false);
    setSelectedContact(null);
    setNewContactName("");
  };

  const handleDeleteConversation = (contactId: string, contactName: string) => {
    if (confirm(`Are you sure you want to delete the conversation with ${contactName}? This will remove all messages and cannot be undone.`)) {
      deleteContact(contactId);
      toast({
        title: "Conversation Deleted",
        description: `Conversation with ${contactName} has been deleted.`,
      });
    }
  };

  const handleChangeAvatar = (contact: any) => {
    const colors = [
      "from-pink-500 to-rose-600",
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-violet-600",
      "from-green-500 to-emerald-600",
      "from-orange-500 to-amber-600",
      "from-red-500 to-pink-600",
      "from-cyan-500 to-blue-600",
      "from-violet-500 to-purple-600",
    ];

    const currentColorIndex = colors.indexOf(contact.color);
    const nextColorIndex = (currentColorIndex + 1) % colors.length;
    const newColor = colors[nextColorIndex];

    updateData(data => ({
      ...data,
      contacts: data.contacts.map(c => 
        c.id === contact.id 
          ? { ...c, color: newColor }
          : c
      )
    }));

    toast({
      title: "Avatar Updated",
      description: "Contact avatar color has been changed.",
    });
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
              : "";

            return (
              <div
                key={conv.id}
                className="bg-[#2D2D2D] hover:bg-[#383838] rounded-2xl p-4 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className={`w-12 h-12 bg-gradient-to-br ${conv.contact?.color} rounded-full flex items-center justify-center text-white font-semibold cursor-pointer`}
                    onClick={() => handleContactClick(conv.contactId)}
                  >
                    {conv.contact?.avatar}
                  </div>
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleContactClick(conv.contactId)}
                  >
                    <h3 className="font-medium text-[#F5F5F5]">
                      {conv.contact?.name}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      {conv.lastMessage || "Start your conversation..."}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{timeText}</p>
                      {conv.unreadCount > 0 && (
                        <div className="w-2 h-2 bg-[#D49A6A] rounded-full mt-1 ml-auto"></div>
                      )}
                    </div>
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
                      <DropdownMenuContent className="bg-[#2D2D2D] border-gray-600">
                        <DropdownMenuItem 
                          onClick={() => handleRenameContact(conv.contact)}
                          className="text-[#F5F5F5] hover:bg-[#383838] cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleChangeAvatar(conv.contact)}
                          className="text-[#F5F5F5] hover:bg-[#383838] cursor-pointer"
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Change Picture
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteConversation(conv.contactId, conv.contact?.name || "")}
                          className="text-red-400 hover:bg-red-900/20 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FAB Button */}
      <Button
        onClick={handleNewConversation}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#D49A6A] hover:bg-amber-600 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110"
      >
        <Plus className="w-6 h-6 text-[#1E1E1E]" />
      </Button>

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
    </div>
  );
}
