"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pkg = params.get("pkg");

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

const handlePay = async () => {
  try {
    setLoading(true);

    const payload = {
      phone: phone || "254708374149",
      amount: 1,
    };

    console.log("Sending payload:", payload);

    const res = await fetch("/api/stk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Server response:", data);

    router.push("/success");
  } catch (err) {
    console.error("Checkout failed:", err);
    alert("Request failed. Check console.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">
        Package {pkg} Selected
      </h1>

      <input
        type="text"
        placeholder="2547XXXXXXXX"
        className="border p-3 rounded w-72"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={handlePay}
        className="mt-4 bg-green-600 text-white px-6 py-3 rounded"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
