import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { phone, amount, packageName }

    // 1) Call VPS
    const response = await fetch("http://91.99.193.190:4000/api/stk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Read VPS response ONCE
    const raw = await response.text();

    // Parse JSON if possible
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { ok: false, error: "VPS returned non-JSON", raw: raw.slice(0, 300) },
        { status: 502 }
      );
    }

    // If VPS failed, bubble up the VPS message
    if (!response.ok || !data?.CheckoutRequestID) {
      return NextResponse.json(
        { ok: false, error: "VPS STK failed", vpsStatus: response.status, vps: data },
        { status: 502 }
      );
    }

    const checkoutId = data.CheckoutRequestID;
    const merchantRequestId = data.MerchantRequestID;

    // 2) Insert row in Supabase
    const { error: insErr } = await supabase.from("transactions").insert({
      phone: body.phone,
      amount: body.amount,
      package_name: body.packageName,
      checkout_id: checkoutId,
      mpesa_request_id: merchantRequestId,
      status: "PENDING",
    });

    if (insErr) {
      return NextResponse.json(
        { ok: false, error: "Supabase insert failed", details: insErr.message },
        { status: 500 }
      );
    }

    // 3) Return checkoutId to frontend so polling works
    return NextResponse.json({
      ok: true,
      checkoutId,
      merchantRequestId,
      message: "STK initiated + row saved",
    });

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}