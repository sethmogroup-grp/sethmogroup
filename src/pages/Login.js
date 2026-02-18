import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: credentials.email, // Matches info@sethmogroup.com
          password: credentials.password 
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token); // Store JWT
        navigate('/', { replace: true }); // Redirect to Dashboard
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError("Server connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container">
      {/* Left Side: Visual Branding */}
      <div className="login-visual">
        <div className="visual-overlay"></div>
        <div className="visual-content">
          <div className="mini-logo">SG</div>
          <h1>Inspired <br/> By <span className="text-yellow">You.</span></h1>
          <p className="visual-tagline">Sethmo Group Admin Portal v2.0</p>
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="login-form-side">
        <div className="form-wrapper">
          <h2 className="form-title">LOGIN</h2>
          <p className="form-subtitle">
            Please enter your admin credentials to access the ecosystem.
          </p>
          
          <form onSubmit={handleLogin} className="modern-form">
            <div className="input-field">
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required 
              />
            </div>
            <div className="input-field">
              <input 
                type="password" 
                placeholder="PASSWORD"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required 
              />
            </div>

            <div className="form-options">
              <button type="button" className="forgot-btn">Forgot Password?</button>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;