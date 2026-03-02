"use client";

import Link from "next/link";
import { useState } from "react";
import { PACKAGES } from "@/lib/packages";
import {
  Clock,
  CalendarDays,
  Infinity as InfinityIcon,
  Gauge,
  ArrowRight,
} from "lucide-react";

function planIcon(label: string, data: string, days: number) {
  const isUnlimited = data.toUpperCase().includes("UNLIMITED");
  if (isUnlimited) return <InfinityIcon className="h-5 w-5" />;

  if (days <= 1) return <Clock className="h-5 w-5" />;
  if (days <= 7) return <CalendarDays className="h-5 w-5" />;
  return <Gauge className="h-5 w-5" />;
}

export default function PackagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="packages-wallpaper">
      <div className="packages-overlay">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">Choose Your Data Plan</h1>
          <p className="mt-2 text-sm text-slate-300">
            Tap a plan to proceed to checkout
          </p>
        </div>

        <div className="space-y-4">
          {PACKAGES.map((p) => {
            const isSelected = selectedId === p.id;

            return (
              <Link
                key={p.id}
                href={`/checkout?pkg=${p.id}`}
                className={`block plan-card ${isSelected ? "selected-plan" : ""}`}
                onClick={() => setSelectedId(p.id)}
              >
                <div
                  className={[
                    "group relative overflow-hidden rounded-2xl border p-5",
                    "bg-white/8 backdrop-blur-md",
                    "transition-all duration-300",
                    "hover:-translate-y-0.5 hover:bg-white/12 hover:border-white/25 hover:shadow-xl",
                    isSelected
                      ? "border-white/45 ring-2 ring-indigo-400/60 shadow-indigo-500/20"
                      : "border-white/15",
                  ].join(" ")}
                >
                  {/* glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />
                  </div>

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={[
                          "grid h-10 w-10 place-items-center rounded-xl",
                          "bg-white/10 border border-white/15 text-white",
                          "transition-transform duration-300 group-hover:scale-105",
                          isSelected ? "animate-pulse" : "",
                        ].join(" ")}
                        aria-hidden
                      >
                        {planIcon(p.label, p.data, p.durationDays)}
                      </div>

                      <div>
                        <p className="text-lg font-semibold text-white">
                          {p.label}
                        </p>
                        <p className="text-sm text-slate-300">
                          {p.data} • {p.durationDays} Day
                          {p.durationDays > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-200">
                        KSH {p.price}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1 text-sm text-slate-300 transition-all duration-300 group-hover:text-white">
                        Select <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* animated selection bar */}
                  <div
                    className={[
                      "relative mt-4 h-1 overflow-hidden rounded-full bg-white/10",
                      isSelected ? "opacity-100" : "opacity-60",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "absolute inset-y-0 left-0 w-1/2 rounded-full",
                        "bg-gradient-to-r from-indigo-400/80 via-sky-400/70 to-indigo-400/80",
                        "transition-all duration-300",
                        isSelected
                          ? "translate-x-full"
                          : "-translate-x-1/2 group-hover:translate-x-full",
                      ].join(" ")}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}