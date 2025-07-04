
import { useState, KeyboardEvent } from "react";
import { Send, Paperclip, Smile, Mic } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  placeholder?: string;
}

const ChatInput = ({ value, onChange, onSend, placeholder = "Type a message..." }: ChatInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
    }
  };

  return (
    <div className={`glass-card rounded-2xl p-3 transition-all duration-300 ${
      isFocused ? 'ring-2 ring-sky-400/50' : ''
    }`}>
      <div className="flex items-end space-x-3">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white/80">
          <Paperclip className="w-5 h-5" />
        </button>
        
        <div className="flex-1 min-h-[40px] max-h-32">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full bg-transparent text-white placeholder-white/50 resize-none outline-none text-sm leading-relaxed py-2"
            rows={1}
            style={{
              minHeight: '24px',
              maxHeight: '120px',
              overflowY: value.split('\n').length > 3 ? 'scroll' : 'hidden'
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white/80">
            <Smile className="w-5 h-5" />
          </button>
          
          {value.trim() ? (
            <button
              onClick={handleSend}
              className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 transition-all duration-300 hover:scale-105 text-white"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white/80">
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
