import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './Login';
import Chat from './Chat';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const auth = getAuth();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user); // Add this log to debug
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/chat"
            element={isAuthenticated ? <Chat /> : <Navigate to="/login" />}
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
