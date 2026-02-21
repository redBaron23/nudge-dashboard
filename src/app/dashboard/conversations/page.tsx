"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Service {
  name: string;
  duration_minutes: number;
  price: number;
}

interface Conversation {
  id: number;
  externalId: string;
  channel: "whatsapp" | "telegram";
  status: "completed" | "active" | "reviewing";
  collectedData: {
    business_name?: string;
    business_type?: string;
    services?: Service[];
    working_hours?: Record<
      string,
      { enabled: boolean; ranges: { start: string; end: string }[] }
    >;
    booking_rules?: Record<string, unknown>;
    contact_phone?: string;
    contact_email?: string;
    address?: string;
    [key: string]: unknown;
  };
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

const channelStyles: Record<string, string> = {
  whatsapp: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  telegram: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hours ago`;
  if (diffDay < 7) return `${diffDay} days ago`;
  return new Date(dateStr).toLocaleDateString();
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const arsFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
});

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Conversation | null>(null);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50">Conversations</h1>
        <p className="mt-1 text-sm text-zinc-400">
          All onboarding conversations.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">User</TableHead>
              <TableHead className="text-zinc-400">Phone</TableHead>
              <TableHead className="text-zinc-400">Business</TableHead>
              <TableHead className="text-zinc-400">Type</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Channel</TableHead>
              <TableHead className="text-zinc-400">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i} className="border-zinc-800">
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              : conversations.length === 0
                ? (
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      <TableCell colSpan={7} className="h-60">
                        <div className="flex flex-col items-center justify-center gap-2 text-center">
                          <MessageSquare
                            size={48}
                            className="text-zinc-600"
                          />
                          <p className="text-zinc-400 font-medium">
                            No conversations yet
                          </p>
                          <p className="text-zinc-500 text-sm">
                            Conversations will appear here once users start
                            onboarding.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                : conversations.map((c) => (
                    <TableRow
                      key={c.id}
                      className="border-zinc-800 cursor-pointer"
                      onClick={() => setSelected(c)}
                    >
                      <TableCell className="text-zinc-300">
                        {c.userName}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {c.externalId}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {c.collectedData?.business_name ?? "\u2014"}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {c.collectedData?.business_type
                          ? capitalize(c.collectedData.business_type)
                          : "\u2014"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusStyles[c.status]}
                        >
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={channelStyles[c.channel]}
                        >
                          {c.channel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {formatRelativeTime(c.updatedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Sheet */}
      <Sheet
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <SheetContent side="right" className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-zinc-50">
                  {selected.collectedData?.business_name ?? selected.userName}
                  <Badge
                    variant="outline"
                    className={statusStyles[selected.status]}
                  >
                    {selected.status}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  {selected.userName} &middot; {selected.channel}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 px-4 pb-6">
                {/* Business Info */}
                <Section title="Business Info">
                  <div className="grid grid-cols-2 gap-y-3">
                    <InfoField
                      label="Name"
                      value={selected.collectedData?.business_name}
                    />
                    <InfoField
                      label="Type"
                      value={
                        selected.collectedData?.business_type
                          ? capitalize(selected.collectedData.business_type)
                          : undefined
                      }
                    />
                    <InfoField
                      label="Phone"
                      value={
                        selected.collectedData?.contact_phone ??
                        selected.externalId
                      }
                    />
                    <InfoField
                      label="Email"
                      value={selected.collectedData?.contact_email}
                    />
                    <InfoField
                      label="Address"
                      value={selected.collectedData?.address}
                    />
                  </div>
                </Section>

                {/* Services */}
                {selected.collectedData?.services &&
                  selected.collectedData.services.length > 0 && (
                    <Section title="Services">
                      <div className="space-y-2">
                        {selected.collectedData.services.map((s, i) => (
                          <div
                            key={i}
                            className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50"
                          >
                            <p className="font-medium text-sm text-zinc-200">
                              {s.name}
                            </p>
                            <p className="text-xs text-zinc-400 mt-1">
                              {s.duration_minutes} min &middot;{" "}
                              {arsFormatter.format(s.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}

                {/* Working Hours */}
                {selected.collectedData?.working_hours && (
                  <Section title="Working Hours">
                    <div className="space-y-1.5">
                      {DAY_ORDER.map((day) => {
                        const entry =
                          selected.collectedData?.working_hours?.[day];
                        if (!entry) return null;
                        return (
                          <div
                            key={day}
                            className="flex items-center justify-between text-sm"
                          >
                            <span
                              className={cn(
                                "w-24",
                                entry.enabled
                                  ? "text-zinc-300"
                                  : "text-zinc-500"
                              )}
                            >
                              {capitalize(day)}
                            </span>
                            {entry.enabled ? (
                              <span className="text-zinc-300">
                                {entry.ranges
                                  .map((r) => `${r.start}\u2013${r.end}`)
                                  .join(", ")}
                              </span>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-zinc-500 border-zinc-700"
                              >
                                Closed
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Section>
                )}

                {/* Booking Rules */}
                {selected.collectedData?.booking_rules &&
                  Object.keys(selected.collectedData.booking_rules).length >
                    0 && (
                    <Section title="Booking Rules">
                      <div className="grid grid-cols-2 gap-y-3">
                        {Object.entries(
                          selected.collectedData.booking_rules
                        ).map(([key, value]) => (
                          <InfoField
                            key={key}
                            label={key.replace(/_/g, " ")}
                            value={String(value)}
                          />
                        ))}
                      </div>
                    </Section>
                  )}

                {/* Raw Data */}
                <details>
                  <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-400">
                    Raw Data
                  </summary>
                  <pre className="mt-2 text-xs bg-zinc-900 rounded-lg p-3 overflow-x-auto text-zinc-400">
                    {JSON.stringify(selected.collectedData, null, 2)}
                  </pre>
                </details>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-300 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-zinc-500 uppercase">{label}</p>
      <p className="text-sm text-zinc-300">{value}</p>
    </div>
  );
}
