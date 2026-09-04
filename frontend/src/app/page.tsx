"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageSquare, Sparkles } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  telemetry?: any;
}

export default function ChatPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <ChatPageContent />
    </SidebarProvider>
  );
}

function ChatPageContent() {
  const { openMobile } = useSidebar();
  const { 
    user, chats, currentChatId, messages, sendMessage, createChat, setCurrentChat,
    isAuthLoading, isMessagesLoading
  } = useAppContext();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(c => c.id === currentChatId);
  const currentMessages = currentChatId ? messages[currentChatId] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSend = async (message: string) => {
    if (!currentChatId) {
      const newChat = await createChat(message);
      setCurrentChat(newChat.id);
      return;
    }
    setIsLoading(true);
    await sendMessage(currentChatId, message);
    setIsLoading(false);
  };

  const groupedMessages = currentMessages.reduce((groups, message, index) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push({ ...message, index } as Message & { index: number });
    return groups;
  }, {} as Record<string, (Message & { index: number })[]>);

  return (
    <>
      <AppSidebar />
      <SidebarInset className="bg-background flex flex-col h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-sm font-medium text-foreground truncate max-w-xs">
              {currentChat?.name || "New Conversation"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors">
              <Sparkles size={18} />
            </div>
          </div>
        </header>

        <div
          ref={messagesContainerRef}
          className={cn(
            "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent py-4",
            openMobile && "overflow-hidden"
          )}
        >
          {isAuthLoading || isMessagesLoading ? (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full px-4 h-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"} w-full`}>
                  <div className={`w-[60%] sm:w-[45%] h-16 rounded-2xl animate-pulse ${
                    i % 2 === 0 ? "bg-primary/20" : "bg-muted"
                  }`} />
                </div>
              ))}
            </div>
          ) : currentChatId && currentMessages.length > 0 ? (
            <div className="flex flex-col gap-1 max-w-3xl mx-auto w-full">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/60 px-4">
                    <span className="font-medium">
                      {date === new Date().toDateString() ? "Today" :
                       date === new Date(Date.now() - 86400000).toDateString() ? "Yesterday" : date}
                    </span>
                  </div>
                  {msgs.map(({ id, role, content, timestamp, telemetry }, index) => (
                    <ChatMessage
                      key={id || `${timestamp}-${index}`}
                      role={role}
                      content={content}
                      timestamp={timestamp}
                      telemetry={telemetry}
                    />
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <MessageSquare size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                How can I help you today?
              </h2>
              <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                Ask questions, get analysis, write code, or just chat — I'm here to help with whatever you need.
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 pb-4 px-4">
          <ChatInput onSend={handleSend} />
        </div>
      </SidebarInset>
    </>
  );
}