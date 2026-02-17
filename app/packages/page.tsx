"use client";
import { useRouter } from "next/navigation";

const packages = [
  { id: 1, name: "24 Hours Unlimited", price: 99 },
  { id: 2, name: "7 Days Unlimited", price: 220 },
  { id: 3, name: "30 Days Unlimited", price: 400 },
];

export default function Packages() {
  const router = useRouter();

  return (
    <main className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Choose Your Package</h1>

      <div className="grid gap-6">
        {packages.map((pkg) => (
          <div
  key={pkg.id}
  className="bg-white shadow-md hover:shadow-xl transition p-6 rounded-xl border"
>
            <h2 className="text-xl font-semibold">{pkg.name}</h2>
            <p className="text-gray-500">KES {pkg.price}</p>

            <button
              className="mt-4 bg-black text-white px-4 py-2 rounded"
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
