import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="bg-white/85 backdrop-blur-md p-10 rounded-2xl shadow-2xl">
    <main 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/checkout-bg.jpg')" }}>
      <Suspense fallback={<p>Loading checkout...</p>}>
        <CheckoutClient />
      </Suspense>
    </main>
    </div>
  );
}
