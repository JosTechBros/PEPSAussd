const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // For making HTTP requests

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// USSD endpoint (POST request only)
app.post('/ussd', async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';

    if (text === '') {
        // Initial menu
        response = `CON Welcome to My USSD App
1. Check Balance
2. Buy Airtime
3. Exit`;
    } else if (text === '1') {
        // User selected "Check Balance"
        response = `CON Your balance is KES 100.
1. Back to Menu
2. Exit`;
    } else if (text === '1*1') {
        // User selected "Back to Menu" from balance
        response = `CON Welcome to My USSD App
1. Check Balance
2. Buy Airtime
3. Exit`;
    } else if (text === '1*2') {
        // User selected "Exit" from balance
        response = 'END Thank you for using our service.';
    } else if (text === '2') {
        // User selected "Buy Airtime"
        response = `CON Enter amount to buy airtime:
1. Back to Menu
2. Exit`;
    } else if (text.startsWith('2*')) {
        // User entered amount for airtime
        const amount = text.split('*')[1];
        response = `END You have successfully bought airtime worth KES ${amount}.`;
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
            await axios.post('https://us-central1-your-project-id.cloudfunctions.net/handleUssdResponse', {
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