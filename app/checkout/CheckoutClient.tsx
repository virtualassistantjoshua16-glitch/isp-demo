"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

export default function CheckoutClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pkg = params.get("pkg");

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const existing = JSON.parse(localStorage.getItem("tx") || "[]");

existing.push({
  phone,
  amount: 1,
  status: "SUCCESS",
  time: Date.now(),
});

localStorage.setItem("tx", JSON.stringify(existing));


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
    router.push("/status?status=pending");

    setTimeout(() => {
    router.push("/status?status=success");
    }, 2500);


  } catch (err) {
    console.error("Checkout failed:", err);
    alert("Request failed. Check console.");
  } finally {
    setLoading(false);
  }
};

  return (
  <main className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white shadow-lg rounded-xl p-8 w-80 text-center">
      <h1 className="text-2xl font-bold mb-4">
        Enter M-Pesa Number
      </h1>

      <input
        type="text"
        placeholder="2547XXXXXXXX"
        className="border p-3 rounded w-full"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={handlePay}
        className="mt-4 bg-green-600 text-white px-6 py-3 rounded w-full"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  </main>
);


}
