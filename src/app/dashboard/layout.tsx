"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("nudge-auth") !== "true") {
      router.push("/login");
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    function handleChange(e: MediaQueryListEvent | MediaQueryList) {
      setIsMobile(e.matches);
      if (e.matches) setCollapsed(true);
    }
    handleChange(mql);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // Collapse sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [pathname, isMobile]);

  const handleMenuClick = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  function handleSignOut() {
    localStorage.removeItem("nudge-auth");
    router.push("/login");
  }

  if (!isAuthed) return null;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        isMobile={isMobile}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onSignOut={handleSignOut} onMenuClick={isMobile ? handleMenuClick : undefined} />
        <main className="flex-1 overflow-y-auto p-6">
          <div key={pathname} className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
