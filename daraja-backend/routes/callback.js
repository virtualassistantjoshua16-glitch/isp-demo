import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post("/callback", async (req, res) => {
  try {
    console.log("MPESA CALLBACK RECEIVED");

    const body = req.body;
    console.log("RAW BODY:", JSON.stringify(body, null, 2));

    const stk = body?.Body?.stkCallback;

    if (!stk) {
      return res.json({ ok: true });
    }

    const checkoutId = stk.CheckoutRequestID;
    const resultCode = stk.ResultCode;

    let status = "FAILED";

    if (resultCode === 0) {
      status = "SUCCESS";
    }

    await supabase
      .from("transactions")
      .update({ status })
      .eq("checkout_id", checkoutId);

    console.log("Transaction updated:", checkoutId, status);

    res.json({ ResultCode: 0, ResultDesc: "Accepted" });

  } catch (err) {
    console.error("Callback error:", err);
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
});

export default router;