"use client";

import AdminGuard from "@/components/AdminGuard";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tx") || "[]");
    setTransactions(stored);
  }, []);

  return (
    <AdminGuard>
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <div className="bg-white shadow rounded-xl">
        {transactions.length === 0 && (
          <p className="p-6 text-gray-500">No transactions yet.</p>
        )}

        {transactions.map((t, i) => (
          <div key={i} className="border-b p-4 flex justify-between">
            <span>{t.phone}</span>
            <span>KES {t.amount}</span>
            <span className="text-green-600">{t.status}</span>
          </div>
        ))}
      </div>
      <button
  onClick={() => {
    localStorage.removeItem("admin-auth");
    window.location.href = "/login";
  }}
  className="mb-6 bg-red-500 text-white px-4 py-2 rounded"
>
  Logout
</button>
    </main>
    </AdminGuard>
  );
}
