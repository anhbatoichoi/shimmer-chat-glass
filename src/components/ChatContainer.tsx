
import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ContactList from "./ContactList";
import { Send, MoreVertical, Phone, Video, Users } from "lucide-react";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  sender: string;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  timestamp: string;
  isGroup?: boolean;
  members?: Contact[];
}

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey! How are you doing?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isOwn: false,
      sender: "Sarah Wilson"
    },
    {
      id: "2",
      content: "I'm doing great! Just working on some new projects. What about you?",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      isOwn: true,
      sender: "You"
    },
    {
      id: "3",
      content: "That sounds awesome! I'd love to hear more about what you're working on 🚀",
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
      isOwn: false,
      sender: "Sarah Wilson"
    }
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      lastMessage: "That sounds awesome!",
      timestamp: "2 min"
    },
    {
      id: "2",
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      lastMessage: "Let's catch up soon!",
      timestamp: "1 hour"
    },
    {
      id: "3",
      name: "Maya Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      isOnline: false,
      lastMessage: "Thanks for the help!",
      timestamp: "3 hours"
    },
    {
      id: "4",
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      lastMessage: "See you tomorrow",
      timestamp: "1 day"
    }
  ]);

  const [selectedContact, setSelectedContact] = useState<Contact>({
    id: "1",
    name: "Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    isOnline: true,
    lastMessage: "That sounds awesome!",
    timestamp: "2 min"
  });

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCreateGroup = (name: string, members: Contact[]) => {
    const newGroup: Contact = {
      id: Date.now().toString(),
      name,
      avatar: "",
      isOnline: true,
      lastMessage: "Group created",
      timestamp: "now",
      isGroup: true,
      members
    };
    
    setContacts(prev => [newGroup, ...prev]);
    setSelectedContact(newGroup);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      isOwn: true,
      sender: "You"
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");

    // Simulate typing indicator and response
    setTimeout(() => {
      setIsTyping(true);
    }, 500);

    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That's really interesting! 😊",
        "I totally agree with you!",
        "Thanks for sharing that with me ✨",
        "Wow, that's amazing!",
        "I'd love to know more about that 🤔"
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isOwn: false,
        sender: selectedContact.name
      };
      
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Contacts Sidebar */}
      <div className="w-80 glass-morphism border-r-0">
        <ContactList 
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          onCreateGroup={handleCreateGroup}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col glass-morphism">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {selectedContact.isGroup ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-sky-500/20 border border-white/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white/80" />
                </div>
              ) : (
                <>
                  <img
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {selectedContact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full online-pulse"></div>
                  )}
                </>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">{selectedContact.name}</h3>
              <p className="text-sm text-white/70">
                {selectedContact.isGroup 
                  ? `${selectedContact.members?.length || 0} members`
                  : selectedContact.isOnline ? "Active now" : "Last seen recently"
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Phone className="w-5 h-5 text-white/80" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Video className="w-5 h-5 text-white/80" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <MoreVertical className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isConsecutive={index > 0 && messages[index - 1].isOwn === message.isOwn}
            />
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs typing-indicator">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-white/10">
          <ChatInput
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleSendMessage}
            placeholder={`Message ${selectedContact.name}...`}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
