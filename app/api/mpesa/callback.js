export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        console.log("📩 M-Pesa Callback Received");

        const body = req.body;

        if (!body?.Body?.stkCallback) {
            console.log("⚠️ Invalid callback structure");
            return res.status(200).json({ ResultCode: 0, ResultDesc: "Ignored" });
        }

        const stk = body.Body.stkCallback;

        const resultCode = stk.ResultCode;
        const resultDesc = stk.ResultDesc;
        const checkoutRequestID = stk.CheckoutRequestID;

        console.log("Result:", resultCode, resultDesc);

        if (resultCode !== 0) {
            console.log("❌ Payment failed");
            return res.status(200).json({ ResultCode: 0, ResultDesc: "Received" });
        }

        const metadata = stk.CallbackMetadata.Item;

        const amount = metadata.find(i => i.Name === "Amount")?.Value;
        const mpesaReceipt = metadata.find(i => i.Name === "MpesaReceiptNumber")?.Value;
        const phone = metadata.find(i => i.Name === "PhoneNumber")?.Value;

        console.log("✅ PAYMENT SUCCESS");
        console.log({ phone, amount, mpesaReceipt, checkoutRequestID });

        /**
         * NEXT STEP (we add soon):
         *  - Save to database
         *  - Activate subscription
         */

        return res.status(200).json({
            ResultCode: 0,
            ResultDesc: "Accepted"
        });

    } catch (error) {
        console.error("🔥 Callback Error:", error);
        return res.status(200).json({
            ResultCode: 0,
            ResultDesc: "Handled"
        });
    }
}