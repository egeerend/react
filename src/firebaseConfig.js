// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // Import getDatabase

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPs5yCvcBwsWFgmBb2sJAMAkKxvjikiDE",
  authDomain: "react-chat-5de7f.firebaseapp.com",
  databaseURL: "https://react-chat-5de7f-default-rtdb.firebaseio.com",
  projectId: "react-chat-5de7f",
  storageBucket: "react-chat-5de7f.appspot.com",
  messagingSenderId: "64427033362",
  appId: "1:64427033362:web:9ca08e31371b69b3abe9cb",
  measurementId: "G-FEJHYQE53H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Initialize database

export { database }; // Export database
