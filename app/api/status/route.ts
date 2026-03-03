import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const checkoutId = searchParams.get("checkoutId");

  console.log("Looking for checkoutId:", checkoutId);

  if (!checkoutId) {
    return NextResponse.json({ error: "Missing checkoutId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("checkout_id", checkoutId)   // ← MUST MATCH DB COLUMN
    .maybeSingle();
  
  console.log("STATUS checkoutId raw", JSON.stringify(checkoutId));

  if (!data) {
    return NextResponse.json({ status: "PENDING", note:
      "No row yet"});
  }

  console.log("Transaction found:", data);

  return NextResponse.json({
    status: data.status,
  });
}