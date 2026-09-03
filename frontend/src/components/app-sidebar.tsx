"use client";

import * as React from "react";
import {
  Search,
  MessageSquare,
  Settings,
  Plus,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Info,
  User,
} from "lucide-react";

import { NavChats } from "@/components/nav-chats";
import { NavUser } from "@/components/nav-user";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";

import { userProfile } from "@/data/profile";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const context = useAppContext();
  const user = context?.user;
  const chats = context?.chats ?? [];
  const currentChatId = context?.currentChatId;
  const { state, toggleSidebar } = useSidebar();
  const [search, setSearch] = React.useState("");

  const groupedChats = chats.reduce((acc, chat) => {
    const date = new Date(chat.updatedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let label = "Older";
    if (date.toDateString() === today.toDateString()) label = "Today";
    else if (date.toDateString() === yesterday.toDateString()) label = "Yesterday";
    else if (date > new Date(today.getFullYear(), today.getMonth(), 1)) label = "This Month";
    else label = date.toLocaleDateString([], { month: "long", year: "numeric" });

    if (!acc[label]) acc[label] = [];
    acc[label].push({ name: chat.name, id: chat.id });
    return acc;
  }, {} as Record<string, { name: string; id: string }[]>);

  const searchResults = chats
    .filter((chat) => chat.name.toLowerCase().includes(search.toLowerCase()))
    .map((chat) => ({ name: chat.name, id: chat.id }));

  const handleSelectChat = (id: string) => {
    context?.setCurrentChat(id);
  };

  const handleNewChat = async () => {
    const newChat = await context?.createChat("");
    if (newChat) {
      context?.setCurrentChat(newChat.id);
    }
  };

  const handleDeleteChat = (id: string) => {
    context?.deleteChat(id);
  };

  const handleRenameChat = async (id: string, newName: string) => {
    // Optimistic UI update
    context?.setChats(prev => prev.map(chat =>
      chat.id === id ? { ...chat, name: newName, updatedAt: new Date().toISOString() } : chat
    ));

    // Persist to backend database
    try {
      await apiFetch(`/api/v1/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newName }),
      });
    } catch (error) {
      console.error("Failed to rename chat on backend", error);
    }
  };

  return (
    <Sidebar variant="sidebar" className="border-r border-border bg-background" {...props}>
      <SidebarHeader className="border-b border-border p-4">
        <SidebarMenuButton asChild size="lg" className="hover:bg-transparent p-0 w-full justify-start">
          <Link href="/" className="flex items-center gap-3 w-full">
            <span className="font-semibold text-lg truncate">Nexus AI</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto p-3 gap-1">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="default"
                className="gap-3 rounded-xl px-3 py-2.5 font-medium"
                onClick={handleNewChat}
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
                <span className="truncate">New Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="pt-2">
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="default" className="gap-3 rounded-xl px-3 py-2.5 font-medium">
                  <Link href="/overview">
                    <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
                    <span className="truncate">Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="default" className="gap-3 rounded-xl px-3 py-2.5 font-medium">
                  <Link href="/about">
                    <Info className="w-5 h-5 text-muted-foreground" />
                    <span className="truncate">About</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="pt-2">
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            History
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                type="text"
                placeholder="Search chats..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/50 border-border/50 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="pt-2">
          {search ? (
            searchResults.length > 0 && (
              <NavChats
                chats={searchResults}
                title="Search Results"
                onSelectChat={handleSelectChat}
                onDeleteChat={handleDeleteChat}
                onRenameChat={handleRenameChat}
              />
            )
          ) : (
            <>
              {Object.entries(groupedChats).map(([label, chatList]) => (
                <NavChats
                  key={label}
                  chats={chatList}
                  title={label}
                  onSelectChat={handleSelectChat}
                  onDeleteChat={handleDeleteChat}
                  onRenameChat={handleRenameChat}
                />
              ))}
              {chats.length === 0 && !search && (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground/60">
                  No conversations yet
                </div>
              )}
            </>
          )}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="default" className="gap-3 rounded-xl px-3 py-2.5 font-medium justify-start">
                <Link href="/settings">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <span className="truncate">Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {context?.isAuthLoading ? (
              <SidebarMenuItem>
                <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 opacity-50">
                  <div className="w-5 h-5 rounded-full bg-muted animate-pulse"></div>
                  <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                </div>
              </SidebarMenuItem>
            ) : user ? (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size="default"
                  className="gap-3 rounded-xl px-3 py-2.5 font-medium justify-start text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <button onClick={() => context?.signOut?.()}>
                    <LogOut className="w-5 h-5" />
                    <span className="truncate">Sign Out</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="default" className="gap-3 rounded-xl px-3 py-2.5 font-medium justify-start text-primary hover:bg-primary/10">
                  <Link href="/login">
                    <User className="w-5 h-5" />
                    <span className="truncate">Sign In</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {context?.isAuthLoading ? (
          <div className="pt-3 border-t border-border flex items-center p-2 opacity-50">
            <div className="h-8 w-8 rounded bg-muted animate-pulse mr-2"></div>
            <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
          </div>
        ) : user && (
          <div className="pt-3 border-t border-border">
             {/* Supply dynamic user from context instead of hardcoded userProfile */}
            <NavUser user={user as any} />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}