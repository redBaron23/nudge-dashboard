"use client";

import { LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar({
  onSignOut,
  onMenuClick,
}: {
  onSignOut?: () => void;
  onMenuClick?: () => void;
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800/50 px-6">
      {onMenuClick ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden text-zinc-400 hover:text-zinc-50"
        >
          <Menu className="size-5" />
        </Button>
      ) : (
        <div />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-300 outline-none hover:text-zinc-50 transition-colors">
          <Avatar size="sm">
            <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-xs">
              PT
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">Pato Toledo</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onSignOut}>
            <LogOut className="mr-2 size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
