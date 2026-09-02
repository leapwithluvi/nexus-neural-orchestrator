import { Plus, BookOpen, Shield, Cpu, Settings, LogOut, User, MessageSquare } from "lucide-react";

export const sidebarData = {
  systemMenu: [
    {
      title: "New Chat",
      url: "/chat/new",
      icon: Plus,
    },
    {
      title: "Overview",
      url: "/overview",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
  footerMenu: {
    credits: {
      title: "Credits",
      url: "/credits",
      icon: Cpu,
      unit: "Credits",
    },
  },
};