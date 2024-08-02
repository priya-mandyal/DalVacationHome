const axios = require('axios');

exports.index = async (req, res) => {
    try {
        const { queryResult } = req.body;
        const intentDisplayName = queryResult.intent.displayName;
        const referenceCode = queryResult.parameters.reference_code;
        const concern = queryResult.parameters.concern;
        const name = queryResult.parameters.name;
        const emailId = queryResult.parameters.emailId;

        if (!referenceCode) {
            return res.json('Reference code is required.');
        }

        const AWS_API_URL = 'https://zp9a6wdnkc.execute-api.us-east-1.amazonaws.com/dev/bookingDetails';

        const fetchBookingDetails = async (referenceCode) => {
            const response = await axios.get(`${AWS_API_URL}?reference_code=${referenceCode}`);
            if (response.status !== 200) {
                return res.json('No booking details found with your booking reference code.');
            }
            return response.data;
        };

        let fulfillmentText = '';

        if (intentDisplayName === 'BookingDetails') {
            const bookingDetails = await fetchBookingDetails(referenceCode);

            fulfillmentText = `Here are your booking details:\n\n`;
            fulfillmentText += `Room Number: ${bookingDetails.roomNumber}\n`;
            fulfillmentText += `Start Date: ${bookingDetails.startDate}\n`;
            fulfillmentText += `End Date: ${bookingDetails.endDate}\n`;
            fulfillmentText += `Comment: ${bookingDetails.comment || 'No additional comments'}`;
        }

        if (intentDisplayName === 'TalkToAnAgent') {
            const bookingDetails = await fetchBookingDetails(referenceCode);

            const data = {
                bookingId: referenceCode,
                username: name,
                email: emailId,
                concern: concern
            };

            const TICKET_FUNCTION_URL = 'https://us-east1-csci5408fall2023.cloudfunctions.net/ticket-function';

            const response = await axios.post(TICKET_FUNCTION_URL, data);
            
            if (response.status !== 200) {
                return res.json('Error forwarding your concern to a property agent.');
            }

            fulfillmentText = `Your concern has been forwarded to a property agent. They will contact you shortly.`;
        }

        return res.json({
            fulfillmentText
        });
    } catch (error) {
        console.error('Error fetching or processing intent:', error);
        return res.status(500).json({ error: 'Error fetching or processing intent.' });
    }
};
