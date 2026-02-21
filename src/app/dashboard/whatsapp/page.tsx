"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Smartphone, Loader2, Wifi, WifiOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const API = "https://ok-nudge.up.railway.app";

type Status = "loading" | "waiting" | "connected" | "disconnected" | "unknown";

export default function WhatsAppPage() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>("loading");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        const res = await fetch(`${API}/api/whatsapp/qr`);
        const ct = res.headers.get("content-type") ?? "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data.status === "connected") {
            setStatus("connected");
            toast.success("WhatsApp connected successfully");
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
          }
        }
        // HTML response = QR page still showing
        setStatus("waiting");
      } catch {
        setStatus("unknown");
      }
    }

    checkConnection();
    intervalRef.current = setInterval(checkConnection, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${API}/api/nudge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, userName: name, token }),
      });
      if (!res.ok) throw new Error();
      toast.success("Nudge sent successfully");
    } catch {
      toast.error("Failed to send nudge");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Smartphone size={28} className="text-zinc-50" />
          <h1 className="text-3xl font-bold text-zinc-50">
            WhatsApp Connection
          </h1>
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your WhatsApp connection and send test nudges.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — QR Code */}
        <div className="lg:col-span-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
          {status === "connected" ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <span className="w-4 h-4 rounded-full bg-emerald-500" />
              <p className="text-lg font-semibold text-emerald-400">WhatsApp connected successfully</p>
            </div>
          ) : (
            <>
              <div className="max-w-[350px] mx-auto">
                <div className="border-2 border-zinc-700 rounded-2xl overflow-hidden bg-zinc-950">
                  {/* Title bar */}
                  <div className="bg-zinc-800 px-4 py-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm text-zinc-300">WhatsApp Web</span>
                  </div>
                  {/* QR iframe */}
                  <iframe
                    src={`${API}/api/whatsapp/qr`}
                    className="w-full aspect-square bg-white border-0"
                    title="WhatsApp QR Code"
                  />
                </div>
              </div>
              <p className="text-sm text-zinc-400 text-center mt-4">
                Scan with WhatsApp to connect
              </p>
            </>
          )}
        </div>

        {/* Right — Send Test Nudge */}
        <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-zinc-50 mb-4">
            Send Test Nudge
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300">Phone</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="5492211234567"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300">Token</label>
              <Input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="yaturno_uuid-here"
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={sending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
            >
              {sending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Nudge"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-50 mb-3">
          Connection Status
        </h2>
        {status === "loading" ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          <div className="flex items-center gap-2">
            {status === "connected" && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <Wifi size={16} className="text-emerald-400" />
                <span className="text-sm text-emerald-400">Connected</span>
              </>
            )}
            {status === "waiting" && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-sm text-yellow-400">Waiting for scan</span>
              </>
            )}
            {status === "disconnected" && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <WifiOff size={16} className="text-red-400" />
                <span className="text-sm text-red-400">Disconnected</span>
              </>
            )}
            {status === "unknown" && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-sm text-yellow-400">Unknown</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
