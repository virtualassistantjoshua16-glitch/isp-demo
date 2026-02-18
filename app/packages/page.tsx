"use client";

import { useRouter } from "next/navigation";
import packages from "@/data/packages.json";

export default function Packages() {
  const router = useRouter();

  const stored =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("packages") || "null")
      : null;

  const source = stored || packages;

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col p-10"
      style={{ backgroundImage: "url('/images/packages-bg.jpg')" }}>
      <h1 className="text-3xl font-bold mb-8">Choose Your Package</h1>

      <div className="backdrop-blur-sm bg-white/70 p-6 rounded-xl">
        {source.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white shadow-md hover:shadow-xl transition p-6 rounded-xl border"
          >
            <h2 className="text-xl font-semibold">{pkg.name}</h2>

            <p className="text-gray-500">{pkg.speed}</p>

            <p className="mt-2 font-bold">KES {pkg.price}</p>

            <button
              className="mt-4 bg-black text-white px-4 py-2 rounded w-full"
              onClick={() => router.push(`/checkout?pkg=${pkg.id}`)}
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
