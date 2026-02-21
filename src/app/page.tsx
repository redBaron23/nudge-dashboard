"use client";

import Image from "next/image";
import Link from "next/link";
import { Bot, MessageSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Bot,
    title: "Smart Onboarding",
    description: "Automated flows that convert and activate new users from day one.",
  },
  {
    icon: MessageSquare,
    title: "24/7 AI Support",
    description: "Instant answers on WhatsApp & Telegram — no tickets, no wait.",
  },
  {
    icon: Zap,
    title: "Live in Minutes",
    description: "Connect your channels and start engaging users right away.",
  },
];

export default function LandingPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-16 px-6 bg-zinc-950"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, rgb(9,9,11) 70%)",
      }}
    >
      {/* Hero */}
      <div className="animate-fade-in-up flex flex-col items-center gap-4 text-center">
        <Image
          src="/logo.png"
          alt="Nudge logo"
          width={80}
          height={80}
          priority
        />
        <h1 className="text-4xl font-bold text-zinc-50">
          nudge
          <span className="ml-1 inline-block size-2.5 rounded-full bg-indigo-500" />
        </h1>
        <p className="max-w-md text-lg text-zinc-400">
          AI-powered support & onboarding on WhatsApp and Telegram.
        </p>
      </div>

      {/* Feature grid */}
      <div className="animate-fade-in-up grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl"
          >
            <f.icon className="mb-3 size-6 text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-50">{f.title}</h3>
            <p className="mt-1 text-sm text-zinc-400">{f.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="animate-fade-in-up">
        <Button asChild className="bg-indigo-500 hover:bg-indigo-600 px-8">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
