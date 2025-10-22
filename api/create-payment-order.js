// api/create-payment-order.js

// --- CORRECTED IMPORT for v5.x ---
// Import PGCashfree class AND Environment constants separately
const { PGCashfree, Environment } = require('cashfree-pg');
// --- END CORRECTED IMPORT ---

console.log("Function: /api/create-payment-order invoked."); // Log start

// --- Environment Variables ---
const cashfreeAppId = process.env.CASHFREE_APP_ID;
const cashfreeSecretKey = process.env.CASHFREE_SECRET_KEY;
// Determine environment using the imported Environment constants
const environment = process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION'
    ? Environment.PRODUCTION // Use imported Environment
    : Environment.SANDBOX;    // Use imported Environment (Default)

let cashfree; // Variable to hold the SDK instance

// --- Initialization Check & SDK Instantiation ---
if (!cashfreeAppId || !cashfreeSecretKey) {
    console.error("FATAL CONFIG ERROR: Cashfree credentials (CASHFREE_APP_ID or CASHFREE_SECRET_KEY) are missing in environment variables.");
    // SDK cannot be initialized without credentials, cashfree remains undefined
} else {
    try {
        // Initialize the SDK instance
        cashfree = new PGCashfree({
            clientId: cashfreeAppId,
            clientSecret: cashfreeSecretKey,
            environment: environment, // Pass the determined environment
        });
        // Use imported Environment for logging check
        console.log(`Cashfree SDK initialized successfully for environment: ${environment === Environment.PRODUCTION ? 'PRODUCTION' : 'SANDBOX'}.`);
    } catch (initError) {
        console.error("FATAL SDK INIT ERROR: Failed to initialize Cashfree SDK:", initError);
        // cashfree will remain undefined if initialization fails
    }
}

// Define the Cashfree API version to use
const CASHFREE_API_VERSION = "2023-08-01"; // Verify this is the latest/correct version you intend to use

// --- Serverless Function Handler ---
module.exports = async (req, res) => {
    console.log("Handler started for request method:", req.method);

    // --- Critical Checks Inside Handler ---
    // Check if credentials were provided
    if (!cashfreeAppId || !cashfreeSecretKey) {
        console.error("Handler Error: Credentials missing inside handler.");
        // Always return a valid JSON error response
        return res.status(500).json({ success: false, error: "Server configuration error: Payment credentials missing." });
    }
    // Check if SDK initialization failed earlier
    if (!cashfree) {
        console.error("Handler Error: Cashfree SDK not initialized (likely due to config or init error).");
        // Always return a valid JSON error response
        return res.status(500).json({ success: false, error: "Server configuration error: Payment SDK failed to initialize." });
    }
    // --- End Critical Checks ---

    // Only allow POST requests
    if (req.method !== 'POST') {
        console.log("Handler Error: Method not allowed:", req.method);
        res.setHeader('Allow', ['POST']);
        // Always return a valid JSON error response
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    // --- Main Logic: Create Payment Order ---
    try {
        const orderAmount = 99.00; // Fixed exam fee
        // Generate unique IDs for this specific order attempt
        const uniqueOrderId = `INTADD_EXAM_${Date.now()}`;
        const customerId = `CUST_${Date.now()}`;

        // --- Prepare Order Details for Cashfree API ---
        const request = {
            order_id: uniqueOrderId,
            order_amount: orderAmount,
            order_currency: "INR",
            customer_details: {
                customer_id: customerId,
                // Safely access potential body properties or use defaults
                customer_email: req.body?.email || "anonymous@internadda.com",
                customer_phone: req.body?.phone || "9999999999", // Ensure phone is a string
            },
            order_meta: {
                // IMPORTANT: Use environment variables for URLs or HARDCODE correctly for deployment
                // Ensure these are HTTPS URLs for production environments
                notify_url: process.env.PAYMENT_NOTIFY_URL || "https://internadda.com/api/payment-webhook", // Verify this matches your webhook setup
                return_url: process.env.PAYMENT_RETURN_URL || `https://internadda.com/intern/payment-status.html?order_id={order_id}`, // Verify this is your status page URL
            },
            order_note: "Internadda Final Exam Fee" // Optional note for the order
        };

        console.log(`Creating Cashfree Order (Order ID: ${uniqueOrderId}) with API version ${CASHFREE_API_VERSION}`);
        console.log("Request Payload being sent:", JSON.stringify(request, null, 2)); // Log the request details

        // --- Call Cashfree API using the initialized SDK ---
        const cfResponse = await cashfree.PGCreateOrder(CASHFREE_API_VERSION, request);

        // --- Log Cashfree Response Details ---
        console.log(`Cashfree PGCreateOrder Raw Response Status Code:`, cfResponse?.status); // Log HTTP status code received from Cashfree
        // Log key parts of the response data for debugging, avoid logging excessively large or sensitive data
        console.log(`Cashfree PGCreateOrder Response Data Snippet:`, {
            order_id: cfResponse?.data?.order_id, // Confirm order ID matches
            payment_session_id_exists: !!cfResponse?.data?.payment_session_id, // Check if session ID is present
            message: cfResponse?.data?.message, // Log any message from Cashfree
            code: cfResponse?.data?.code // Log any specific code from Cashfree
        });

        // --- Handle Cashfree Response ---
        // Check if the response contains the essential payment_session_id
        if (cfResponse?.data?.payment_session_id) {
            console.log(`Successfully created payment session for Order ID ${uniqueOrderId}. Session ID: ${cfResponse.data.payment_session_id}`);
            // ✅ SUCCESS: Return JSON with session ID and order ID
            return res.status(200).json({
                success: true,
                payment_session_id: cfResponse.data.payment_session_id,
                order_id: uniqueOrderId // Return the generated order ID as well
            });
        } else {
            // Handle cases where Cashfree API might respond (e.g., 200 OK) but without a session ID, or with an error structure in the data
            const errorMessage = cfResponse?.data?.message || "Payment session ID not found in Cashfree response.";
            const errorCode = cfResponse?.data?.code || "UNKNOWN_CASHFREE_ISSUE";
            console.error(`Cashfree Error (No Session ID) for Order ID ${uniqueOrderId}: Code: ${errorCode}, Message: ${errorMessage}`);

            // Determine an appropriate HTTP status code for the error, default to 500
            const errorStatusCode = typeof cfResponse?.status === 'number' && cfResponse.status >= 400 ? cfResponse.status : 500;

             // ❌ ERROR (but valid JSON): Return JSON error details
            return res.status(errorStatusCode).json({ success: false, error: errorMessage, details: cfResponse?.data });
        }

    } catch (error) {
        // --- Catch Block for Unexpected Errors ---
        console.error("!!! CATCH BLOCK ERROR in create-payment-order:", error); // Log the full error object

        // Attempt to extract meaningful error details (e.g., from Axios/Cashfree SDK error structure)
        let errorDetails = "Unknown server error";
        let errorStatusCode = 500; // Default to Internal Server Error

        if (error.response) {
            // Error likely came from the underlying HTTP request (e.g., Axios error within Cashfree SDK)
            errorDetails = error.response.data?.message || JSON.stringify(error.response.data) || `Cashfree API Error ${error.response.status}`;
            errorStatusCode = error.response.status || 500;
            console.error(`Cashfree API Error Details: Status=${errorStatusCode}, Data=${JSON.stringify(error.response.data)}`);
        } else if (error.message) {
            // General JavaScript error (e.g., coding mistake, network issue before request)
            errorDetails = error.message;
        }

        console.error(`Responding with status ${errorStatusCode} and error: ${errorDetails}`);
        // ❌ ERROR (but valid JSON): Return JSON error details
        return res.status(errorStatusCode).json({ success: false, error: "Failed to create payment order", details: errorDetails });
    }
};
