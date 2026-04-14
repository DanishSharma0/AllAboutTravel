import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { User, Mail, Phone, Edit2 } from 'lucide-react';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update profile in backend
      localStorage.setItem('user', JSON.stringify(profile));
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pb-12 max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Edit2 size={18} />
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <User size={18} className="inline mr-2" />
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile?.name || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                ) : (
                  <p className="text-gray-600 text-lg">{profile?.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <Mail size={18} className="inline mr-2" />
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile?.email || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                ) : (
                  <p className="text-gray-600 text-lg">{profile?.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <Phone size={18} className="inline mr-2" />
                  Phone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile?.phone || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                ) : (
                  <p className="text-gray-600 text-lg">{profile?.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Save Button */}
              {editing && (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
