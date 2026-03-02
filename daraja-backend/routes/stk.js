import express from "express";

const router = express.Router();

function getTimestamp() {
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const DD = String(now.getDate()).padStart(2, "0");
  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const SS = String(now.getSeconds()).padStart(2, "0");
  return `${YYYY}${MM}${DD}${HH}${mm}${SS}`;
}

function makeAccountRef() {
  // short + unique enough for demos; can replace later with DB id
  return `EDGE-${Date.now().toString().slice(-8)}`;
}

router.post("/stk", async (req, res) => {
  try {
    const phone = req.body?.phone;          // expects 2547XXXXXXXX
    const amount = Number(req.body?.amount || 1);
    const packageName = req.body?.packageName || "Plan";
    const accountReference = req.body?.accountReference || makeAccountRef();

    if (!phone) return res.status(400).json({ ok: false, error: "phone is required" });
    if (!process.env.CALLBACK_URL) return res.status(500).json({ ok: false, error: "CALLBACK_URL missing" });

    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE;   // PayBill number
    const passkey = process.env.MPESA_PASSKEY;

    if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
      return res.status(500).json({ ok: false, error: "Missing MPESA env vars" });
    }

    // 1) OAuth
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;
    if (!accessToken) return res.status(500).json({ ok: false, error: "No access token" });

    // 2) Password + timestamp
    const timestamp = getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // 3) STK Push (PayBill)
    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,                 // PayBill number
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",    // PayBill STK
          Amount: amount,
          PartyA: phone,
          PartyB: shortcode,                            // PayBill again
          PhoneNumber: phone,
          CallBackURL: process.env.CALLBACK_URL,        // VPS later
          AccountReference: accountReference,           // unique per transaction
          TransactionDesc: `Edgecraft ${packageName}`,
        }),
      }
    );

    const stkData = await stkRes.json().catch(() => ({}));

    return res.json({
      ok: true,
      accountReference,
      merchantRequestId: stkData.MerchantRequestID,
      checkoutRequestId: stkData.CheckoutRequestID,
      responseCode: stkData.ResponseCode,
      responseDescription: stkData.ResponseDescription,
      customerMessage: stkData.CustomerMessage,
    });
  } catch (e) {
    console.error("STK ERROR:", e);
    return res.status(500).json({ ok: false, error: "STK failed" });
  }
});

export default router;