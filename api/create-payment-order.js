// api/create-payment-order.js
const { Cashfree } = require('cashfree-pg'); // Import based on SDK < 5 documentation pattern

// Use environment variables for security
const cashfreeAppId = process.env.CASHFREE_APP_ID;
const cashfreeSecretKey = process.env.CASHFREE_SECRET_KEY;

// Check if keys are loaded (critical for serverless function)
if (!cashfreeAppId || !cashfreeSecretKey) {
  console.error("FATAL ERROR: Cashfree credentials (CASHFREE_APP_ID or CASHFREE_SECRET_KEY) are missing in environment variables.");
  // In a real scenario, the function should probably exit or throw an error here
  // For now, it will fail later when trying to use the SDK without keys.
}

// Configure Cashfree SDK for version < 5
Cashfree.XClientId = cashfreeAppId;
Cashfree.XClientSecret = cashfreeSecretKey;
// Set Environment: SANDBOX for testing, PRODUCTION for live payments
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // START WITH SANDBOX FOR TESTING! Change to PRODUCTION later.

// Define the API version (as required by the < 5 SDK's PGCreateOrder method)
const CASHFREE_API_VERSION = "2023-08-01"; // Use the version from the documentation provided

module.exports = async (req, res) => {
  // Ensure keys are loaded before processing request
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

    // --- Prepare Order Details for Cashfree ---
    // Structure based on the documentation provided
    const request = {
      order_id: uniqueOrderId,
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        // Use details from the request body if sent, otherwise use placeholders
        customer_email: req.body?.email || "anonymous@internadda.com",
        customer_phone: req.body?.phone || "9999999999", // Ensure it's a valid format if possible
      },
      order_meta: {
        // --- IMPORTANT: Ensure these URLs are correct in your deployed environment ---
        // notify_url: should be your deployed webhook function URL (e.g., https://internadda.com/api/payment-webhook)
        notify_url: "https://internadda.com/api/payment-notify", // CONFIRM THIS IS SET

        // return_url: should be your deployed payment status page URL (e.g., https://internadda.com/intern/payment-status.html?order_id={order_id})
        return_url: "https://internadda.com/api/payment-return?order_id={order_id}", // CONFIRM THIS IS SET
      },
      order_note: "Internadda Final Exam Fee"
    };

    console.log(`Creating Cashfree Order (Order ID: ${uniqueOrderId}) with API version ${CASHFREE_API_VERSION}`);
    // console.log("Request Payload:", JSON.stringify(request, null, 2)); // Uncomment for detailed debugging if needed

    // --- Call Cashfree API using the SDK (version < 5 pattern) ---
    const cfResponse = await Cashfree.PGCreateOrder(CASHFREE_API_VERSION, request);

    console.log(`Cashfree PGCreateOrder Response Status for Order ID ${uniqueOrderId}:`, cfResponse?.status);
    // console.log("Response Data:", cfResponse?.data); // Uncomment for detailed debugging if needed

    // --- Send the Payment Session ID back to the Frontend ---
    // Check the actual response structure from Cashfree API docs or logs
    if (cfResponse?.data?.payment_session_id) {
       console.log(`Successfully created payment session for Order ID ${uniqueOrderId}`);
       res.status(200).json({
           payment_session_id: cfResponse.data.payment_session_id,
           order_id: uniqueOrderId // Send order_id back too, might be useful
       });
    } else {
       console.error(`Cashfree Error for Order ID ${uniqueOrderId}: payment_session_id not found in response`, cfResponse?.data);
       // Try to extract a more specific error message if available
       const errorMessage = cfResponse?.data?.message || "Payment session ID not found in Cashfree response.";
       throw new Error(errorMessage);
    }

  } catch (error) {
    console.error("Cashfree API call or processing error in create-payment-order:", error);
    // Try to extract specific error message from Cashfree's response data if it exists
    const errorDetails = error.response?.data?.message || error.message || "Unknown error";
    const errorStatusCode = error.response?.status || 500; // Use Cashfree's status code if available
    res.status(errorStatusCode).json({ error: "Failed to create payment order", details: errorDetails });
  }
};