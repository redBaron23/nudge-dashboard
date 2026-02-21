"use client";

import { useEffect, useState } from "react";
import { MessageSquare, CheckCircle, Clock, TrendingUp } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Conversation {
  id: number;
  externalId: string;
  channel: string;
  status: "completed" | "active" | "reviewing";
  collectedData: { business_name?: string; [key: string]: unknown };
  token: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  active: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  reviewing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://ok-nudge.up.railway.app/api/conversations")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
        return res.json();
      })
      .then((data) => setConversations(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const total = conversations.length;
  const completed = conversations.filter((c) => c.status === "completed").length;
  const inProgress = conversations.filter((c) => c.status === "active").length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const recent = [...conversations]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const stats = [
    { icon: MessageSquare, value: total, label: "Total Conversations" },
    { icon: CheckCircle, value: completed, label: "Completed" },
    { icon: Clock, value: inProgress, label: "In Progress" },
    { icon: TrendingUp, value: `${rate}%`, label: "Completion Rate" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50">Overview</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Conversation stats and recent activity.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] rounded-xl" />
            ))
          : stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors"
              >
                <stat.icon size={20} className="text-zinc-400" />
                <p className="mt-3 text-3xl font-bold text-zinc-50">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
              </div>
            ))}
      </div>

      {/* Recent Conversations */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-50 mb-3">
          Recent Conversations
        </h2>
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">User</TableHead>
                <TableHead className="text-zinc-400">Phone</TableHead>
                <TableHead className="text-zinc-400">Business</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-zinc-800">
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                : recent.map((c) => (
                    <TableRow key={c.id} className="border-zinc-800">
                      <TableCell className="text-zinc-300">{c.userName}</TableCell>
                      <TableCell className="text-zinc-300">{c.externalId}</TableCell>
                      <TableCell className="text-zinc-300">
                        {c.collectedData?.business_name ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusStyles[c.status]}
                        >
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {new Date(c.updatedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
