import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let body;

try {
  body = await req.json();
} catch {
  body = {};
}
const { phone = "254708374149", amount = 1 } = body;

console.log("Parsed body:", { phone, amount });

    console.log("Received:", { phone, amount });

    const key = process.env.DARAJA_KEY!;
    const secret = process.env.DARAJA_SECRET!;

    console.log("Key exists:", !!key);
    console.log("Secret exists:", !!secret);

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

    const text = await tokenRes.text();

    console.log("Raw Safaricom response:", text);

    return NextResponse.json({
      status: tokenRes.status,
      body: text,
    });
    const tokenJson = JSON.parse(text);
const accessToken = tokenJson.access_token;

const timestamp = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 14);

const password = Buffer.from(
  `${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`
).toString("base64");

const stkRes = await fetch(
  "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: process.env.SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: "https://example.com/callback",
      AccountReference: "ISP Demo",
      TransactionDesc: "Test Payment",
    }),
  }
);

const stkData = await stkRes.text();
console.log("STK Response:", stkData);

return NextResponse.json({ stkData });

  } catch (err: any) {
    console.error("CRASH:", err);

    return NextResponse.json(
      { error: err.message || "Unknown crash" },
      { status: 500 }
    );
  }
}
