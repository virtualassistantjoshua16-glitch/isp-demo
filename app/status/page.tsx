"use client";

export const dynamic = "force-dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StatusClient() {
  const params = useSearchParams();
  const checkoutId = params.get("checkoutId");

  const [status, setStatus] = useState("PENDING");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!checkoutId) {
      setError("Missing checkoutId in URL.");
      return;
    }

    let stop = false;

    const poll = async () => {
      try {
        setError("");

        const url = `/api/status?checkoutId=${encodeURIComponent(checkoutId)}`;
        const res = await fetch(url, { cache: "no-store" });

        const raw = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(raw);
        } catch {
          data = { raw };
        }

        if (!res.ok) {
          throw new Error(data?.error || `Server error ${res.status}`);
        }

        const s = (data?.status || "PENDING").toString();
        setStatus(s);

        if (s !== "PENDING") stop = true;
      } catch (e: any) {
        setError(e?.message || "Polling failed");
      }
    };

    poll();
    const interval = setInterval(() => {
      if (!stop) poll();
    }, 2000);

    return () => clearInterval(interval);
  }, [checkoutId]);

  const color =
    status === "SUCCESS"
      ? "text-green-600"
      : status === "FAILED"
      ? "text-red-600"
      : "text-yellow-600";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3 p-6">
      <h1 className="text-2xl font-bold">Waiting for payment confirmation...</h1>

      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className={`text-xl font-semibold ${color}`}>{status}</p>
      )}

      {checkoutId ? (
        <p className="text-sm opacity-70">Checkout ID: {checkoutId}</p>
      ) : null}
    </main>
  );
}