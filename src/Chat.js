import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { auth, database } from './firebaseConfig'; // Adjust path as needed
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userRef = ref(database, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setUsername(userData.username);
          }
        });

        const messagesRef = ref(database, 'messages');
        onValue(messagesRef, (snapshot) => {
          const messageData = snapshot.val();
          if (messageData) {
            const messageList = Object.values(messageData);
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
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && recipient.trim() && user) {
      const messagesRef = ref(database, 'messages');
      const newMessageRef = push(messagesRef);
      set(newMessageRef, {
        sender: username,
        receiver: recipient,
        text: message,
        timestamp: Date.now()
      });
      setMessage('');
      setRecipient('');
    }
  };

  return (
    <div className="chat-container">
      <h1>Private Chat</h1>
      {user ? <p>Logged in as: {user.email}</p> : <p>Loading...</p>}

      <div className="messages-container">
        {messages.length > 0 ? (
          <ul className="messages">
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{msg.sender}:</strong> {msg.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages yet</p>
        )}
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
