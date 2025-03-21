const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
    res.send('USSD service is running!');
});

// USSD endpoint
app.post('/ussd', async (req, res) => {
    console.log('Received USSD request:', req.body); // Log the request body
    const { sessionId, serviceCode, phoneNumber, text: rawText } = req.body;

    // Trim whitespace from the text field
    const text = rawText.trim();

    let response = '';

    if (text === '') {
        // Initial menu
        response = `CON Welcome to the PEPSA USSD Portal.
    Press 1 For details of monthly sanitation,
    Press 2 For guidelines,
    Press 3 To report issues.`;
    } else if (text === '1') {
        response = `END Monthly sanitation holds last Saturday of every month 6:30am to 10:00am!`;
    } else if (text === '2') {
        response = `END  Guidelines
1.Do not defecate outside; use a toilet.
2.Do not dump refuse in drainages or on roadsides.
3.Always participate in the monthly sanitation exercise.`;
    } else if (text === '3') {
        response = 'END To report an issue, kindly call 07044283993.';
    } else {
        response = 'END Invalid input. Please try again.';
    }

    console.log('Sending response:', response); // Log the response

    // Send response back to Africa's Talking
    res.set('Content-Type', 'text/plain');
    res.send(response);

    // Call the Cloud Function in the background (if applicable)
    if (text === '1' || text === '2' || text === '3') {
        try {
            await axios.post('https://us-central1-pepsagov.cloudfunctions.net/handleUssdResponse', {
                phoneNumber,
                reply: text
            });
            console.log('Cloud Function response recorded successfully');
        } catch (error) {
            console.error('Error calling Cloud Function:', error);
        }
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});