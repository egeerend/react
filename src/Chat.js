import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const auth = getAuth();
  const database = getDatabase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Get username from database
        const userRef = ref(database, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUsername(data.username);
        });

        // Fetch messages for the logged-in user
        const userMessagesRef = ref(database, 'messages/' + user.uid);
        onValue(userMessagesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            console.log('Fetched messages:', data); // Debug log
            const messageList = Object.values(data);
            setMessages(messageList);
          } else {
            setMessages([]);
          }
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
    if (message.trim() && recipient.trim() && user) {
      const recipientRef = ref(database, 'messages/' + recipient);
      const newMessageRef = push(recipientRef);
      set(newMessageRef, { sender: username, text: message, timestamp: Date.now() });
      setMessage('');
      setRecipient('');
    }
  };

  return (
    <div className="chat-container">
      <h1>Private Chat</h1>
      {user && <p>Logged in as: {user.email}</p>}
      <div className="messages-container">
        <ul className="messages">
          {messages.map((msg, index) => (
            <li key={index}>{msg.sender}: {msg.text}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient username..."
          required
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
