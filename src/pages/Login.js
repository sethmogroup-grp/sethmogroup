import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Login.css';
import './AuthExtra.css';
import logoLight from '../assets/sethmo-logo-light.png';
import { useAuth } from '../services/AuthContext';
import { requestPasswordReset } from '../services/accountService';
import { API_URL } from '../services/auth';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useAuth();

  const expired = params.get('expired') === '1';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user); // stores the token + the user's role & permissions
        navigate('/', { replace: true });
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      setError("Server connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await requestPasswordReset(credentials.email);
      setNotice(data.message);
    } catch (err) {
      setError(err.message);
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
          <img className="login-logo" src={logoLight} alt="Sethmo Group" />
          <h1>Inspired <br/> By <span className="text-yellow">You.</span></h1>
          <p className="visual-tagline">Sethmo Group Admin Portal v2.0</p>
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="login-form-side">
        <div className="form-wrapper">
          {!forgot ? (
            <>
              <h2 className="form-title">LOGIN</h2>
              <p className="form-subtitle">
                Sign in with your own account. What you can see depends on your role.
              </p>

              {expired && !error && <p className="notice-msg">Your session has ended. Please log in again.</p>}

              <form onSubmit={handleLogin} className="modern-form">
                <div className="input-field">
                  <input
                    type="email"
                    placeholder="ENTER YOUR EMAIL"
                    autoComplete="username"
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    required
                  />
                </div>
                <div className="input-field">
                  <input
                    type="password"
                    placeholder="PASSWORD"
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    required
                  />
                </div>

                <div className="form-options">
                  <button type="button" className="forgot-btn" onClick={() => { setForgot(true); setError(''); setNotice(''); }}>
                    Forgot Password?
                  </button>
                </div>

                {error && <p className="error-msg">{error}</p>}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'AUTHENTICATING...' : 'LOGIN'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="form-title">RESET PASSWORD</h2>
              <p className="form-subtitle">
                Enter your account email and we will send you a link to choose a new password.
              </p>

              <form onSubmit={handleForgot} className="modern-form">
                <div className="input-field">
                  <input
                    type="email"
                    placeholder="ENTER YOUR EMAIL"
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    required
                  />
                </div>

                {error && <p className="error-msg">{error}</p>}
                {notice && <p className="notice-msg">{notice}</p>}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'SENDING...' : 'SEND RESET LINK'}
                </button>
                <button type="button" className="forgot-btn back-link" onClick={() => { setForgot(false); setError(''); setNotice(''); }}>
                  Back to login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
