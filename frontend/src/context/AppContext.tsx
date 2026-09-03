"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  telemetry?: any;
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
  isAuthLoading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
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
    setIsAuthLoading(true);
    try {
      // Read authenticated user from the session cookie set by OAuth redirect
      const res = await apiFetch("/api/v1/auth/me");
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      setUser({
        id: data.data.id,
        name: data.data.displayName || data.data.username || "User",
        email: data.data.email,
        avatar: data.data.avatarUrl || "",
        credits: data.data.credits ?? 0,
      });
    } catch {
      // No active session — user is not logged in
      setUser(null);
    } finally {
      setIsAuthLoading(false);
      // Clean up URL if OAuth redirects left ?login=success or ?error=
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.has("login") || url.searchParams.has("error")) {
          url.searchParams.delete("login");
          url.searchParams.delete("error");
          window.history.replaceState({}, "", url.toString());
        }
      }
    }
  };

  const fetchUserChats = async () => {
    try {
      const response = await apiFetch("/api/v1/conversations");

      if (!response.ok) throw new Error("Failed to fetch conversations");
      
      const realChats = await response.json();
      
      // Map API response to frontend Chat interface
      const mappedChats: Chat[] = realChats.data.map((c: any) => ({
        id: c.id,
        userId: c.userId,
        username: c.user?.name ?? "Unknown",
        name: c.title || "New Chat",
        messages: [],
        updatedAt: c.updatedAt,
        createdAt: c.createdAt
      }));

      setChats(mappedChats);
      
      let targetChatId = mappedChats.length > 0 ? mappedChats[0].id : null;
      
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlChatId = params.get("c");
        if (urlChatId && mappedChats.some(c => c.id === urlChatId)) {
          targetChatId = urlChatId;
        }
      }

      if (targetChatId) {
        const chat = mappedChats.find(c => c.id === targetChatId);
        setSelectedChat(chat || null);
        setCurrentChatId(targetChatId);
        
        // Ensure its historical messages are loaded immediately on mount
        try {
          const mRes = await apiFetch(`/api/v1/conversations/${targetChatId}`);
          if (mRes.ok) {
            const data = await mRes.json();
            if (data.data && data.data.messages) {
              const historicalMessages: Message[] = data.data.messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                timestamp: m.createdAt,
                telemetry: m.role === 'assistant' && (m.tokenCount || m.latency) ? {
                  totalTokens: m.tokenCount || 0,
                  promptTokens: 0,
                  completionTokens: m.tokenCount || 0,
                  totalTime: m.latency || 0,
                  promptTime: 0,
                  completionTime: m.latency || 0,
                  speed: (m.latency && m.tokenCount) ? Math.round(m.tokenCount / m.latency) : 0,
                  model: m.model || undefined
                } : undefined
              }));
              setMessages(prev => ({ ...prev, [targetChatId]: historicalMessages }));
            }
          }
        } catch (e) {
          console.error("Failed to fetch initial historical messages", e);
        }
      }
    } catch (e) {
      console.warn("[AppContext] Failed to fetch conversations, using empty state:", e);
      setChats([]);
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
    // 1. Add user message to state immediately
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

    // 2. Prepare an empty bubble for the incoming AI response stream
    const assistantId = generateId();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), assistantMessage],
    }));

    // 3. Connect to actual backend via Server-Sent Events (SSE)
    try {
      const response = await apiFetch("/api/v1/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: chatId, content }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI Core Error Payload:", errorText);
        throw new Error(`Failed to connect to AI Core: ${errorText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let aiContent = "";
      let telemetryData: any = undefined;

      while (true) {
        const { done, value } = await reader.read();
        
        const chunkText = decoder.decode(value, { stream: true });
        const lines = chunkText.split("\n\n").filter(Boolean);

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const parsed = JSON.parse(line.slice(6));
            
            if (parsed.type === "chunk") {
              aiContent += parsed.content;
              
              // RE-RENDER CHAT BUBBLE DURING STREAMING PROCESS
              setMessages(prev => {
                const currentMsgs = prev[chatId] || [];
                const updatedList = [...currentMsgs];
                updatedList[updatedList.length - 1] = { 
                  ...updatedList[updatedList.length - 1], 
                  content: aiContent 
                };
                return { ...prev, [chatId]: updatedList };
              });
              
            } else if (parsed.type === "telemetry") {
              // ATTACH TELEMETRY STATISTICS DATA IF PROVIDED BY GROQ
              telemetryData = parsed.data;
              setMessages(prev => {
                const currentMsgs = prev[chatId] || [];
                const updatedList = [...currentMsgs];
                updatedList[updatedList.length - 1] = { 
                  ...updatedList[updatedList.length - 1], 
                  telemetry: telemetryData 
                };
                return { ...prev, [chatId]: updatedList };
              });
            } else if (parsed.type === "done") {
              // Update timestamp immediately
              setChats(prev => prev.map(chat =>
                chat.id === chatId ? { ...chat, updatedAt: new Date().toISOString() } : chat
              ));
              // Poll for the AI-generated title (backend generates it async after stream)
              // Retry up to 4 times with 1.5s delay to wait for title generation
              (async () => {
                const DEFAULT_TITLES = ["New Chat", "New Conversation", ""];
                for (let attempt = 0; attempt < 4; attempt++) {
                  await new Promise(r => setTimeout(r, 1500));
                  try {
                    const titleRes = await apiFetch(`/api/v1/conversations/${chatId}`);
                    if (titleRes.ok) {
                      const titleData = await titleRes.json();
                      const newTitle = titleData?.data?.title;
                      if (newTitle && !DEFAULT_TITLES.includes(newTitle)) {
                        setChats(prev => prev.map(chat =>
                          chat.id === chatId ? { ...chat, name: newTitle } : chat
                        ));
                        break; // Got a real title, stop polling
                      }
                    }
                  } catch {
                    // Non-critical
                  }
                }
              })();
            }
          }
        }
        
        if (done) break;
      }
    } catch (error) {
      console.error("[Stream Error]", error);
      // Error state fallback
      setMessages(prev => {
        const msgs = prev[chatId] || [];
        msgs[msgs.length - 1].content = "⚠️ *Failed to reach AI Core. Make sure the backend server is running and the auth token is valid.*";
        return { ...prev, [chatId]: [...msgs] };
      });
    }
  }, []);

  const createChat = useCallback(async (initialMessage?: string): Promise<Chat> => {
    // Call backend to create a real conversation and get a valid UUID
    let newConversationId = "";
    try {
      const res = await apiFetch("/api/v1/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat" })
      });
      if (!res.ok) throw new Error("Failed to create conversation in database");
      const json = await res.json();
      newConversationId = json.data.id;
    } catch (e) {
      console.error(e);
      throw e; // Halt execution if we can't get a proper ID
    }

    const newChat: Chat = {
      id: newConversationId,
      userId: user?.id || "",
      username: user?.name || "User",
      name: "New Chat",
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
  }, [sendMessage, user]);

  const deleteChat = useCallback(async (chatId: string) => {
    // Delete in frontend
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
    
    // Delete in database
    try {
      await apiFetch(`/api/v1/conversations/${chatId}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete chat", e);
    }
  }, [currentChatId]);

  const setCurrentChat = useCallback(async (id: string | null) => {
    setCurrentChatId(id);
    
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (id) {
        url.searchParams.set("c", id);
      } else {
        url.searchParams.delete("c");
      }
      window.history.replaceState({}, "", url.toString());
    }

    if (id) {
      const chat = chats.find(c => c.id === id);
      setSelectedChat(chat || null);
      
      // Fetch history if not already loaded locally
      if (!messages[id] || messages[id].length === 0) {
        try {
          const res = await apiFetch(`/api/v1/conversations/${id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.data && data.data.messages) {
              const historicalMessages: Message[] = data.data.messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                timestamp: m.createdAt,
                telemetry: m.role === 'assistant' && (m.tokenCount || m.latency) ? {
                  totalTokens: m.tokenCount || 0,
                  promptTokens: 0,
                  completionTokens: m.tokenCount || 0,
                  totalTime: m.latency || 0,
                  promptTime: 0,
                  completionTime: m.latency || 0,
                  speed: (m.latency && m.tokenCount) ? Math.round(m.tokenCount / m.latency) : 0,
                  model: m.model || undefined
                } : undefined
              }));
              setMessages(prev => ({ ...prev, [id]: historicalMessages }));
            }
          }
        } catch (e) {
          console.error("Failed to fetch historical messages", e);
        }
      }
    } else {
      setSelectedChat(null);
    }
  }, [chats, messages]);

  const signOut = async () => {
    try {
      // Tell the backend to clear the session cookie
      await apiFetch("/api/v1/auth/logout", {
        method: "POST",
      });
    } catch {
      // Proceed with local cleanup even if logout endpoint fails
    } finally {
      setUser(null);
      setChats([]);
      setSelectedChat(null);
      setCurrentChatId(null);
      setMessages({});
      router.push("/login");
    }
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
    isAuthLoading,
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