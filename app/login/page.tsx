"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (password === "edgecraft123") {
      localStorage.setItem("admin-auth", "true");
      router.push("/admin");
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-80">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>

        <input
          type="password"
          placeholder="Enter password"
          className="border p-3 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="mt-4 bg-black text-white w-full py-3 rounded"
        >
          Login
        </button>
      </div>
    </main>
  );
}
