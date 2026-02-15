import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json();

    console.log("Incoming request:", phone, amount);

    const auth = Buffer.from(
      `${process.env.DARAJA_KEY}:${process.env.DARAJA_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const tokenData = await tokenRes.json();
    console.log("Token response:", tokenData);

    return NextResponse.json({
      success: true,
      message: "Daraja token received",
      tokenData,
    });
  } catch (err) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      { success: false, error: "Something broke" },
      { status: 500 }
    );
  }
}
