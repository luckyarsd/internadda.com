// api/create-payment-order.js

const { PGCashfree } = require('cashfree-pg/dist/api/pg');

console.log("Function: /api/create-payment-order invoked.");

const cashfreeAppId = process.env.CASHFREE_APP_ID;
const cashfreeSecretKey = process.env.CASHFREE_SECRET_KEY;
const environment = process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION'
    ? PGCashfree.Environment.PRODUCTION
    : PGCashfree.Environment.SANDBOX; // Default to SANDBOX if not set or invalid

let cashfree;

// --- Initialization Check ---
if (!cashfreeAppId || !cashfreeSecretKey) {
    console.error("FATAL CONFIG ERROR: Cashfree credentials (CASHFREE_APP_ID or CASHFREE_SECRET_KEY) are missing.");
    // SDK cannot be initialized without credentials
} else {
    try {
        cashfree = new PGCashfree({
            clientId: cashfreeAppId,
            clientSecret: cashfreeSecretKey,
            environment: environment,
        });
        console.log(`Cashfree SDK initialized successfully for environment: ${environment === PGCashfree.Environment.PRODUCTION ? 'PRODUCTION' : 'SANDBOX'}.`);
    } catch (initError) {
        console.error("FATAL SDK INIT ERROR: Failed to initialize Cashfree SDK:", initError);
        // cashfree will remain undefined
    }
}

const CASHFREE_API_VERSION = "2023-08-01"; // Verify this is the latest/correct version

module.exports = async (req, res) => {
    console.log("Handler started for request method:", req.method);

    // --- Critical Checks Inside Handler ---
    if (!cashfreeAppId || !cashfreeSecretKey) {
        console.error("Handler Error: Credentials missing inside handler.");
        // Return JSON error
        return res.status(500).json({ success: false, error: "Server configuration error: Payment credentials missing." });
    }
    if (!cashfree) {
        console.error("Handler Error: Cashfree SDK not initialized (likely due to config or init error).");
        // Return JSON error
        return res.status(500).json({ success: false, error: "Server configuration error: Payment SDK failed to initialize." });
    }
    // --- End Critical Checks ---

    if (req.method !== 'POST') {
        console.log("Handler Error: Method not allowed:", req.method);
        res.setHeader('Allow', ['POST']);
        // Return JSON error
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    try {
        const orderAmount = 99.00; // Fixed exam fee
        const uniqueOrderId = `INTADD_EXAM_${Date.now()}`;
        const customerId = `CUST_${Date.now()}`; // Simple unique ID for this order

        // --- Prepare Order Details ---
        const request = {
            order_id: uniqueOrderId,
            order_amount: orderAmount,
            order_currency: "INR",
            customer_details: {
                customer_id: customerId,
                // Safely access potential body properties
                customer_email: req.body?.email || "anonymous@internadda.com",
                customer_phone: req.body?.phone || "9999999999", // Ensure it's a string
            },
            order_meta: {
                // IMPORTANT: Use environment variables for URLs if possible, otherwise HARDCODE correctly for deployment
                // Ensure these are HTTPS URLs for production
                notify_url: process.env.PAYMENT_NOTIFY_URL || "https://internadda.com/api/payment-webhook", // Replace with your actual deployed webhook URL
                return_url: process.env.PAYMENT_RETURN_URL || `https://internadda.com/intern/payment-status.html?order_id={order_id}`, // Replace with your actual return page URL
            },
            order_note: "Internadda Final Exam Fee"
        };

        console.log(`Creating Cashfree Order (Order ID: ${uniqueOrderId}) with API version ${CASHFREE_API_VERSION}`);
        console.log("Request Payload being sent:", JSON.stringify(request, null, 2));

        // --- Call Cashfree API ---
        const cfResponse = await cashfree.PGCreateOrder(CASHFREE_API_VERSION, request);

        // --- Log Cashfree Response ---
        console.log(`Cashfree PGCreateOrder Raw Response Status Code:`, cfResponse?.status); // Log HTTP status
        // Log only relevant data, avoid logging sensitive info if any exists in full response
        console.log(`Cashfree PGCreateOrder Response Data Snippet:`, {
            order_id: cfResponse?.data?.order_id,
            payment_session_id_exists: !!cfResponse?.data?.payment_session_id,
            message: cfResponse?.data?.message, // Include message if present
            code: cfResponse?.data?.code // Include code if present
        });

        // --- Handle Cashfree Response ---
        if (cfResponse?.data?.payment_session_id) {
            console.log(`Successfully created payment session for Order ID ${uniqueOrderId}. Session ID: ${cfResponse.data.payment_session_id}`);
            // ✅ SUCCESS: Return JSON
            return res.status(200).json({
                success: true,
                payment_session_id: cfResponse.data.payment_session_id,
                order_id: uniqueOrderId
            });
        } else {
            // Handle cases where Cashfree API call was technically successful (e.g., 200 OK) but didn't return a session ID, or returned an error structure
            const errorMessage = cfResponse?.data?.message || "Payment session ID not found in Cashfree response.";
            const errorCode = cfResponse?.data?.code || "UNKNOWN_CASHFREE_ISSUE";
            console.error(`Cashfree Error (No Session ID) for Order ID ${uniqueOrderId}: Code: ${errorCode}, Message: ${errorMessage}`);
            // Determine appropriate status code, default to 500 if unsure
            const errorStatusCode = typeof cfResponse?.status === 'number' && cfResponse.status >= 400 ? cfResponse.status : 500;
             // ❌ ERROR (but valid JSON): Return JSON
            return res.status(errorStatusCode).json({ success: false, error: errorMessage, details: cfResponse?.data });
        }

    } catch (error) {
        console.error("!!! CATCH BLOCK ERROR in create-payment-order:", error); // Log the full error object

        // Attempt to extract meaningful error details from Cashfree/Axios error structure
        let errorDetails = "Unknown server error";
        let errorStatusCode = 500;

        if (error.response) {
            // Error likely from Cashfree API (Axios structure)
            errorDetails = error.response.data?.message || JSON.stringify(error.response.data) || `Cashfree API Error ${error.response.status}`;
            errorStatusCode = error.response.status || 500;
            console.error(`Cashfree API Error Details: Status=${errorStatusCode}, Data=${JSON.stringify(error.response.data)}`);
        } else if (error.message) {
            // General JavaScript error
            errorDetails = error.message;
        }

        console.error(`Responding with status ${errorStatusCode} and error: ${errorDetails}`);
        // ❌ ERROR (but valid JSON): Return JSON
        return res.status(errorStatusCode).json({ success: false, error: "Failed to create payment order", details: errorDetails });
    }
};
