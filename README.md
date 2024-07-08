# Hotel Booking Chatbot

Welcome to the Hotel Booking Chatbot application, built using Express.js, OpenAI's API, and React.

## Setup Instructions

### Backend

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the backend directory in this format :
   ```
   OPENAI_API_KEY=your_open_api_key
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   ```
   
4. Start the backend server: `npm start`

### Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the frontend development server: `npm start`

## Using the Chatbot

1. Open your browser and go to [http://localhost:3000](http://localhost:3000)
2. Start chatting with the bot to book a hotel room.
3. The chatbot will guide you through the process of viewing room options and making a booking.

## API Endpoints

### POST /api/chat

Send a message to the chatbot and receive a response.

Request body:
```
"userId": "unique_user_id",
"message": "I want to book a room"
```
Response :- 
```
  "response": "Certainly! I'd be happy to help you book a room. Let me fetch the available room options for you."
```
Testing :- 
```
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "message": "I want to book a room"}'
```


# Demo Video

https://drive.google.com/file/d/1YZjY4sSAutYpqmitU9WU3bVBZPapOv3x/view?usp=drive_link
