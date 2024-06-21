import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]); // State to store messages
  const [message, setMessage] = useState(''); // State for the message input
  const [user, setUser] = useState(null); // State for current user
  const auth = getAuth(); // Firebase auth instance
  const database = getDatabase(); // Firebase database instance

  useEffect(() => {
    // Effect to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is authenticated
        setUser(user); // Set the current user state
        const userMessagesRef = ref(database, 'messages/' + user.uid); // Reference to user's messages
        onValue(userMessagesRef, (snapshot) => {
          // Listen for changes in user's messages
          const data = snapshot.val(); // Get the data from the snapshot
          const messageList = data ? Object.values(data) : []; // Convert data to array of messages
          setMessages(messageList); // Update messages state with the retrieved messages
        });
      } else {
        // If user is not authenticated
        setUser(null); // Clear the current user state
        setMessages([]); // Clear the messages state
      }
    });

    return () => unsubscribe(); // Clean up by unsubscribing from the onAuthStateChanged listener
  }, [auth, database]); // Dependencies for the effect

  const sendMessage = (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    if (message.trim() && user) {
      // Check if message is not empty and user is authenticated
      const userMessagesRef = ref(database, 'messages/' + user.uid); // Reference to user's messages
      const newMessageRef = push(userMessagesRef); // Generate a new message reference
      set(newMessageRef, { text: message, timestamp: Date.now() }); // Set the new message in the database
      setMessage(''); // Clear the message input after sending
    }
  };

  return (
    <div className="chat-container">
      <h1>Private Chat</h1>
      <div className="messages-container">
        <ul className="messages">
          {messages.map((msg, index) => (
            <li key={index}>{msg.text}</li> // Render each message
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
