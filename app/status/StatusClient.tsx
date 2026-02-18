"use client";

import { useSearchParams } from "next/navigation";

export default function StatusClient() {
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
    <div className="bg-white p-10 rounded-xl shadow-lg text-center">
      <h1 className={`text-2xl font-bold ${state.color}`}>
        {state.title}
      </h1>
      <p className="mt-4 text-gray-500">
        You may close this page.
      </p>
    </div>
  );
}
