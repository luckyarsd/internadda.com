// api/create-payment-order.js

// IMPORTANT: Verify the correct import path based on your 'cashfree-pg' SDK version
// This is a common pattern, but might differ. Check node_modules/cashfree-pg structure or docs.
const { PGCashfree } = require('cashfree-pg/dist/api/pg'); // Example import

// Use environment variables for security
const cashfreeAppId = process.env.CASHFREE_APP_ID;
const cashfreeSecretKey = process.env.CASHFREE_SECRET_KEY;

// Check if keys are loaded
if (!cashfreeAppId || !cashfreeSecretKey) {
  console.error("Cashfree Error: Missing CASHFREE_APP_ID or CASHFREE_SECRET_KEY environment variables.");
  // Don't proceed without keys in a real scenario
}

// Configure Cashfree SDK - VERY IMPORTANT: CHECK CASHFREE NODE.JS SDK DOCS
// Initialization might look different depending on the SDK version
const cashfree = new PGCashfree({
    clientId: cashfreeAppId,
    clientSecret: cashfreeSecretKey,
    // Specify Environment: PGCashfree.Environment.SANDBOX or PGCashfree.Environment.PRODUCTION
    // Use SANDBOX for testing with TEST keys, PRODUCTION for live keys
    environment: PGCashfree.Environment.SANDBOX, // Use SANDBOX for testing initially
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    // Set Allow header for 405 Method Not Allowed
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Check if keys are present before proceeding (important for deployed function)
   if (!cashfreeAppId || !cashfreeSecretKey) {
     return res.status(500).json({ error: "Server configuration error: Payment credentials missing." });
   }


  try {
    const orderAmount = 99.00; // Fixed amount for the exam
    const uniqueOrderId = `INTADD_EXAM_${Date.now()}`; // Generate a unique ID
    const customerId = `CUST_${Date.now()}`; // Simple customer ID

    // --- Prepare Order Details for Cashfree ---
    // CHECK DOCUMENTATION for the LATEST 'createOrder' request structure
    const request = {
      order_id: uniqueOrderId,
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        // Best Practice: Get email/phone from your authenticated user session if possible
        customer_email: req.body?.email || "anonymous@internadda.com", // Use optional chaining
        customer_phone: req.body?.phone || "9999999999", // Use optional chaining
      },
      order_meta: {
        // !!! REPLACE WITH YOUR ACTUAL URLs !!!
        // For local testing use ngrok URL + /api/payment-webhook
        // For production use https://Internadda.com/api/payment-webhook (or your .vercel.app URL)
        notify_url: "YOUR_DEPLOYED_WEBHOOK_URL_HERE", // e.g., https://internadda.com/api/payment-webhook

        // !!! REPLACE WITH YOUR ACTUAL URLs !!!
        // For local testing use ngrok URL + /intern/payment-status.html...
        // For production use https://Internadda.com/intern/payment-status.html...
        return_url: "YOUR_DEPLOYED_RETURN_PAGE_URL_HERE?order_id={order_id}", // e.g., https://internadda.com/intern/payment-status.html?order_id={order_id}
      },
      order_note: "Internadda Final Exam Fee"
      // order_tags: { // Optional tags for tracking
      //   exam_type: 'data_science'
      // }
    };

    console.log("Creating Cashfree Order with request:", JSON.stringify(request, null, 2));

    // --- Call Cashfree API using their SDK's createOrder method ---
    // The exact method name and parameters might change. VERIFY WITH DOCS.
    const cfResponse = await cashfree.PGCreateOrder('2023-08-01', request); // Example SDK call with API version

    console.log("Cashfree createOrder Response Status:", cfResponse?.status);
    console.log("Cashfree createOrder Response Data:", cfResponse?.data);

    // --- Send the Payment Session ID back to the Frontend ---
    // Check the actual response structure from Cashfree API docs
    if (cfResponse?.data?.payment_session_id) {
       res.status(200).json({
           payment_session_id: cfResponse.data.payment_session_id,
           order_id: uniqueOrderId // Optionally return order_id too
       });
    } else {
       console.error("Cashfree Error: payment_session_id not found in response", cfResponse?.data);
       throw new Error("Payment session ID not found in Cashfree response.");
    }

  } catch (error) {
    // Log detailed error information
    console.error("Cashfree API or processing error:", error);
    const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
    res.status(500).json({ error: "Failed to create payment order", details: errorDetails });
  }
};s
