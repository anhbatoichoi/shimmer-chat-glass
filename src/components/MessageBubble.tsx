
import { format } from "date-fns";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  sender: string;
}

interface MessageBubbleProps {
  message: Message;
  isConsecutive?: boolean;
}

const MessageBubble = ({ message, isConsecutive = false }: MessageBubbleProps) => {
  const { content, timestamp, isOwn } = message;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}>
      <div className={`group max-w-xs lg:max-w-md ${isOwn ? 'message-sent' : 'message-received'}`}>
        <div
          className={`px-4 py-3 rounded-2xl glass-card hover-lift ${
            isOwn
              ? 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white rounded-br-sm'
              : 'bg-white/10 text-white rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
        
        <div className={`text-xs text-white/50 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity ${
          isOwn ? 'text-right' : 'text-left'
        }`}>
          {format(timestamp, 'HH:mm')}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
