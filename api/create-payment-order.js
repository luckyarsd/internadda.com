// api/create-payment-order.js

// CORRECT Import for Cashfree SDK v5.x
const { PGCashfree } = require('cashfree-pg/dist/api/pg');

// Use environment variables for security
const cashfreeAppId = process.env.CASHFREE_APP_ID;
const cashfreeSecretKey = process.env.CASHFREE_SECRET_KEY;

// Check if keys are loaded (critical for serverless function)
if (!cashfreeAppId || !cashfreeSecretKey) {
  console.error("FATAL ERROR: Cashfree credentials (CASHFREE_APP_ID or CASHFREE_SECRET_KEY) are missing in environment variables.");
  // Important: Return error response immediately if keys are missing
  // Using return here prevents the rest of the function from executing without credentials
  return (res) => res.status(500).json({ error: "Server configuration error: Payment credentials missing." });
}

// CORRECT Initialization for Cashfree SDK v5.x
const cashfree = new PGCashfree({
    clientId: cashfreeAppId,
    clientSecret: cashfreeSecretKey,
    // Specify Environment: PGCashfree.Environment.SANDBOX or PGCashfree.Environment.PRODUCTION
    environment: PGCashfree.Environment.SANDBOX, // START WITH SANDBOX FOR TESTING! Change to PRODUCTION later.
});

// Define the API version (used in the createOrder call)
const CASHFREE_API_VERSION = "2023-08-01";

module.exports = async (req, res) => {
  // Double-check keys are loaded before processing each request (good practice)
  if (!cashfreeAppId || !cashfreeSecretKey) {
    return res.status(500).json({ error: "Server configuration error: Payment credentials missing." });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const orderAmount = 99.00; // Fixed amount for the exam
    const uniqueOrderId = `INTADD_EXAM_${Date.now()}`; // Generate a unique ID
    const customerId = `CUST_${Date.now()}`; // Simple customer ID

    // --- Prepare Order Details for Cashfree (Structure remains similar) ---
    const request = {
      order_id: uniqueOrderId,
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_email: req.body?.email || "anonymous@internadda.com",
        customer_phone: req.body?.phone || "9999999999",
      },
      order_meta: {
  // --- IMPORTANT: Ensure these URLs are correct ---
  notify_url: "https://internadda.com/api/payment-webhook", // <-- IS THIS EXACTLY CORRECT?
  return_url: "https://internadda.com/intern/payment-status.html?order_id={order_id}", // <-- Check this too
},

    console.log(`Creating Cashfree Order (Order ID: ${uniqueOrderId}) with API version ${CASHFREE_API_VERSION}`);

    // --- CORRECT Call Cashfree API using the SDK v5.x instance method ---
    const cfResponse = await cashfree.PGCreateOrder(CASHFREE_API_VERSION, request);

    console.log(`Cashfree PGCreateOrder Response Status for Order ID ${uniqueOrderId}:`, cfResponse?.status); // Use optional chaining

    // --- Send the Payment Session ID back to the Frontend ---
    if (cfResponse?.data?.payment_session_id) { // Use optional chaining
       console.log(`Successfully created payment session for Order ID ${uniqueOrderId}`);
       res.status(200).json({
           payment_session_id: cfResponse.data.payment_session_id,
           order_id: uniqueOrderId
       });
    } else {
       // Log the actual response data if available for debugging
       console.error(`Cashfree Error for Order ID ${uniqueOrderId}: payment_session_id not found in response. Response Data:`, cfResponse?.data);
       const errorMessage = cfResponse?.data?.message || "Payment session ID not found in Cashfree response.";
       // Ensure a specific error status code if possible, default to 500
       const errorStatusCode = cfResponse?.status || 500;
       res.status(errorStatusCode).json({ error: errorMessage, details: cfResponse?.data }); // Send back more details if available
    }

  } catch (error) {
    console.error("Cashfree API call or processing error in create-payment-order:", error);
    // Try to extract specific error message from Cashfree's response data if it exists
    const errorDetails = error.response?.data?.message || error.message || "Unknown error";
    // If the error object has a status code (e.g., from Axios error), use it, otherwise default to 500
    const errorStatusCode = error.response?.status || error.status || 500;
    res.status(errorStatusCode).json({ error: "Failed to create payment order", details: errorDetails });
  }
};
