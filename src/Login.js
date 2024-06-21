import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const database = getDatabase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User registered:', user);

        // Save username to database
        await set(ref(database, 'users/' + user.uid), {
          username: username,
          email: email,
        });

      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User logged in:', user);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message); // Display error message to the user
    }
  };

  return (
    <div style={{ fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`, WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
