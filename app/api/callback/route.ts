import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const rawText = await req.text();

  let payload: any;
  try {
    payload = JSON.parse(rawText);
  } catch {
    console.log("❌ Callback non-JSON:", rawText.slice(0, 300));
    return NextResponse.json({ ok: false, error: "Non-JSON callback" }, { status: 400 });
  }

  const stk = payload?.Body?.stkCallback;
  const checkoutId = stk?.CheckoutRequestID;

  if (!checkoutId) {
    return NextResponse.json({ ok: false, error: "Missing CheckoutRequestID" }, { status: 400 });
  }

  const resultCode = Number(stk?.ResultCode);
  const resultDesc = String(stk?.ResultDesc || "");

  const items = stk?.CallbackMetadata?.Item || [];
  const meta: Record<string, any> = {};
  for (const it of items) meta[it.Name] = it.Value ?? null;

  const mpesaReceipt = meta.MpesaReceiptNumber ?? null;
  const amountPaid = meta.Amount ?? null;
  const phoneConfirmed = meta.PhoneNumber ?? null;
  const txDate = meta.TransactionDate ?? null;

  const newStatus = resultCode === 0 ? "SUCCESS" : "FAILED";

  // You don’t have mpesa_tx_date column, so store txDate inside result_desc for now
  const combinedDesc = txDate ? `${resultDesc} | txDate:${txDate}` : resultDesc;

  const updatePayload: Record<string, any> = {
    status: newStatus,
    result_code: String(resultCode),
    result_desc: combinedDesc,
    updated_at: new Date().toISOString(),
  };

  if (mpesaReceipt) updatePayload.mpesa_receipt = String(mpesaReceipt);

  // OPTIONAL: update your existing columns (amount/phone) if you want
  if (amountPaid != null) updatePayload.amount = Number(amountPaid);
  if (phoneConfirmed) updatePayload.phone = String(phoneConfirmed);

  const { data, error } = await supabaseAdmin
    .from("transactions")
    .update(updatePayload)
    .eq("checkout_id", checkoutId)
    .select("id, checkout_id, status, mpesa_receipt, result_code, result_desc, updated_at");

  if (error) {
    console.log("❌ Supabase update error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  console.log("✅ Callback updated rows:", data?.length || 0, checkoutId);

  return NextResponse.json({
    ok: true,
    checkoutId,
    updatedRows: data?.length || 0,
    updated: data?.[0] ?? null,
  });
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "callback alive" });
}