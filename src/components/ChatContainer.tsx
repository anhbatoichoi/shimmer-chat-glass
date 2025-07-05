import { useState, useEffect, useRef, useContext } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ContactList from "./ContactList";
import { Send, MoreVertical, Phone, Video, Users } from "lucide-react";
import type { ChatData, SocketResponse } from "@/type/chat";
import { useChatContext } from "@/contexts/ChatContext";
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
  const context = useChatContext();

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStopTyping = () => {
    const stopTypingData: ChatData = {
      message: "",
      room: undefined,
      to: context.selectedContact.name,
      action: "stop_typing",
      username: context.username,
    };
    if (context.socket) context.socket.send(JSON.stringify(stopTypingData));
  };
  const handleTyping = () => {
    const typingData: ChatData = {
      message: "",
      room: undefined,
      to: context.selectedContact.name,
      action: "typing",
      username: context.username,
    };
    if (context.socket) context.socket.send(JSON.stringify(typingData));
  };

  useEffect(() => {
    scrollToBottom();
  }, [context.chatSessions]);

  const handleMessage = () => {
    if (context.socket)
      context.socket.onmessage = (event: MessageEvent) => {
        try {
          const data: SocketResponse = JSON.parse(event.data);
          const action = data ? data.data.action : "send_message";
          //   check action
          switch (action) {
            case "typing":
              if (data.data.username == context.username) {
                // Ignore own typing actions
                return;
              }
              console.log("they are typing...");
              setIsTyping(true);
              break;
            case "stop_typing":
              // Ignore typing actions in the message display
              if (data.data.username == context.username) {
                // Ignore own typing actions
                return;
              }
              console.log("they stopped typing.");
              setIsTyping(false);

              break;
            case "send_message":
              // Handle sending message
              const messageText = data.data.message;
              const newMessage: Message = {
                id: Date.now().toString(),
                content: messageText,
                timestamp: new Date(),
                isOwn: data.data.username === context.username,
                sender: data.data.username,
              };
              context.updateChatSession(
                data.data.to == context.username
                  ? data.data.username
                  : data.data.to,
                newMessage
              );
              setIsTyping(false);
              scrollToBottom();
              break;
          }
          // send message
        } catch (error) {
          // addMessage(`Error parsing message: ${event.data}`, "error");
          console.error("Error parsing message:", error);
        }
      };
  };

  handleMessage();

  const handleCreateGroup = (name: string, members: Contact[]) => {
    const newGroup: Contact = {
      id: Date.now().toString(),
      name,
      avatar: "",
      isOnline: true,
      lastMessage: "Group created",
      timestamp: "now",
      isGroup: true,
      members,
    };

    context.addContact(newGroup);
    context.setSelectedContact(newGroup);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Create new message object
    const messageData: ChatData = {
      message: content,
      room: undefined,
      to: context.selectedContact.name,
      action: "send_message",
      username: context.username,
    };

    context.socket.send(JSON.stringify(messageData));

    setNewMessage("");
  };

  return (
    <div className="flex h-screen w-full">
      {/* Contacts Sidebar */}
      <div className="w-80 glass-morphism border-r-0">
        <ContactList
          contacts={context.contacts}
          selectedContact={context.selectedContact}
          onSelectContact={context.setSelectedContact}
          onCreateGroup={handleCreateGroup}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col glass-morphism">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {context.selectedContact.isGroup ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-sky-500/20 border border-white/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white/80" />
                </div>
              ) : (
                <>
                  <img
                    src={context.selectedContact.avatar}
                    alt={context.selectedContact.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {context.selectedContact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full online-pulse"></div>
                  )}
                </>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {context.selectedContact.name}
              </h3>
              <p className="text-sm text-white/70">
                {context.selectedContact.isGroup
                  ? `${context.selectedContact.members?.length || 0} members`
                  : context.selectedContact.isOnline
                  ? "Active now"
                  : "Last seen recently"}
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
          {context.chatSessions[context.selectedContact.name] &&
            context.chatSessions[context.selectedContact.name].map(
              (message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isConsecutive={
                    index > 0 &&
                    context.chatSessions[context.selectedContact.name][
                      index - 1
                    ].isOwn === message.isOwn
                  }
                />
              )
            )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs typing-indicator">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-white/10">
          <ChatInput
            onBlur={handleStopTyping}
            onFocus={handleTyping}
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleSendMessage}
            placeholder={`Message ${context.selectedContact.name}...`}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
