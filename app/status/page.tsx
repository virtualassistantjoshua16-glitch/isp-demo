import { Suspense } from "react";
import StatusClient from "./StatusClient";

export const dynamic = "force-dynamic";

export default function StatusPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<p>Loading payment status...</p>}>
        <StatusClient />
      </Suspense>
    </main>
  );
}
