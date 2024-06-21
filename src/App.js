import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { database } from './firebaseConfig'; // Import Firebase configuration
import logo from './logo.svg';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const messagesRef = ref(database, 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messageList = data ? Object.values(data) : [];
      setMessages(messageList);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messagesRef = ref(database, 'messages');
      const newMessageRef = push(messagesRef);
      set(newMessageRef, { text: message });
      setMessage('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Chat App</h1>
        <div className="chat-container">
          <ul className="messages">
            {messages.map((msg, index) => (
              <li key={index}>{msg.text}</li>
            ))}
          </ul>
          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
