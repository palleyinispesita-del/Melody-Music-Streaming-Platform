import React, { useState } from 'react';

function Login({ onLogin }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const enteredEmail = email.trim().toLowerCase();

    if (
      enteredEmail === 'admin@melody.com' &&
      password === 'Admin@123'
    ) {
      onLogin({
        email: enteredEmail,
        role: 'admin'
      });
    }

    else if (
      enteredEmail === 'user@melody.com' &&
      password === 'User@123'
    ) {
      onLogin({
        email: enteredEmail,
        role: 'user'
      });
    }

    else {
      setError('Invalid email or password!');
    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1 className="login-logo">♫ Melody</h1>

        <h2>Welcome Back!</h2>

        <p>Login to continue your musical journey.</p>

        <form onSubmit={handleLogin}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            required
          />

          {error && (
            <p className="login-error">{error}</p>
          )}

          <button type="submit">
            Login
          </button>

        </form>

        <div className="demo-credentials">

          <p><strong>Admin Demo</strong></p>
          <p>admin@melody.com</p>
          <p>Admin@123</p>

          <hr />

          <p><strong>User Demo</strong></p>
          <p>user@melody.com</p>
          <p>User@123</p>

        </div>

        <p className="login-footer">
          Experience music with Melody 🎵
        </p>

      </div>

    </div>

  );
}

export default Login;