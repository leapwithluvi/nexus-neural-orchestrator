"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2, Edit2, Loader2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatItem {
  name: string;
  id: string;
}

export function NavChats({
  chats,
  title = "Chats",
  onSelectChat,
  onDeleteChat,
  onRenameChat,
}: {
  chats: ChatItem[];
  title?: string;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newName: string) => void;
}) {
  if (chats.length === 0) return null;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteDialogOpen(id);
  };

  const handleRenameClick = (id: string, currentName: string) => {
    setRenameValue(currentName);
    setRenameDialogOpen(id);
  };

  const confirmDelete = () => {
    if (deleteDialogOpen) {
      setIsDeleting(deleteDialogOpen);
      onDeleteChat(deleteDialogOpen);
      setDeleteDialogOpen(null);
    }
  };

  const confirmRename = () => {
    if (renameDialogOpen && renameValue.trim()) {
      setIsRenaming(true);
      onRenameChat(renameDialogOpen, renameValue.trim());
      setRenameDialogOpen(null);
      setRenameValue("");
    }
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </SidebarGroupLabel>
        <SidebarMenu className="gap-0.5">
          {chats.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                className={cn(
                  "rounded-xl hover:bg-muted px-3 py-2 gap-3 transition-colors text-left w-full justify-start",
                  "data-[state=open]:bg-muted data-[state=open]:text-foreground"
                )}
                onClick={() => onSelectChat(item.id)}
              >
                <span className="flex-1 text-sm font-medium truncate">{item.name}</span>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction className="bg-transparent hover:bg-muted rounded-xl">
                    <MoreHorizontal size={14} />
                    <span className="sr-only">Options</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-44 rounded-xl border-border bg-background shadow-lg">
                  <DropdownMenuItem
                    className="flex items-center gap-2 rounded-t-xl text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleRenameClick(item.id, item.name)}
                  >
                    <Edit2 size={14} />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="mx-1" />
                  <DropdownMenuItem
                    variant="destructive"
                    className="flex items-center gap-2 rounded-b-xl text-sm font-medium cursor-pointer"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialogOpen} onOpenChange={(open) => !open && setDeleteDialogOpen(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(null)} disabled={isDeleting === deleteDialogOpen}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting === deleteDialogOpen}>
              {isDeleting === deleteDialogOpen ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={!!renameDialogOpen} onOpenChange={(open) => !open && setRenameDialogOpen(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
            <DialogDescription>
              Enter a new name for this conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="Conversation name"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && confirmRename()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(null)} disabled={isRenaming}>
              Cancel
            </Button>
            <Button onClick={confirmRename} disabled={isRenaming || !renameValue.trim()}>
              {isRenaming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}