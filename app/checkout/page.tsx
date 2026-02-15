import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<p>Loading checkout...</p>}>
        <CheckoutClient />
      </Suspense>
    </main>
  );
}
