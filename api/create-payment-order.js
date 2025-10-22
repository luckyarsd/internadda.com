// api/create-payment-order.js

// CORRECT Import for Cashfree SDK v5.x
const { PGCashfree } = require('cashfree-pg/dist/api/pg');

console.log("Function: /api/create-payment-order invoked."); // Log start

// Use environment variables for security
const cashfreeAppId = process.env.CASHFREE_APP_ID;
const cashfreeSecretKey = process.env.CASHFREE_SECRET_KEY;

// Check if keys are loaded (critical for serverless function)
if (!cashfreeAppId || !cashfreeSecretKey) {
  console.error("FATAL ERROR: Cashfree credentials (CASHFREE_APP_ID or CASHFREE_SECRET_KEY) are missing in environment variables.");
  // IMPORTANT: For Vercel, the handler function needs to be exported. We'll return the response within the handler.
  // We can't return directly here. We will check inside the handler.
} else {
  console.log("Cashfree credentials seem present in environment variables.");
}

// CORRECT Initialization for Cashfree SDK v5.x - DO THIS OUTSIDE THE HANDLER IF POSSIBLE
// It's generally better to initialize outside if the function might be reused (warm starts)
let cashfree;
try {
    cashfree = new PGCashfree({
        clientId: cashfreeAppId,
        clientSecret: cashfreeSecretKey,
        // Specify Environment: PGCashfree.Environment.SANDBOX or PGCashfree.Environment.PRODUCTION
        environment: PGCashfree.Environment.SANDBOX, // START WITH SANDBOX FOR TESTING!
    });
    console.log("Cashfree SDK initialized successfully.");
} catch (initError) {
    console.error("FATAL ERROR: Failed to initialize Cashfree SDK:", initError);
    // SDK initialization failure is critical.
}


// Define the API version (used in the createOrder call)
const CASHFREE_API_VERSION = "2023-08-01";

module.exports = async (req, res) => {
  console.log("Handler started for request method:", req.method);

  // Re-check keys within the handler - crucial safety check
  if (!cashfreeAppId || !cashfreeSecretKey) {
    console.error("Handler Error: Credentials missing inside handler.");
    return res.status(500).json({ error: "Server configuration error: Payment credentials missing." });
  }

  // Check if SDK failed to initialize earlier
  if (!cashfree) {
       console.error("Handler Error: Cashfree SDK not initialized.");
       return res.status(500).json({ error: "Server configuration error: Payment SDK failed to initialize." });
  }


  if (req.method !== 'POST') {
    console.log("Handler Error: Method not allowed:", req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const orderAmount = 99.00;
    const uniqueOrderId = `INTADD_EXAM_${Date.now()}`;
    const customerId = `CUST_${Date.now()}`;

    // --- Prepare Order Details ---
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
        // --- !!! DOUBLE CHECK THESE URLs !!! ---
        notify_url: "https://internadda.com/api/payment-webhook", // Verify this matches your webhook setup
        return_url: "https://internadda.com/intern/payment-status.html?order_id={order_id}", // Verify this is your status page
      },
      order_note: "Internadda Final Exam Fee"
    };

    console.log(`Creating Cashfree Order (Order ID: ${uniqueOrderId}) with API version ${CASHFREE_API_VERSION}`);
    console.log("Request Payload being sent:", JSON.stringify(request, null, 2)); // Log the exact payload

    // --- Call Cashfree API ---
    console.log("Attempting cashfree.PGCreateOrder...");
    const cfResponse = await cashfree.PGCreateOrder(CASHFREE_API_VERSION, request);
    console.log("Cashfree API call completed.");
    console.log(`Cashfree PGCreateOrder Raw Response Status:`, cfResponse?.status);
    console.log(`Cashfree PGCreateOrder Raw Response Data:`, JSON.stringify(cfResponse?.data, null, 2)); // Log the full response data


    // --- Send the Payment Session ID back ---
    if (cfResponse?.data?.payment_session_id) {
       console.log(`Successfully created payment session for Order ID ${uniqueOrderId}. Session ID: ${cfResponse.data.payment_session_id}`);
       // ✅ SUCCESS: Return JSON
       return res.status(200).json({
           payment_session_id: cfResponse.data.payment_session_id,
           order_id: uniqueOrderId
       });
    } else {
       console.error(`Cashfree Error for Order ID ${uniqueOrderId}: payment_session_id not found in response.`);
       const errorMessage = cfResponse?.data?.message || "Payment session ID not found in Cashfree response.";
       const errorStatusCode = cfResponse?.status || 500;
        // ✅ ERROR (but valid JSON): Return JSON
       return res.status(errorStatusCode).json({ error: true, message: errorMessage, details: cfResponse?.data });
    }

  } catch (error) {
    console.error("!!! CATCH BLOCK ERROR in create-payment-order:", error); // Log the full error object
    // Extract details if possible (e.g., from Axios error structure)
    const errorDetails = error.response?.data?.message || error.message || "Unknown server error";
    const errorStatusCode = error.response?.status || error.status || 500;
    console.error(`Responding with status ${errorStatusCode} and details: ${errorDetails}`);
     // ✅ ERROR (but valid JSON): Return JSON
    return res.status(errorStatusCode).json({ error: true, message: "Failed to create payment order", details: errorDetails });
  }
};
