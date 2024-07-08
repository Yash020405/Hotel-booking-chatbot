const express = require('express');
const router = express.Router();
const { generateResponse,getRoomOptions, bookRoom  } = require('../controllers/chatController');
const Conversation = require('../models/conversation');

router.post('/chat', async (req, res) => {
  try {
    const { userId, message } = req.body;
    console.log(userId, message);

    let conversation = await Conversation.findOne({ where: { userId } });
    if (!conversation) {
      conversation = await Conversation.create({ userId, messages: [] });
    }

    const messages = [...conversation.messages, { role: 'system', content: 'You are a helpful assistant primarily for hotel bookings. If the user asks about something unrelated to hotel bookings, politely inform them that you specialize in hotel bookings and offer to assist with that' }, { role: 'user', content: message }];

    const response = await generateResponse(messages);

    if (response.function_call) {
      let functionResult;
      if (response.function_call.name === 'get_room_options') {
        functionResult = await getRoomOptions();
      } else if (response.function_call.name === 'book_room') {
        const { roomId, fullName, email, nights } = JSON.parse(response.function_call.arguments);
        functionResult = await bookRoom(roomId, fullName, email, nights);
      }

      messages.push(response);
      messages.push({
        role: 'function',
        name: response.function_call.name,
        content: JSON.stringify(functionResult)
      });

      const finalResponse = await generateResponse(messages);
      messages.push(finalResponse);
    } else {
      messages.push(response);
    }

    await conversation.update({ messages });

    res.json({ response: messages[messages.length - 1].content });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;