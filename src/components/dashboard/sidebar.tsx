"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Smartphone,
  Settings,
  ChevronsLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/conversations", icon: MessageSquare, label: "Conversations" },
  { href: "/dashboard/whatsapp", icon: Smartphone, label: "WhatsApp" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  isMobile?: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, isMobile, onToggle }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-zinc-800/50 bg-sidebar transition-all duration-300 ease-in-out",
        isMobile ? "w-[250px]" : collapsed ? "w-[60px]" : "w-[250px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4">
        <Image src="/logo.png" alt="Nudge" width={32} height={32} className="shrink-0" />
        <span
          className={cn(
            "text-lg font-bold text-zinc-50 overflow-hidden whitespace-nowrap transition-all duration-300",
            collapsed ? "max-w-0 opacity-0" : "max-w-[120px] opacity-100"
          )}
        >
          nudge
        </span>
        <span
          className={cn(
            "size-1.5 rounded-full bg-indigo-500 shrink-0 transition-all duration-300",
            collapsed ? "opacity-0 w-0" : "opacity-100"
          )}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-500/15 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-indigo-500" />
              )}
              <item.icon className="size-4 shrink-0" />
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-all duration-300",
                  collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Built with Claude */}
      <p
        className={cn(
          "text-[10px] text-zinc-600 text-center transition-all duration-300",
          collapsed && !isMobile ? "opacity-0 h-0" : "opacity-100 py-2"
        )}
      >
        Built with Claude
      </p>

      {/* Collapse toggle */}
      {!isMobile && (
        <div className="border-t border-zinc-800/50 p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-full text-zinc-400 hover:text-zinc-50"
          >
            <ChevronsLeft
              className={cn(
                "size-4 transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      )}
    </aside>
  );

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/60 transition-opacity duration-300",
            collapsed ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          onClick={onToggle}
        />
        {/* Sidebar drawer */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 transition-transform duration-300",
            collapsed ? "-translate-x-full" : "translate-x-0"
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return sidebarContent;
}
