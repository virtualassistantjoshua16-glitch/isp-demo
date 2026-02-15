import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Safely read body
    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { phone = "254708374149", amount = 1 } = body;

    console.log("Parsed body:", { phone, amount });

    const key = process.env.DARAJA_KEY!;
    const secret = process.env.DARAJA_SECRET!;
    const shortcode = process.env.SHORTCODE!;
    const passkey = process.env.PASSKEY!;

    // 🔐 Generate OAuth token
    const auth = Buffer.from(`${key}:${secret}`).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    console.log("Access Token received");

    // ⏱️ Generate timestamp + password
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // 📲 Send STK Push request
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
          CallBackURL: "https://example.com/callback",
          AccountReference: "ISP Demo",
          TransactionDesc: "Test Payment",
        }),
      }
    );

    const rawText = await stkRes.text();

console.log("Raw STK Response Text:", rawText);

// Safaricom sandbox sometimes returns empty body
let stkData = {};
if (rawText) {
  try {
    stkData = JSON.parse(rawText);
  } catch {
    stkData = { note: "Non-JSON response received", rawText };
  }
} else {
  stkData = { note: "Empty response body from Safaricom (sandbox quirk)" };
}

console.log("Parsed STK Response:", stkData);

return NextResponse.json(stkData);

  } catch (err: any) {
    console.error("STK ERROR:", err);

    return NextResponse.json(
      { error: err.message || "STK failed" },
      { status: 500 }
    );
  }
}
