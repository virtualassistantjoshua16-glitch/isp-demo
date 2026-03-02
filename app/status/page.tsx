export const dynamic = "force-dynamic";

import { Suspense } from "react";
import StatusClient from "./status-client";

export default function StatusPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading payment status...</p>}>
      <StatusClient />
    </Suspense>
  );
}