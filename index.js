const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// USSD endpoint
app.post('/ussd', (req, res) => {
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

    // Send response back to Africa's Talking
    res.set('Content-Type', 'text/plain');
    res.send(response);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});