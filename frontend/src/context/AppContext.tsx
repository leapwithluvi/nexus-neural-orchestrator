"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Chat {
  id: string;
  userId: string;
  username: string;
  name: string;
  messages: Message[];
  updatedAt: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  credits: number;
}

const dummyUserData: User = {
  id: "692a8967e7751a54854322b8",
  name: "Leap with Luvi",
  email: "leapwithluvi@gmail.com",
  avatar: "https://i.pravatar.cc/150?img=12",
  credits: 100,
};

const generateId = () => Math.random().toString(36).substring(2, 15);

const dummyChats: Chat[] = [
  {
    id: "1",
    userId: "692a8967e7751a54854322b8",
    username: "Leap with Luvi",
    name: "Cara membuat AI Chatbot",
    messages: [
      { id: generateId(), role: "user", content: "How do I create an AI chatbot?", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
      { id: generateId(), role: "assistant", content: "Creating an AI chatbot involves several steps:\n\n1. **Choose your approach**: Decide between rule-based, retrieval-based, or generative AI\n2. **Select a framework**: Popular options include LangChain, LlamaIndex, or custom solutions\n3. **Set up the backend**: API integration with LLM providers (OpenAI, Anthropic, etc.)\n4. **Design the conversation flow**: Plan intents, entities, and responses\n5. **Build the frontend**: Chat interface with real-time messaging\n6. **Add memory**: Implement conversation history and context\n7. **Test and iterate**: Refine based on user feedback\n\nWould you like me to elaborate on any specific step?", timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString() },
    ],
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "2",
    userId: "692a8967e7751a54854322b8",
    username: "Leap with Luvi",
    name: "Perbedaan React dan Vue",
    messages: [
      { id: generateId(), role: "user", content: "What are the main differences between React and Vue?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
      { id: generateId(), role: "assistant", content: "Both are excellent frontend frameworks, but they have different philosophies:\n\n**React**:\n- Library (not a framework) - more flexible but requires more decisions\n- Virtual DOM with unidirectional data flow\n- JSX for templating\n- Large ecosystem, backed by Meta\n- Steeper learning curve for beginners\n\n**Vue**:\n- Progressive framework - can adopt incrementally\n- Template-based syntax (similar to HTML)\n- Two-way data binding with v-model\n- Official router and state management (Vue Router, Pinia)\n- Gentler learning curve, great documentation\n\n**Choose React if**: You want maximum flexibility, large ecosystem, or work with React Native\n**Choose Vue if**: You prefer convention over configuration, easier learning curve, or incremental adoption", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 30).toISOString() },
    ],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: "3",
    userId: "692a8967e7751a54854322b8",
    username: "Leap with Luvi",
    name: "Tips belajar Machine Learning",
    messages: [],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "4",
    userId: "692a8967e7751a54854322b8",
    username: "Leap with Luvi",
    name: "Setup Ollama di Linux",
    messages: [],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: "5",
    userId: "692a8967e7751a54854322b8",
    username: "Leap with Luvi",
    name: "Apa itu Retrieval Augmented Generation?",
    messages: [],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
  },
  {
    id: "6",
    userId: "692a8967e7751a54854322b8",
    username: "Leap with Luvi",
    name: "Advanced CSS Techniques",
    messages: [],
    updatedAt: "2026-02-15T10:00:00.000Z",
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "7",
    userId: "692a8967e7751a54854322b8",
    username: "Leap with Luvi",
    name: "Introduction to TypeScript",
    messages: [],
    updatedAt: "2025-12-20T15:30:00.000Z",
    createdAt: "2025-11-20T15:30:00.000Z",
  },
  {
    id: "8",
    userId: "692a8967e7751a54854322b8",
    username: "Leap with Luvi",
    name: "History of AI",
    messages: [],
    updatedAt: "2025-12-05T09:00:00.000Z",
    createdAt: "2025-10-05T09:00:00.000Z",
  },
];

interface AppContextType {
  router: ReturnType<typeof useRouter>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedChat: Chat | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  currentChatId: string | null;
  setCurrentChat: (id: string | null) => void;
  messages: Record<string, Message[]>;
  sendMessage: (chatId: string, content: string) => Promise<void>;
  createChat: (initialMessage?: string) => Promise<Chat>;
  deleteChat: (chatId: string) => void;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  fetchUser: () => Promise<void>;
  signOut: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchUser = async () => {
    setUser(dummyUserData);
  };

  const fetchUserChats = async () => {
    setChats(dummyChats);
    if (dummyChats.length > 0) {
      setSelectedChat(dummyChats[0]);
      setCurrentChatId(dummyChats[0].id);
      if (dummyChats[0].messages.length > 0) {
        setMessages(prev => ({ ...prev, [dummyChats[0].id]: dummyChats[0].messages }));
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChats([]);
      setSelectedChat(null);
      setCurrentChatId(null);
    }
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, []);

  const sendMessage = useCallback(async (chatId: string, content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), userMessage],
    }));

    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? { ...chat, messages: [...chat.messages, userMessage], updatedAt: new Date().toISOString() }
        : chat
    ));

    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const responses = [
      "I understand. Let me help you with that.",
      "That's a great question. Here's what I think...",
      "I can assist with that. Here are the key points...",
      "Let me break this down for you...",
      "Based on what you've shared, here's my analysis...",
    ];

    const assistantMessage: Message = {
      id: generateId(),
      role: "assistant",
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), assistantMessage],
    }));

    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? { ...chat, messages: [...chat.messages, assistantMessage], updatedAt: new Date().toISOString() }
        : chat
    ));
  }, []);

  const createChat = useCallback(async (initialMessage?: string): Promise<Chat> => {
    const newChat: Chat = {
      id: generateId(),
      userId: dummyUserData.id,
      username: dummyUserData.name,
      name: initialMessage ? initialMessage.slice(0, 50) : "New Chat",
      messages: [],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setChats(prev => [newChat, ...prev]);
    setSelectedChat(newChat);
    setCurrentChatId(newChat.id);
    setMessages(prev => ({ ...prev, [newChat.id]: [] }));

    if (initialMessage) {
      await sendMessage(newChat.id, initialMessage);
    }

    return newChat;
  }, [sendMessage]);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    setMessages(prev => {
      const next = { ...prev };
      delete next[chatId];
      return next;
    });
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setSelectedChat(null);
    }
  }, [currentChatId]);

  const setCurrentChat = useCallback((id: string | null) => {
    setCurrentChatId(id);
    if (id) {
      const chat = chats.find(c => c.id === id);
      setSelectedChat(chat || null);
    } else {
      setSelectedChat(null);
    }
  }, [chats]);

  const signOut = () => {
    setUser(null);
    setChats([]);
    setSelectedChat(null);
    setCurrentChatId(null);
    setMessages({});
  };

  const value = {
    router,
    user,
    setUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    currentChatId,
    setCurrentChat,
    messages,
    sendMessage,
    createChat,
    deleteChat,
    theme,
    setTheme,
    fetchUser,
    signOut,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};