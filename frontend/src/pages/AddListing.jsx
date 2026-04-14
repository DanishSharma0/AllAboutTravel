import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { providerAPI, citiesAPI } from '../services/api';
import { Building, Car, Map, ArrowLeft, Loader2 } from 'lucide-react';

export default function AddListing() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [category, setCategory] = useState('hostel');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    cityId: '',
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    pricePerNight: 0,
    availableRooms: 1,
    vehicleType: 'Bike',
    modelName: '',
    pricePerHour: 0,
    pricePerDay: 0,
    email: '',
    phone: '',
    experienceYears: 0,
    chargesPerDay: 0,
    chargesPerHour: 0,
    image: '',
    description: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'PROVIDER') {
      navigate('/');
      return;
    }

    const fetchCities = async () => {
      try {
        const response = await citiesAPI.getAll();
        setCities(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, cityId: response.data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to fetch cities');
      }
    };
    fetchCities();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { category, cityId: formData.cityId };
      
      if (category === 'hostel') {
        Object.assign(payload, {
          name: formData.name,
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
          pricePerNight: formData.pricePerNight,
          availableRooms: formData.availableRooms,
          image: formData.image,
          description: formData.description,
        });
      } else if (category === 'rental') {
        Object.assign(payload, {
          vehicleType: formData.vehicleType,
          modelName: formData.modelName,
          pricePerHour: formData.pricePerHour,
          pricePerDay: formData.pricePerDay,
          image: formData.image,
          description: formData.description,
        });
      } else if (category === 'tour') {
        Object.assign(payload, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          experienceYears: formData.experienceYears,
          chargesPerHour: formData.chargesPerHour,
          chargesPerDay: formData.chargesPerDay,
          image: formData.image,
          description: formData.description,
        });
      }

      await providerAPI.addListing(payload);
      navigate('/provider-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/provider-dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm mb-8 transition"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Add New Service</h1>
              <p className="text-slate-500 mt-1">Publish a new offering to the marketplace.</p>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            {/* Category Selector */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <button
                type="button"
                className={`py-4 flex flex-col items-center gap-2 rounded-xl border-2 transition ${category === 'hostel' ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}
                onClick={() => setCategory('hostel')}
              >
                <Building size={24} />
                <span className="font-bold uppercase tracking-wider text-xs">Hostel</span>
              </button>
              <button
                type="button"
                className={`py-4 flex flex-col items-center gap-2 rounded-xl border-2 transition ${category === 'rental' ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}
                onClick={() => setCategory('rental')}
              >
                <Car size={24} />
                <span className="font-bold uppercase tracking-wider text-xs">Vehicle</span>
              </button>
              <button
                type="button"
                className={`py-4 flex flex-col items-center gap-2 rounded-xl border-2 transition ${category === 'tour' ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}
                onClick={() => setCategory('tour')}
              >
                <Map size={24} />
                <span className="font-bold uppercase tracking-wider text-xs">Tour Guide</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">City</label>
                  <select 
                    name="cityId" 
                    value={formData.cityId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  >
                    {cities.map(city => (
                      <option key={city._id} value={city._id}>{city.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Image URL</label>
                  <input 
                    type="url" 
                    name="image" 
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://test.com/img.jpg"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" 
                  />
                </div>
              </div>

              {/* Specific Fields */}
              {category === 'hostel' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Hostel Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Address</label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Price Per Night (₹)</label>
                      <input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleInputChange} required min="0" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Available Rooms</label>
                      <input type="number" name="availableRooms" value={formData.availableRooms} onChange={handleInputChange} required min="1" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Latitude</label>
                      <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Longitude</label>
                      <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                  </div>
                </>
              )}

              {category === 'rental' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Vehicle Type</label>
                      <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900">
                        <option value="Bike">Bike</option>
                        <option value="Scooty">Scooty</option>
                        <option value="Car">Car</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Model Name</label>
                      <input type="text" name="modelName" value={formData.modelName} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Price Per Hour (₹)</label>
                      <input type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleInputChange} required min="0" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Price Per Day (₹)</label>
                      <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleInputChange} required min="0" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                  </div>
                </>
              )}

              {category === 'tour' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Guide Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Experience (Years)</label>
                      <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleInputChange} required min="0" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Phone</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Charges Per Hour (₹)</label>
                      <input type="number" name="chargesPerHour" value={formData.chargesPerHour} onChange={handleInputChange} required min="0" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Charges Per Day (₹)</label>
                      <input type="number" name="chargesPerDay" value={formData.chargesPerDay} onChange={handleInputChange} required min="0" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-slate-900 text-white font-bold tracking-wide px-8 py-3 rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Publish Listing'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
