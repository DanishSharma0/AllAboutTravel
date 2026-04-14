import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReviewSection from '../components/ReviewSection';
import { tourGuidesAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Map, MapPin, ArrowLeft, Loader2, Star, UserPlus, Clock } from 'lucide-react';

export default function TourGuideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [guideState, setGuideState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking State
  const [bookingDate, setBookingDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [duration, setDuration] = useState('Daily');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchGuideDetails();
  }, [id]);

  useEffect(() => {
    if (!guideState) return;
    
    let calcPrice = 0;
    if (duration === 'Hourly') {
      calcPrice = (guideState.chargesPerHour || 0) * 1 * numberOfPeople; 
    } else if (duration === 'Daily') {
      calcPrice = (guideState.chargesPerDay || 0) * numberOfPeople;
    } else if (duration === 'Multi-day' && bookingDate && endDate) {
      const start = new Date(bookingDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (days > 0) {
        calcPrice = (guideState.chargesPerDay || 0) * days * numberOfPeople;
      }
    }
    setTotalPrice(calcPrice);
  }, [duration, bookingDate, endDate, numberOfPeople, guideState]);

  const fetchGuideDetails = async () => {
    try {
      const response = await tourGuidesAPI.getById(id);
      setGuideState(response.data);
    } catch (error) {
      console.error('Error fetching guide:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!bookingDate || !duration || numberOfPeople <= 0) {
      alert('Please fill out all booking fields.');
      return;
    }

    if (duration === 'Multi-day' && !endDate) {
      alert('Please select an end date for multi-day tours.');
      return;
    }

    setBookingLoading(true);

    try {
      const finalEndDate = duration === 'Multi-day' ? endDate : bookingDate;

      const response = await tourGuidesAPI.bookGuide({
        guideId: id,
        bookingDate,
        endDate: finalEndDate,
        duration,
        numberOfPeople,
      });
      
      // Redirect to checkout with booking info
      navigate('/checkout', { 
        state: { 
          booking: response.data.booking, 
          type: 'tour' 
        } 
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
      </div>
    );
  }

  if (!guideState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-medium text-slate-500">
        Tour guide not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="pt-12 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/tour-guides')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm mb-10 transition tracking-wide"
        >
          <ArrowLeft size={16} /> Back to Guides
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            
            <div className="mb-8 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-[10px] mb-3">
                  <MapPin size={14} />
                  <span>{guideState.cityId?.name || 'Local'} Expert</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                  {guideState.name}
                </h1>
                <p className="text-slate-500 text-lg flex items-center gap-2">
                  <Star size={18} className="fill-emerald-500 text-emerald-500" />
                  <span className="font-bold text-slate-700">{guideState.rating || 0}</span> 
                  ({guideState.experienceYears}y Experience)
                </p>
              </div>
              <div className="w-24 h-24 rounded-full bg-emerald-100 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center text-emerald-600">
                {guideState.image ? (
                  <img src={guideState.image} alt={guideState.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black">{guideState.name.charAt(0)}</span>
                )}
              </div>
            </div>

            <div className="mb-12 border-t border-slate-200 pt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">About your guide</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {guideState.description || `Hi, I'm ${guideState.name}! I specialize in showing you the hidden gems and rich history of my city. Book me for an unforgettable local experience.`}
              </p>
            </div>

            <div className="mb-12 border-t border-slate-200 pt-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Specialties & Languages</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {(guideState.languages && guideState.languages.length > 0 ? guideState.languages : ['English', 'Hindi']).map(lang => (
                  <span key={lang} className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">{lang}</span>
                ))}
              </div>
            </div>

            <ReviewSection entityType="TourGuide" entityId={id} />
          </div>

          {/* Booking Widget Sidebar */}
          <div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sticky top-32">
              <div className="mb-6 pb-6 border-b border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-2xl font-black text-slate-900">₹{guideState.chargesPerHour}</span>
                  <span className="text-slate-500 text-sm font-medium mb-1"> / hr</span>
                </div>
                <div className="text-slate-300">|</div>
                <div>
                  <span className="text-2xl font-black text-slate-900">₹{guideState.chargesPerDay}</span>
                  <span className="text-slate-500 text-sm font-medium mb-1"> / day</span>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    <Clock size={12} /> Duration Type
                  </label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-transparent font-semibold text-slate-900 outline-none appearance-none cursor-pointer"
                  >
                    <option value="Hourly">Hourly</option>
                    <option value="Daily">Daily</option>
                    <option value="Multi-day">Multi-day</option>
                  </select>
                </div>

                <div className={`grid ${duration === 'Multi-day' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                      {duration === 'Multi-day' ? 'Start Date' : 'Tour Date'}
                    </label>
                    <input 
                      type="date" 
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-transparent font-semibold text-slate-900 outline-none" 
                    />
                  </div>
                  {duration === 'Multi-day' && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">End Date</label>
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={bookingDate || new Date().toISOString().split('T')[0]}
                        className="w-full bg-transparent font-semibold text-slate-900 outline-none" 
                      />
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    <UserPlus size={12} /> People
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    max="20"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    className="w-full bg-transparent font-semibold text-slate-900 outline-none" 
                  />
                </div>

              </div>

              {totalPrice > 0 && (
                <div className="mb-8 space-y-3">
                  <div className="pt-4 border-t border-slate-100 flex justify-between text-lg font-black text-slate-900">
                    <span>Total Estimate</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={bookingLoading}
                className="w-full bg-slate-900 text-white font-bold tracking-widest uppercase text-sm py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {bookingLoading ? <Loader2 className="animate-spin" size={20} /> : 'Book Guide'}
              </button>
              
              <p className="text-center text-xs font-semibold text-slate-400 mt-4 tracking-wide">
                Pay nothing until confirmation
              </p>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
