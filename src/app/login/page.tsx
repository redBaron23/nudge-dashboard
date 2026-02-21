"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("yo@patriciotoledo.ar");
  const [password, setPassword] = useState("SEGa1122");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === "yo@patriciotoledo.ar" && password === "SEGa1122") {
      localStorage.setItem("nudge-auth", "true");
      router.push("/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-zinc-950"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, rgb(9,9,11) 70%)",
      }}
    >
      <div className="animate-fade-in-up w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-xl">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Image
            src="/logo.png"
            alt="Nudge logo"
            width={80}
            height={80}
            priority
          />
          <h1 className="text-2xl font-bold text-zinc-50">
            nudge
            <span className="ml-1 inline-block size-2 rounded-full bg-indigo-500" />
          </h1>
          <p className="text-sm text-zinc-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-zinc-300">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-zinc-300">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600"
          >
            Sign in
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            &larr; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
