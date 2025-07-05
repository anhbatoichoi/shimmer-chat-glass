import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  sender: string;
  type?: "text" | "image" | "file";
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  timestamp: string;
  isGroup?: boolean;
  members?: Contact[];
}

interface ChatState {
  chatSessions: { [key: string]: Message[] };
  socket: WebSocket | null;
  username: string;
  messages: Message[];
  contacts: Contact[];
  selectedContact: Contact | null;
  isTyping: boolean;
  isConnected: boolean;
  currentUser: {
    id: string;
    name: string;
    avatar: string;
  } | null;
}

type ChatAction =
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_CONTACTS"; payload: Contact[] }
  | { type: "ADD_CONTACT"; payload: Contact }
  | { type: "SET_SELECTED_CONTACT"; payload: Contact | null }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "SET_CONNECTION_STATUS"; payload: boolean }
  | { type: "SET_CURRENT_USER"; payload: ChatState["currentUser"] }
  | { type: "SET_USERNAME"; payload: string }
  | { type: "SET_CHAT_SESSION"; payload: { [key: string]: Message[] } }
  | {
      type: "CONNECT_SOCKET";
      payload: WebSocket;
    }
  | {
      type: "UPDATE_CONTACT";
      payload: { id: string; updates: Partial<Contact> };
    }
  | { type: "REMOVE_CONTACT"; payload: string };

const initialState: ChatState = {
  chatSessions: {
    "": [],
  },

  socket: null,
  username: "",
  messages: [],
  contacts: [
    {
      id: "1",
      name: "Quigiaosu",
      avatar: "https://avatars.githubusercontent.com/u/93850311?v=4",
      isOnline: true,
      lastMessage: "That sounds awesome!",
      timestamp: "2 min",
    },
    {
      id: "2",
      name: "Alex Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      lastMessage: "Let's catch up soon!",
      timestamp: "1 hour",
    },
    {
      id: "3",
      name: "Maya Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      isOnline: false,
      lastMessage: "Thanks for the help!",
      timestamp: "3 hours",
    },
    {
      id: "4",
      name: "David Kim",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      lastMessage: "See you tomorrow",
      timestamp: "1 day",
    },
  ],
  selectedContact: {
    id: "1",
    name: "Quigiaosu",
    avatar: "https://avatars.githubusercontent.com/u/93850311?v=4",
    isOnline: true,
    lastMessage: "That sounds awesome!",
    timestamp: "2 min",
  },
  isTyping: false,
  isConnected: false,
  currentUser: {
    id: "current-user",
    name: "You",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
  },
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "SET_CHAT_SESSION":
      return {
        ...state,
        chatSessions: {
          ...state.chatSessions,
          ...action.payload,
        },
      };

    case "CONNECT_SOCKET":
      return { ...state, socket: action.payload };
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };

    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };

    case "SET_CONTACTS":
      return { ...state, contacts: action.payload };

    case "ADD_CONTACT":
      return { ...state, contacts: [action.payload, ...state.contacts] };

    case "SET_SELECTED_CONTACT":
      return { ...state, selectedContact: action.payload };

    case "SET_TYPING":
      return { ...state, isTyping: action.payload };

    case "SET_CONNECTION_STATUS":
      return { ...state, isConnected: action.payload };

    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };

    case "UPDATE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === action.payload.id
            ? { ...contact, ...action.payload.updates }
            : contact
        ),
      };

    case "REMOVE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.filter(
          (contact) => contact.id !== action.payload
        ),
      };

    default:
      return state;
  }
};

interface ChatContextType extends ChatState {
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string) => void;
  selectContact: (contact: Contact) => void;
  createGroup: (name: string, members: Contact[]) => void;
  updateContactStatus: (contactId: string, isOnline: boolean) => void;
  addContact: (contact: Contact) => void;
  updateChatSession: (username: string, message: Message) => void;
  setSelectedContact: (contact: Contact) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  useEffect(() => {
    dispatch({
      type: "SET_CONTACTS",
      payload: state.contacts.filter(
        (contact) => contact.name !== state.username
      ),
    });
  }, [state.username]);

  useEffect(() => {
    dispatch({
      type: "SET_SELECTED_CONTACT",
      payload: initialState.contacts[0],
    });
  }, []);
  // Auto-response simulation
  useEffect(() => {
    if (state.messages.length > 0) {
      const lastMessage = state.messages[state.messages.length - 1];

      if (lastMessage.isOwn && state.selectedContact) {
        // Simulate typing
        setTimeout(() => {
          dispatch({ type: "SET_TYPING", payload: true });
        }, 500);

        // Simulate response
        setTimeout(() => {
          dispatch({ type: "SET_TYPING", payload: false });

          const responses = [
            "That's really interesting! 😊",
            "I totally agree with you!",
            "Thanks for sharing that with me ✨",
            "Wow, that's amazing!",
            "I'd love to know more about that 🤔",
          ];

          const response: Message = {
            id: (Date.now() + Math.random()).toString(),
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            isOwn: false,
            sender: state.selectedContact.name,
          };

          dispatch({ type: "ADD_MESSAGE", payload: response });
        }, 2000);
      }
    }
  }, [state.messages, state.selectedContact]);

  useEffect(() => {
    console.log("Chat sessions updated:", state.chatSessions);
  }, [state.chatSessions]);
  const sendMessage = (content: string) => {
    if (!content.trim() || !state.currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      isOwn: true,
      sender: state.currentUser.name,
    };

    dispatch({ type: "ADD_MESSAGE", payload: newMessage });
  };

  const selectContact = (contact: Contact) => {
    dispatch({ type: "SET_SELECTED_CONTACT", payload: contact });
    dispatch({ type: "SET_CHAT_SESSION", payload: { [contact.name]: [] } });
    // Clear messages when switching contacts (optional)
    // dispatch({ type: 'SET_MESSAGES', payload: [] });
  };

  const updateChatSession = (username: string, message: Message) => {
    dispatch({
      type: "SET_CHAT_SESSION",
      payload: {
        [username]: [...(state.chatSessions[username] || []), message],
      },
    });
  };

  const createGroup = (name: string, members: Contact[]) => {
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

    dispatch({ type: "ADD_CONTACT", payload: newGroup });
    dispatch({ type: "SET_SELECTED_CONTACT", payload: newGroup });
  };

  const updateContactStatus = (contactId: string, isOnline: boolean) => {
    dispatch({
      type: "UPDATE_CONTACT",
      payload: { id: contactId, updates: { isOnline } },
    });
  };

  const addContact = (contact: Contact) => {
    dispatch({ type: "ADD_CONTACT", payload: contact });
  };

  const setSelectedContact = (contact: Contact) => {
    dispatch({ type: "SET_SELECTED_CONTACT", payload: contact });
  };

  const contextValue: ChatContextType = {
    ...state,
    dispatch,
    sendMessage,
    selectContact,
    createGroup,
    updateContactStatus,
    updateChatSession,
    addContact,
    setSelectedContact,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
