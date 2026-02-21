"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ONBOARDING_JSON = `{
  "id": "appointment-scheduling",
  "name": "YaTurno Appointment Scheduling Setup",
  "description": "Collects business configuration to create an agenda with services, professionals, and working hours.",
  "fields": {
    "business_name": {
      "type": "string",
      "required": true,
      "description": "Name of the business"
    },
    "business_type": {
      "type": "enum",
      "required": true,
      "values": ["health", "beauty", "services", "consulting", "education", "gastronomy", "sports", "other"],
      "description": "Type of business"
    },
    "description": {
      "type": "string",
      "required": false,
      "description": "Brief description of the business"
    },
    "email": {
      "type": "string",
      "format": "email",
      "required": false,
      "description": "Business contact email"
    },
    "phone": {
      "type": "string",
      "required": false,
      "description": "Business phone number"
    },
    "address": {
      "type": "string",
      "required": false,
      "description": "Business address"
    },
    "working_hours": {
      "type": "object",
      "required": false,
      "description": "Weekly schedule. Keys are lowercase day names (monday-sunday). Each day has 'enabled' (boolean) and 'ranges' (array of {start, end} in HH:MM format).",
      "example": {
        "monday": { "enabled": true, "ranges": [{ "start": "09:00", "end": "18:00" }] },
        "tuesday": { "enabled": true, "ranges": [{ "start": "09:00", "end": "18:00" }] },
        "wednesday": { "enabled": true, "ranges": [{ "start": "09:00", "end": "18:00" }] },
        "thursday": { "enabled": true, "ranges": [{ "start": "09:00", "end": "18:00" }] },
        "friday": { "enabled": true, "ranges": [{ "start": "09:00", "end": "18:00" }] },
        "saturday": { "enabled": false, "ranges": [] },
        "sunday": { "enabled": false, "ranges": [] }
      }
    },
    "services": {
      "type": "array",
      "required": false,
      "description": "List of services offered. If empty, a default 'General Service' is created.",
      "items": {
        "name": { "type": "string", "required": true, "description": "Service name" },
        "duration_minutes": { "type": "integer", "required": true, "description": "How long the service takes in minutes" },
        "calendar_duration_minutes": { "type": "integer", "required": false, "description": "Time blocked on calendar (defaults to duration_minutes). Use when buffer time is needed between appointments." },
        "price": { "type": "number", "required": false, "default": 0, "description": "Price in local currency. 0 = free service." },
        "description": { "type": "string", "required": false, "description": "Service description" }
      }
    },
    "booking_rules": {
      "type": "object",
      "required": false,
      "description": "Booking policy configuration",
      "properties": {
        "min_advance_days": { "type": "integer", "default": 0, "description": "Minimum days in advance a booking can be made" },
        "max_advance_days": { "type": "integer", "default": 30, "description": "Maximum days in advance a booking can be made" },
        "min_cancellation_hours": { "type": "integer", "default": 2, "description": "Minimum hours before appointment to allow cancellation" },
        "slot_interval_minutes": { "type": "integer", "default": 15, "description": "Time slot interval in minutes (e.g. 15, 30, 60)" },
        "max_parallel_appointments": { "type": "integer", "default": 1, "description": "Max appointments at the same time slot" }
      }
    }
  },
  "completion": {
    "message_template": "All set! Your schedule has been created 🎉 View it here: {url}",
    "response_fields": ["url", "slug", "agendaId"]
  },
  "webhook": {
    "event": "onboarding.completed",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "X-Webhook-Secret": "<configured secret>"
    },
    "body_format": {
      "event": "onboarding.completed",
      "definitionId": "appointment-scheduling",
      "token": "yaturno_<userId>",
      "data": "<collected fields>",
      "completedAt": "<ISO 8601 timestamp>"
    }
  }
}`;

function highlightJson(json: string): string {
  return json
    .replace(
      /("(?:\\.|[^"\\])*")\s*:/g,
      '<span class="text-indigo-400">$1</span>:'
    )
    .replace(
      /:\s*("(?:\\.|[^"\\])*")/g,
      (match, value) => match.replace(value, `<span class="text-emerald-400">${value}</span>`)
    )
    .replace(
      /:\s*(\d+(?:\.\d+)?)/g,
      (match, num) => match.replace(num, `<span class="text-amber-400">${num}</span>`)
    )
    .replace(
      /:\s*(true|false|null)\b/g,
      (match, keyword) => match.replace(keyword, `<span class="text-purple-400">${keyword}</span>`)
    );
}

export default function SettingsPage() {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50">Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Webhook configuration, channels, and onboarding definition.
        </p>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-50 mb-4">
          Webhook Configuration
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="text-sm text-zinc-400 sm:w-28 shrink-0">Target URL</span>
            <code className="bg-zinc-900 font-mono text-sm text-zinc-200 px-3 py-1.5 rounded-md border border-zinc-800">
              https://app.yaturno.com/api/webhooks/nudge
            </code>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="text-sm text-zinc-400 sm:w-28 shrink-0">Secret</span>
            <div className="flex items-center gap-2">
              <code className="bg-zinc-900 font-mono text-sm text-zinc-200 px-3 py-1.5 rounded-md border border-zinc-800">
                {showSecret ? "es-un-secreto-shhh" : "••••••••••••"}
              </code>
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="text-sm text-zinc-400 sm:w-28 shrink-0">Status</span>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 w-fit"
            >
              Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Channels */}
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-50 mb-4">Channels</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 w-28 shrink-0">WhatsApp</span>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            >
              Enabled
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 w-28 shrink-0">Telegram</span>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            >
              Enabled
            </Badge>
          </div>
        </div>
      </div>

      {/* Onboarding Definition */}
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-50">
            appointment-scheduling.json
          </h2>
          <Badge
            variant="outline"
            className="bg-zinc-800/50 text-zinc-400 border-zinc-700"
          >
            Read-only
          </Badge>
        </div>
        <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
          <code
            dangerouslySetInnerHTML={{ __html: highlightJson(ONBOARDING_JSON) }}
          />
        </pre>
      </div>
    </div>
  );
}
