"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";

export default function PackageEditor() {
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("packages") || "[]");
    setPackages(stored);
  }, []);

  const update = (i: number, field: string, value: string) => {
    const copy = [...packages];
    copy[i][field] = value;
    setPackages(copy);
    localStorage.setItem("packages", JSON.stringify(copy));
  };

  return (
    <AdminGuard>x
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Edit Packages</h1>

      {packages.map((pkg, i) => (
        <div key={pkg.id} className="bg-white p-6 rounded-xl shadow mb-4">
          <input
            className="border p-2 mr-2"
            value={pkg.name}
            onChange={(e) => update(i, "name", e.target.value)}
          />
          <input
            className="border p-2 mr-2"
            value={pkg.price}
            onChange={(e) => update(i, "price", e.target.value)}
          />
          <input
            className="border p-2"
            value={pkg.speed}
            onChange={(e) => update(i, "speed", e.target.value)}
          />
        </div>
      ))}
    </main>
    </AdminGuard>
  );
}
