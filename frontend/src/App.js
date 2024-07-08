import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { TextField, Button, Paper, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const theme = createTheme({
  palette: {
    primary: {
      main: '#128C7E',
    },
    secondary: {
      main: '#25D366',
    },
    background: {
      default: '#ECE5DD',
    },
  },
});

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ECE5DD;
`;

const Header = styled(Paper)`
  padding: 20px;
  background-color: #128C7E !important;
  color: white !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
  text-align: center;
`;

const ChatContainer = styled(Paper)`
  flex: 1;
  overflow-y: auto;
  margin: 20px;
  padding: 20px;
  background-color: #F8F9FA !important;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
`;

const Message = styled(Paper)`
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 70%;
  background: ${props => (props.isUser ? '#DCF8C6' : '#FFF')};
  color: ${props => (props.isUser ? 'black' : 'black')};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.form`
  display: flex;
  padding: 10px;
  background-color: #F0F0F0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 20px;
    background-color: white;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 20px !important;
  padding: 10px 20px !important;
  margin-left: 10px !important;
  background: #128C7E !important;
  color: white !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;

  &:hover {
    background: #075E54 !important;
  }
`;

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const sendInitialMessage = async () => {
      const initialMessage = { type: 'bot', content: 'Hey, how may I help you?' };
      setMessages([initialMessage]);
    };

    sendInitialMessage();
  }, []);

  const sendMessage = async (messageText) => {
    if (messageText.trim() === '') return;

    const userMessage = { type: 'user', content: messageText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:3000/api/chat', {
        userId,
        message: messageText,
      });

      const botMessage = { type: 'bot', content: response.data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { type: 'error', content: 'An error occurred. Please try again.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    sendMessage(input);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <AppContainer>
          <Header elevation={3}>
            <Typography variant="h4" style={{ fontWeight: 'bold' }}>Hotel Booking Assistant</Typography>
          </Header>
          <ChatContainer elevation={2}>
            {messages.map((message, index) => (
              <MessageContainer key={index} isUser={message.type === 'user'}>
                <Message isUser={message.type === 'user'} elevation={1}>
                  <Typography>{message.content}</Typography>
                </Message>
              </MessageContainer>
            ))}
            <div ref={messagesEndRef} />
          </ChatContainer>
          <InputContainer onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <StyledButton
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
            >
              Send
            </StyledButton>
          </InputContainer>
        </AppContainer>
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;