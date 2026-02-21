import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("📩 M-Pesa Callback Received:", JSON.stringify(body, null, 2));

    const stk = body?.Body?.stkCallback;

    if (!stk) {
      return NextResponse.json({ message: "No stkCallback" });
    }

    const checkoutId = stk.CheckoutRequestID;
    const resultCode = stk.ResultCode;

    const status = resultCode === 0 ? "SUCCESS" : "FAILED";

    // Update the existing transaction
    const { error } = await supabase
      .from("transactions")
      .update({
        status: status,
        mpesa_receipt:
          stk.CallbackMetadata?.Item?.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value || null,
      })
      .eq("checkout_id", checkoutId);

    if (error) {
      console.error("❌ Supabase update error:", error);
    } else {
      console.log("✅ Transaction updated:", checkoutId, status);
    }

    return NextResponse.json({ message: "Callback processed" });
  } catch (err: any) {
    console.error("🔥 Callback crash:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}