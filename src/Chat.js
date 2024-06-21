import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const database = getDatabase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userMessagesRef = ref(database, 'messages/' + user.uid);
        onValue(userMessagesRef, (snapshot) => {
          const data = snapshot.val();
          const messageList = data ? Object.values(data) : [];
          setMessages(messageList);
        });
      } else {
        setUser(null);
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [auth, database]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && user) {
      const userMessagesRef = ref(database, 'messages/' + user.uid);
      const newMessageRef = push(userMessagesRef);
      set(newMessageRef, { text: message, timestamp: Date.now() });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <h1>Private Chat</h1>
      <div className="messages-container">
        <ul className="messages">
          {messages.map((msg, index) => (
            <li key={index}>{msg.text}</li>
          ))}
        </ul>
      </div>
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
  );
}

export default Chat;
