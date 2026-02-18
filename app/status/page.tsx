"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";

export default function StatusPage() {
  const params = useSearchParams();
  const status = (params.get("status") || "pending") as "success" | "pending" | "failed";

  const config = {
    success: {
      title: "Payment Successful",
      color: "text-green-600",
    },
    pending: {
      title: "Processing Transaction...",
      color: "text-yellow-600",
    },
    failed: {
      title: "Payment Failed",
      color: "text-red-600",
    },
  };

  const state = config[status];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className={`text-2xl font-bold ${state.color}`}>
          {state.title}
        </h1>
        <p className="mt-4 text-gray-500">
          You may close this page.
        </p>
      </div>
    </main>
  );
}
