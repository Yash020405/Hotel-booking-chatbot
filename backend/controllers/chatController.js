const OpenAI = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const axios = require('axios');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function getRoomOptions() {
  try {
    const response = await axios.get('https://bot9assignement.deno.dev/rooms');
    return response.data;
  } catch (error) {
    console.error('Error fetching room options:', error);
    throw error;
  }
}

async function bookRoom(roomId, fullName, email, nights) {
  try {
    const response = await axios.post('https://bot9assignement.deno.dev/book', {
      roomId,
      fullName,
      email,
      nights
    });
    console.log('Response', response.data);

    await sendConfirmationEmail(fullName, email, response.data);
    return response.data;
  } catch (error) {
    console.error('Error booking room:', error);
    throw error;
  }
}

async function sendConfirmationEmail(fullName, email, bookingDetails) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Booking Confirmation',
    html: `
      <h1>Booking Confirmation</h1>
      <p>Dear ${fullName},</p>
      <p>Thank you for booking with Taj Hotels. Your reservation details are as follows:</p>
      <ul>
        <li>Booking ID: ${bookingDetails.bookingId}</li>
        <li>Room Type: ${bookingDetails.roomName}</li>
        <li>Number of Nights: ${bookingDetails.nights}</li>
        <li>Total Price: $${bookingDetails.totalPrice}</li>
      </ul>
      <p>We look forward to welcoming you to Taj Hotel!</p>
    `
  };

  console.log(bookingDetails.roomType, "room type");

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}


async function generateResponse(messages) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      functions: [
        {
          name: "get_room_options",
          description: "Get available room options from the hotel",
          parameters: {
            type: "object",
            properties: {},
            required: []
          }
        },
        {
          name: "book_room",
          description: "Book a room at the hotel",
          parameters: {
            type: "object",
            properties: {
              roomId: {
                type: "integer",
                description: "The ID of the room to book"
              },
              fullName: {
                type: "string",
                description: "Full name of the guest"
              },
              email: {
                type: "string",
                description: "Email address of the guest"
              },
              nights: {
                type: "integer",
                description: "Number of nights to stay"
              }
            },
            required: ["roomId", "fullName", "email", "nights"]
          }
        }
      ]
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

module.exports = { generateResponse ,getRoomOptions, bookRoom };