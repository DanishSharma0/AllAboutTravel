import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-page {
          min-height: 100vh;
          width: 100%;
          background-image: url('/mountain-bg.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        /* Overlay */
        .auth-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.60) 0%,
            rgba(0,0,0,0.20) 45%,
            rgba(0,0,0,0.50) 100%
          );
          pointer-events: none;
        }

        /* ── Transparent Navbar ── */
        .auth-navbar {
          position: relative;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px clamp(24px, 5vw, 80px);
        }

        .auth-nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: 0.3px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }

        .auth-nav-logo span.logo-icon {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          border-radius: 9px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
        }

        .auth-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .auth-nav-links a {
          color: rgba(255,255,255,0.80);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .auth-nav-links a:hover { color: #ffffff; }

        .auth-nav-links .nav-btn {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.30);
          border-radius: 8px;
          padding: 8px 20px;
          color: #ffffff !important;
          font-weight: 600;
          backdrop-filter: blur(6px);
          transition: background 0.2s, border-color 0.2s;
        }

        .auth-nav-links .nav-btn:hover {
          background: rgba(255,255,255,0.25);
        }

        /* ── Body ── */
        .auth-body {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        /* ── Glass Card ── */
        .glass-card {
          width: 420px;
          min-width: 320px;
          margin-left: clamp(32px, 6vw, 100px);
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 20px;
          padding: 44px 42px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
          animation: slideInLeft 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes slideInLeft {
          from { opacity:0; transform: translateX(-40px); }
          to   { opacity:1; transform: translateX(0); }
        }

        .card-title {
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
          letter-spacing: -0.3px;
        }

        .card-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          margin-bottom: 30px;
        }

        /* Error */
        .error-banner {
          background: rgba(239,68,68,0.18);
          border: 1px solid rgba(239,68,68,0.40);
          color: #fca5a5;
          border-radius: 10px;
          padding: 11px 15px;
          font-size: 13.5px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        /* Fields */
        .field { margin-bottom: 18px; }

        .field label {
          display: block;
          font-size: 12.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.70);
          margin-bottom: 7px;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .input-wrap { position: relative; }

        .input-wrap .ico {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.40);
          width: 16px;
          height: 16px;
          pointer-events: none;
        }

        .field input {
          width: 100%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 10px;
          padding: 13px 14px 13px 40px;
          color: #ffffff;
          font-size: 14.5px;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          outline: none;
        }

        .field input::placeholder { color: rgba(255,255,255,0.28); }

        .field input:focus {
          background: rgba(255,255,255,0.12);
          border-color: rgba(14,165,233,0.75);
          box-shadow: 0 0 0 3px rgba(14,165,233,0.18);
        }

        .toggle-pw {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.40);
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .toggle-pw:hover { color: rgba(255,255,255,0.80); }

        /* Row */
        .form-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 26px;
        }

        .remember {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          color: rgba(255,255,255,0.60);
          cursor: pointer;
          user-select: none;
        }
        .remember input[type="checkbox"] {
          width: 14px; height: 14px;
          accent-color: #0ea5e9;
          cursor: pointer;
        }

        .forgot-link {
          font-size: 13px;
          color: rgba(255,255,255,0.60);
          text-decoration: none;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: #38bdf8; }

        /* Button */
        .btn-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0284c7, #0ea5e9);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          letter-spacing: 0.4px;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 20px rgba(2,132,199,0.45);
          margin-bottom: 18px;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(2,132,199,0.55);
        }
        .btn-submit:active:not(:disabled) { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.60; cursor: not-allowed; }

        .spinner {
          display: inline-block;
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .alt-link {
          text-align: center;
          font-size: 13.5px;
          color: rgba(255,255,255,0.50);
        }
        .alt-link a {
          color: #f97316;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .alt-link a:hover { color: #fb923c; }

        /* Quote Side */
        .quote-side {
          flex: 1;
          padding: clamp(32px,6vw,80px);
          padding-left: clamp(48px,8vw,100px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          animation: fadeInRight 1s ease 0.3s both;
        }
        @keyframes fadeInRight {
          from { opacity:0; transform: translateX(30px); }
          to   { opacity:1; transform: translateX(0); }
        }

        .quote-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 3.2vw, 44px);
          font-weight: 800;
          color: #fff;
          line-height: 1.18;
          max-width: 500px;
          margin-bottom: 16px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }

        .quote-divider {
          width: 56px; height: 3px;
          background: linear-gradient(to right, #f97316, #0ea5e9);
          border-radius: 2px;
          margin-bottom: 16px;
        }

        .quote-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.65);
          line-height: 1.65;
          max-width: 360px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .auth-navbar { padding: 16px 20px; }
          .auth-nav-links a:not(.nav-btn) { display: none; }
          .auth-body { flex-direction: column; align-items: center; padding: 24px 16px; }
          .glass-card { margin-left: 0; width: 100%; max-width: 420px; padding: 32px 24px; }
          .quote-side { padding: 28px 16px; align-items: center; text-align: center; }
          .quote-divider { margin: 0 auto 16px; }
        }
      `}</style>

      <div className="auth-page">

        {/* ── Transparent Navbar ── */}
        <nav className="auth-navbar">
          <Link to="/" className="auth-nav-logo">
            <span className="logo-icon">🏔️</span>
            AllaboutTravel
          </Link>
          <div className="auth-nav-links">
            <Link to="/">Home</Link>
            <Link to="/hostels">Hostels</Link>
            <Link to="/places">Places</Link>
            <Link to="/register" className="nav-btn">Register</Link>
          </div>
        </nav>

        {/* ── Main Body ── */}
        <div className="auth-body">

          {/* Glass Card */}
          <div className="glass-card">
            <h1 className="card-title">Welcome Back</h1>
            <p className="card-subtitle">Sign in to continue your adventure</p>

            {error && (
              <div className="error-banner">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="field">
                <label htmlFor="login-email">Email</label>
                <div className="input-wrap">
                  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field">
                <label htmlFor="login-password">Password</label>
                <div className="input-wrap">
                  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="form-row">
                <label className="remember">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <><span className="spinner" />Signing in...</> : 'Sign In'}
              </button>

              <p className="alt-link">
                Don't have an account? <Link to="/register">Create one here</Link>
              </p>
            </form>
          </div>

          {/* Quote Side */}
          <div className="quote-side">
            <p className="quote-text">THE MOUNTAINS ARE CALLING AND I MUST GO.</p>
            <div className="quote-divider" />
            <p className="quote-sub">
              Explore breathtaking destinations, discover hidden trails, and book the adventure of a lifetime — all in one place.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
