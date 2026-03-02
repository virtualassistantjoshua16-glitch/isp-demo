"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { PACKAGES } from "@/lib/packages";

export default function CheckoutClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pkg = params.get("pkg");

  // ✅ find plan from URL
  const selectedPlan = useMemo(() => {
    const found = PACKAGES.find((p) => p.id === pkg);
    return found ?? PACKAGES[0];
  }, [pkg]);

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [existing, setExisting] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("tx");
    if (stored) setExisting(JSON.parse(stored));
  }, []);

  const saveTx = (payload: { phone: string; amount: number; packageName: string }) => {
    const updated = [
      ...existing,
      {
        phone: payload.phone,
        amount: payload.amount,
        packageName: payload.packageName,
        status: "PENDING",
        time: Date.now(),
      },
    ];
    setExisting(updated);
    localStorage.setItem("tx", JSON.stringify(updated));
  };

  const handlePay = async () => {
    try {
      setLoading(true);

      const payload = {
        phone: phone || "254708374149",
        amount: selectedPlan.price,
        packageName: selectedPlan.label,
      };

      console.log("Sending payload:", payload);

      const res = await fetch("/api/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (!res.ok) {
        alert(data?.error || "Payment request failed");
        return;
      }

      // ✅ save after request accepted
      saveTx(payload);

      // ✅ go to status page with checkoutId
      router.push(`/status?checkoutId=${data.checkoutId}`);
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Request failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url('/images/checkout-bg.jpg')", backgroundSize: "cover" }}
    >
      <div className="bg-white/85 backdrop-blur-md shadow-lg rounded-xl p-8 w-80 text-center">
        <h1 className="text-2xl font-bold mb-2">Enter M-Pesa Number</h1>
        <p className="text-sm text-gray-600 mb-4">
          Paying for: <span className="font-semibold">{selectedPlan.label}</span> (KSH{" "}
          {selectedPlan.price})
        </p>

        <input
          type="text"
          placeholder="2547XXXXXXXX"
          className="border p-3 rounded w-full"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handlePay}
          disabled={loading}
          className="mt-4 bg-green-600 disabled:opacity-60 text-white px-6 py-3 rounded w-full"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </main>
  );
}