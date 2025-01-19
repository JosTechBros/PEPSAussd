const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// USSD endpoint (POST request only)
app.post('/ussd', async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';

    if (text === '') {
        // Initial menu
        response = `CON Thank you. To get a call from Duba Gari, Press 1, to stop, press 2
1. Get a call
2. STOP
3. Exit`;
    } else if (text === '1') {
        // User selected "Get a call"
        response = `END Successfull!!!. You will receive a call from Duba Gari.`;
    } else if (text === '2') {
        // User selected "STOP"
        response = `END UNSUBSCRIBED!!!. You have OPTED OUT of this service.`;
    } else if (text === '3') {
        // User selected "Exit"
        response = 'END Thank you for using our service.';
    } else {
        // Invalid input
        response = 'END Invalid input. Please try again.';
    }

    // If the user selects an option (1, 2, or 3), call the Cloud Function
    if (text === '1' || text === '2' || text === '3') {
        try {
            // Call the Cloud Function to store the response in Firestore
            await axios.post('https://us-central1-pepsa-viktll.cloudfunctions.net/handleUssdResponse', {
                phoneNumber,
                reply: text // Send the selected option (1, 2, or 3)
            });

            console.log('Response recorded successfully');
        } catch (error) {
            console.error('Error calling Cloud Function:', error);
        }
    }

    // Send response back to Africa's Talking
    res.set('Content-Type', 'text/plain');
    res.send(response);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});