import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'CUSTOMER',
    businessName: '',
    businessLocation: '',
    businessDescription: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      };

      if (formData.role === 'PROVIDER') {
        payload.businessDetails = {
          businessName: formData.businessName,
          location: formData.businessLocation,
          description: formData.businessDescription
        };
      }

      const response = await authAPI.register(payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setToken(response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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

        .auth-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.62) 0%,
            rgba(0,0,0,0.22) 48%,
            rgba(0,0,0,0.50) 100%
          );
          pointer-events: none;
        }

        
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
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }

        .logo-icon {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          border-radius: 9px;
          width: 34px; height: 34px;
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
          transition: background 0.2s;
        }
        .auth-nav-links .nav-btn:hover { background: rgba(255,255,255,0.25); }

        
        .auth-body {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 20px 0 32px;
        }

        
        .glass-card {
          width: 440px;
          min-width: 320px;
          margin-left: clamp(32px, 6vw, 100px);
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 20px;
          padding: 40px 42px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
          animation: slideInLeft 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes slideInLeft {
          from { opacity:0; transform: translateX(-40px); }
          to   { opacity:1; transform: translateX(0); }
        }

        .card-title {
          font-size: 25px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 5px;
          letter-spacing: -0.3px;
        }

        .card-subtitle {
          font-size: 13.5px;
          color: rgba(255,255,255,0.52);
          margin-bottom: 26px;
        }

        
        .role-toggle {
          display: flex;
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .role-btn {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .role-btn.active {
          background: #fff;
          color: #1a202c;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        
        .fields-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        
        .error-banner {
          background: rgba(239,68,68,0.18);
          border: 1px solid rgba(239,68,68,0.40);
          color: #fca5a5;
          border-radius: 10px;
          padding: 11px 15px;
          font-size: 13px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        
        .field { margin-bottom: 16px; }

        .field label {
          display: block;
          font-size: 11.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          margin-bottom: 6px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .input-wrap { position: relative; }

        .input-wrap .ico {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.38);
          width: 15px; height: 15px;
          pointer-events: none;
        }

        .field input {
          width: 100%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 10px;
          padding: 12px 14px 12px 38px;
          color: #fff;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          outline: none;
        }
        .field input::placeholder { color: rgba(255,255,255,0.26); }
        .field input:focus {
          background: rgba(255,255,255,0.12);
          border-color: rgba(14,165,233,0.75);
          box-shadow: 0 0 0 3px rgba(14,165,233,0.18);
        }
        
        .field.no-icon input {
          padding-left: 14px;
        }

        .toggle-pw {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.38);
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .toggle-pw:hover { color: rgba(255,255,255,0.80); }

        
        .btn-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #f97316, #e65100);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          letter-spacing: 0.4px;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 20px rgba(249,115,22,0.40);
          margin-top: 6px;
          margin-bottom: 16px;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(249,115,22,0.50);
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
          font-size: 13px;
          color: rgba(255,255,255,0.48);
        }
        .alt-link a {
          color: #38bdf8;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .alt-link a:hover { color: #7dd3fc; }

        
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
          max-width: 480px;
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
          color: rgba(255,255,255,0.62);
          line-height: 1.65;
          max-width: 360px;
        }

        
        .perks { list-style: none; margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
        .perks li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: rgba(255,255,255,0.75);
        }
        .perk-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #0ea5e9);
          flex-shrink: 0;
        }

        
        @media (max-width: 768px) {
          .auth-navbar { padding: 16px 20px; }
          .auth-nav-links a:not(.nav-btn) { display: none; }
          .auth-body { flex-direction: column; align-items: center; padding: 16px 16px 32px; }
          .glass-card { margin-left: 0; width: 100%; max-width: 440px; padding: 28px 20px; }
          .fields-row { grid-template-columns: 1fr; }
          .quote-side { padding: 24px 16px; align-items: center; text-align: center; }
          .quote-divider { margin: 0 auto 16px; }
          .perks { align-items: flex-start; }
        }
      `}</style>

      <div className="auth-page">

        {}
        <nav className="auth-navbar">
          <Link to="/" className="auth-nav-logo">
            <span className="logo-icon">🏔️</span>
            AllaboutTravel
          </Link>
          <div className="auth-nav-links">
            <Link to="/">Home</Link>
            <Link to="/hostels">Hostels</Link>
            <Link to="/places">Places</Link>
            <Link to="/login" className="nav-btn">Sign In</Link>
          </div>
        </nav>

        {}
        <div className="auth-body">

          {}
          <div className="glass-card">
            <h1 className="card-title">Create Account</h1>
            <p className="card-subtitle">Join thousands of travellers exploring the world</p>

            <div className="role-toggle">
              <button 
                type="button"
                className={`role-btn ${formData.role === 'CUSTOMER' ? 'active' : ''}`}
                onClick={() => handleRoleToggle('CUSTOMER')}
              >
                Customer
              </button>
              <button 
                type="button"
                className={`role-btn ${formData.role === 'PROVIDER' ? 'active' : ''}`}
                onClick={() => handleRoleToggle('PROVIDER')}
              >
                Business / Provider
              </button>
            </div>

            {error && (
              <div className="error-banner">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {}
              <div className="fields-row">
                <div className="field">
                  <label htmlFor="reg-name">{formData.role === 'PROVIDER' ? 'Owner Name' : 'Full Name'}</label>
                  <div className="input-wrap">
                    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input
                      id="reg-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="reg-phone">Phone</label>
                  <div className="input-wrap">
                    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.38-.38a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <input
                      id="reg-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              {}
              <div className="field">
                <label htmlFor="reg-email">Email Address</label>
                <div className="input-wrap">
                  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    id="reg-email"
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

              {}
              <div className="fields-row">
                <div className="field">
                  <label htmlFor="reg-password">Password</label>
                  <div className="input-wrap">
                    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Min 8 chars"
                      autoComplete="new-password"
                    />
                    <button type="button" className="toggle-pw" onClick={() => setShowPassword(v => !v)}>
                      {showPassword ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="reg-confirm">Confirm</label>
                  <div className="input-wrap">
                    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    <input
                      id="reg-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                    <button type="button" className="toggle-pw" onClick={() => setShowConfirm(v => !v)}>
                      {showConfirm ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {}
              {formData.role === 'PROVIDER' && (
                <>
                  <div style={{borderTop: '1px dashed rgba(255,255,255,0.2)', margin: '20px 0'}}></div>
                  
                  <div className="field no-icon">
                    <label>Business Name</label>
                    <div className="input-wrap">
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Ocean Hostels"
                      />
                    </div>
                  </div>

                  <div className="fields-row">
                    <div className="field no-icon">
                      <label>Business Location</label>
                      <div className="input-wrap">
                        <input
                          type="text"
                          name="businessLocation"
                          value={formData.businessLocation}
                          onChange={handleChange}
                          required
                          placeholder="e.g. New York"
                        />
                      </div>
                    </div>

                    <div className="field no-icon">
                      <label>Description (Optional)</label>
                      <div className="input-wrap">
                        <input
                          type="text"
                          name="businessDescription"
                          value={formData.businessDescription}
                          onChange={handleChange}
                          placeholder="Brief description"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <><span className="spinner" />Creating account...</> : 'Create Account'}
              </button>

              <p className="alt-link">
                Already have an account? <Link to="/login">Sign in here</Link>
              </p>
            </form>
          </div>

          {}
          <div className="quote-side">
            <p className="quote-text">
              {formData.role === 'PROVIDER' ? 'GROW YOUR TRAVEL BUSINESS WITH US.' : 'YOUR NEXT ADVENTURE STARTS HERE.'}
            </p>
            <div className="quote-divider" />
            <p className="quote-sub">
              {formData.role === 'PROVIDER' 
                ? 'Join our community of business owners. List your hostels, vehicles, and tours to reach thousands of travelers worldwide.'
                : 'Join our community of explorers. Discover hidden mountain trails, pristine valleys, and unforgettable experiences.'}
            </p>
            <ul className="perks">
              {formData.role === 'PROVIDER' ? (
                <>
                  <li><span className="perk-dot" /> List Hostels, Rentals & Tour Services</li>
                  <li><span className="perk-dot" /> Manage bookings in real-time</li>
                  <li><span className="perk-dot" /> Built-in payments and analytics</li>
                </>
              ) : (
                <>
                  <li><span className="perk-dot" /> Book hostels, rentals & tour guides instantly</li>
                  <li><span className="perk-dot" /> Explore curated travel destinations</li>
                  <li><span className="perk-dot" /> Manage all your bookings in one place</li>
                </>
              )}
            </ul>
          </div>
        </div>

      </div>
    </>
  );
}
