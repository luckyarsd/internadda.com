// File: /api/verify-application.js

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    // 2. Securely get the list from Vercel's environment
    const validNumbersList = process.env.VALID_APP_NUMBERS_LIST || '';
    const validNumbersArray = validNumbersList.split(',');

    // 3. Get the number the user sent from the browser
    const { applicationNumber } = req.body;

    if (!applicationNumber) {
      return res.status(400).json({ valid: false, message: 'No application number provided.' });
    }

    // 4. Check if the user's number is in the valid list
    const isNumberValid = validNumbersArray.includes(applicationNumber.trim().toUpperCase());

    if (isNumberValid) {
      // 5. Send a "valid: true" response
      return res.status(200).json({ valid: true });
    } else {
      // 6. Send a "valid: false" response
      return res.status(400).json({ valid: false, message: 'Invalid Application Number.' });
    }

  } catch (error) {
    // Handle any server errors
    console.error('Verification Error:', error);
    return res.status(500).json({ valid: false, message: 'Server error. Please try again.' });
  }
}
