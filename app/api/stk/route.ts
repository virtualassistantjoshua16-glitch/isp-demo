export const runtime = "nodejs";
export const preferredRegion = "fra1";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
console.log("STK API HIT");


export async function POST(req: Request) {
  const body = await req.json();

  const { phone, amount } = body;

  const { error } = await supabase.from("transactions").insert([
    {
      phone,
      amount,
      status: "PENDING",
    },
  ]);

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ ok: false });
  }
  try {
    // ✅ Safely read request body
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      console.log("No JSON body received");
    }

    const phone = body.phone || "254708374149";
    const amount = body.amount || 1;
    await supabase.from("transactions").insert({
  phone,
  amount,
  package: "Selected Package",
  status: "pending",
});


    console.log("Parsed body:", { phone, amount });

    const key = process.env.DARAJA_KEY!;
    const secret = process.env.DARAJA_SECRET!;
    const shortcode = process.env.SHORTCODE!;
    const passkey = process.env.PASSKEY!;

    // ✅ Generate OAuth token
    console.log("Preparing OAuth request to Safaricom...");
    const auth = Buffer.from(`${key}:${secret}`).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    console.log("OAuth HTTP status:", tokenRes.status);

    const tokenText = await tokenRes.text();
    console.log("Raw Token Response:", tokenText);

    if (!tokenText) {
      throw new Error("Empty OAuth response from Safaricom");
    }

    const tokenData = JSON.parse(tokenText);
    const accessToken = tokenData.access_token;

    console.log("Access token acquired");

    // ✅ Generate timestamp + password
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // ✅ Send STK Push
    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phone,
          PartyB: shortcode,
          PhoneNumber: phone,
          CallBackURL: "https://isp-demo-od9a.vercel.app/api/callback",
          AccountReference: "ISP Demo",
          TransactionDesc: "Test Payment",
        }),
      }
    );

    const stkText = await stkRes.text();
    console.log("Raw STK Response:", stkText);


    let stkData: any = {};

    try {
      stkData = stkText ? JSON.parse(stkText) : {};
    } catch (e){
      console.warn("STK returned non-JSON (sandbox quirk)");
      stkData = {note: "Empty STK response (sandbox behavior)"
      };
    }

    await supabase.from("transactions").insert({
      phone: phone,
      amount: amount,
      checkout_id: stkData.checkoutRequestID || null,
      status: "PENDING",
    })

    console.log("Final Parsed STK Data:", stkData);

    return NextResponse.json(stkData);
  } catch (err: any) {
    console.error("FINAL ERROR:", err.message);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
