// Chat.js
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, set } from 'firebase/database';
import { auth } from './firebaseConfig'; // Adjust the path as per your project structure

function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const database = getDatabase();

  useEffect(() => {
    // Listen for incoming messages
    const messagesRef = ref(database, 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });
  }, [database]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      const newMessageRef = push(ref(database, 'messages'));
      const user = auth.currentUser;
      const username = user ? user.email : 'Anonymous';
      const timestamp = Date.now();
      
      await set(newMessageRef, {
        sender: username,
        text: messageText,
        timestamp: timestamp,
      });

      setMessageText('');
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
