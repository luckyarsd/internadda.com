// api/create-payment-order.js

// Import the main class
const { PGCashfree } = require('cashfree-pg');

console.log("Function: /api/create-payment-order invoked."); // Log start

// --- Environment Variables ---
const cashfreeAppId = process.env.CASHFREE_APP_ID;
const cashfreeSecretKey = process.env.CASHFREE_SECRET_KEY;

// --- FORCED PRODUCTION Environment ---
// Since Production keys are used, explicitly set the environment to "production"
const cashfreeEnvironment = "production";
console.log("Forcing Cashfree environment to: production"); // Log the forced environment
// --- END FORCED Environment ---

let cashfree; // Variable to hold the SDK instance

// --- Initialization Check & SDK Instantiation ---
if (!cashfreeAppId || !cashfreeSecretKey) {
    console.error("FATAL CONFIG ERROR: Cashfree credentials (CASHFREE_APP_ID or CASHFREE_SECRET_KEY) are missing in environment variables.");
} else {
    try {
        // Initialize the SDK instance using the FORCED production environment string
        cashfree = new PGCashfree({
            clientId: cashfreeAppId,
            clientSecret: cashfreeSecretKey,
            environment: cashfreeEnvironment, // Pass the string "production"
        });
        console.log(`Cashfree SDK initialized successfully for environment: ${cashfreeEnvironment.toUpperCase()}.`);
    } catch (initError) {
        console.error("FATAL SDK INIT ERROR: Failed to initialize Cashfree SDK:", initError);
        // cashfree will remain undefined if initialization fails
    }
}

// Define the Cashfree API version to use
const CASHFREE_API_VERSION = "2023-08-01"; // Verify this is the latest/correct version

// --- Serverless Function Handler ---
module.exports = async (req, res) => {
    console.log("Handler started for request method:", req.method);

    // --- Critical Checks Inside Handler ---
    if (!cashfreeAppId || !cashfreeSecretKey) {
        console.error("Handler Error: Credentials missing inside handler.");
        return res.status(500).json({ success: false, error: "Server configuration error: Payment credentials missing." });
    }
    // Check if SDK initialization failed earlier (most likely cause of the previous error)
    if (!cashfree) {
        console.error("Handler Error: Cashfree SDK not initialized. Check credentials and environment matching in Vercel logs.");
        return res.status(500).json({ success: false, error: "Server configuration error: Payment SDK failed to initialize." });
    }
    // --- End Critical Checks ---

    if (req.method !== 'POST') {
        console.log("Handler Error: Method not allowed:", req.method);
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    // --- Main Logic: Create Payment Order ---
    try {
        const orderAmount = 99.00;
        const uniqueOrderId = `INTADD_EXAM_${Date.now()}`;
        const customerId = `CUST_${Date.now()}`;

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
                // Ensure these URLs are correct for your DEPLOYED application
                notify_url: process.env.PAYMENT_NOTIFY_URL || "https://internadda.com/api/payment-webhook", // Replace if needed
                return_url: process.env.PAYMENT_RETURN_URL || `https://internadda.com/intern/payment-status.html?order_id={order_id}`, // Replace if needed
            },
            order_note: "Internadda Final Exam Fee"
        };

        console.log(`Creating Cashfree Order (Order ID: ${uniqueOrderId}) with API version ${CASHFREE_API_VERSION}`);
        console.log("Request Payload being sent:", JSON.stringify(request, null, 2));

        const cfResponse = await cashfree.PGCreateOrder(CASHFREE_API_VERSION, request);

        console.log(`Cashfree PGCreateOrder Raw Response Status Code:`, cfResponse?.status);
        console.log(`Cashfree PGCreateOrder Response Data Snippet:`, {
            order_id: cfResponse?.data?.order_id,
            payment_session_id_exists: !!cfResponse?.data?.payment_session_id,
            message: cfResponse?.data?.message,
            code: cfResponse?.data?.code
        });

        if (cfResponse?.data?.payment_session_id) {
            console.log(`Successfully created payment session for Order ID ${uniqueOrderId}. Session ID: ${cfResponse.data.payment_session_id}`);
            return res.status(200).json({
                success: true,
                payment_session_id: cfResponse.data.payment_session_id,
                order_id: uniqueOrderId
            });
        } else {
            const errorMessage = cfResponse?.data?.message || "Payment session ID not found in Cashfree response.";
            const errorCode = cfResponse?.data?.code || "UNKNOWN_CASHFREE_ISSUE";
            console.error(`Cashfree Error (No Session ID) for Order ID ${uniqueOrderId}: Code: ${errorCode}, Message: ${errorMessage}`);
            const errorStatusCode = typeof cfResponse?.status === 'number' && cfResponse.status >= 400 ? cfResponse.status : 500;
            return res.status(errorStatusCode).json({ success: false, error: errorMessage, details: cfResponse?.data });
        }

    } catch (error) {
        console.error("!!! CATCH BLOCK ERROR in create-payment-order:", error);
        let errorDetails = "Unknown server error";
        let errorStatusCode = 500;

        if (error.response) {
            errorDetails = error.response.data?.message || JSON.stringify(error.response.data) || `Cashfree API Error ${error.response.status}`;
            errorStatusCode = error.response.status || 500;
            console.error(`Cashfree API Error Details: Status=${errorStatusCode}, Data=${JSON.stringify(error.response.data)}`);
        } else if (error.message) {
            errorDetails = error.message;
        }

        console.error(`Responding with status ${errorStatusCode} and error: ${errorDetails}`);
        return res.status(errorStatusCode).json({ success: false, error: "Failed to create payment order", details: errorDetails });
    }
};
