import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import './Chat.css';
import { auth, database } from './firebaseConfig'; // Import Firebase config and auth/database

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const authInstance = getAuth(auth); // Initialize auth instance
    const dbInstance = getDatabase(database); // Initialize database instance

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        setUser(user);
        // Get username from database
        const userRef = ref(dbInstance, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUsername(data.username);
          }
        });

        // Fetch messages for the logged-in user
        const messagesRef = ref(dbInstance, 'messages');
        onValue(messagesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const messageList = Object.values(data).filter(
              (msg) =>
                msg.sender === username ||
                msg.receiver === username
            );
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
  }, [username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && recipient.trim() && user) {
      const dbInstance = getDatabase(database); // Initialize database instance

      const messagesRef = ref(dbInstance, 'messages');
      const newMessageRef = push(messagesRef);
      set(newMessageRef, {
        sender: username,
        receiver: recipient,
        text: message,
        timestamp: Date.now(),
      });
      setMessage('');
      setRecipient('');
    }
  };

  return (
    <div className="chat-container">
      <h1>Private Chat</h1>
      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>Loading...</p>
      )}
      <div className="messages-container">
        <ul className="messages">
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.sender}</strong>: {msg.text}
            </li>
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
