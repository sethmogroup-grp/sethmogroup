import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Login.css';
import './AuthExtra.css';
import logoLight from '../assets/sethmo-logo-light.png';
import { resetPassword } from '../services/accountService';

/** Opened from the link in an invitation or "forgot password" email: /reset-password?token=... */
const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('The two passwords do not match.'); return; }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container">
      <div className="login-visual">
        <div className="visual-overlay"></div>
        <div className="visual-content">
          <img className="login-logo" src={logoLight} alt="Sethmo Group" />
          <h1>Inspired <br/> By <span className="text-yellow">You.</span></h1>
          <p className="visual-tagline">Sethmo Group Admin Portal v2.0</p>
        </div>
      </div>

      <div className="login-form-side">
        <div className="form-wrapper">
          <h2 className="form-title">CHOOSE PASSWORD</h2>

          {!token ? (
            <p className="error-msg">This link is not valid. Please use the link from your email.</p>
          ) : done ? (
            <>
              <p className="notice-msg">Your password has been saved.</p>
              <Link to="/login" className="submit-btn" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', lineHeight: '48px' }}>
                GO TO LOGIN
              </Link>
            </>
          ) : (
            <>
              <p className="form-subtitle">Pick a new password for your admin account.</p>
              <form onSubmit={submit} className="modern-form">
                <div className="input-field">
                  <input type="password" placeholder="NEW PASSWORD" autoComplete="new-password"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="input-field">
                  <input type="password" placeholder="CONFIRM PASSWORD" autoComplete="new-password"
                    value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                </div>
                <p className="pw-hint">At least 10 characters, with letters and numbers.</p>

                {error && <p className="error-msg">{error}</p>}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'SAVING...' : 'SAVE PASSWORD'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
