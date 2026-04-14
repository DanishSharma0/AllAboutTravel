import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReviewSection from '../components/ReviewSection';
import { hostelsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import { Star, MapPin, Wifi, Users, ArrowLeft, Calendar, BedDouble, UserPlus, Loader2 } from 'lucide-react';

export default function HostelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState('Dorm');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [numNights, setNumNights] = useState(0);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    fetchHostelDetails();
  }, [id]);

  // Recalculate nights whenever dates change
  useEffect(() => {
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const diffTime = outDate - inDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNumNights(diffDays > 0 ? diffDays : 0);
    } else {
      setNumNights(0);
    }
  }, [checkIn, checkOut]);

  const fetchHostelDetails = async () => {
    try {
      const response = await hostelsAPI.getById(id);
      setHostel(response.data);
    } catch (error) {
      console.error('Error fetching hostel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut || numNights <= 0) {
      alert('Please select valid check-in and check-out dates.');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await hostelsAPI.bookHostel({
        hostelId: id,
        checkIn,
        checkOut,
        roomType,
        numberOfGuests,
      });
      
      // Redirect to checkout with booking info
      navigate('/checkout', { 
        state: { 
          booking: response.data.booking, 
          type: 'hostel' 
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

  if (!hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-medium text-slate-500">
        Hostel not found.
      </div>
    );
  }

  const roomOptions = ['Dorm', 'Private Single', 'Private Double', 'Suite'];
  const totalPrice = numNights * (hostel.pricePerNight || 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="pt-12 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/hostels')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm mb-10 transition tracking-wide"
        >
          <ArrowLeft size={16} /> Back to Hostels
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Details Section */}
          <div className="lg:col-span-2">
            
            {/* Header / Title */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-[10px] mb-3">
                <MapPin size={14} />
                <span>{hostel.cityId?.name || 'City'}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                {hostel.name}
              </h1>
              <p className="text-slate-500 text-lg">{hostel.address}</p>

              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-md font-bold text-sm">
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                  {hostel.rating || 0}
                </div>
                <div className="text-slate-400 text-sm font-medium">({hostel.reviews || 0} verified reviews)</div>
              </div>
            </div>

            {/* Image Gallery (Main Image) */}
            <div className="w-full h-96 bg-slate-200 rounded-2xl overflow-hidden mb-12 shadow-sm border border-slate-100">
              {hostel.image ? (
                <img src={hostel.image} alt={hostel.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <span className="font-medium tracking-widest uppercase">No Image</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">About this space</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {hostel.description || 'Experience a comfortable stay in the heart of the city with our premium hostel accommodations. Perfect for budget-conscious explorers looking for a community vibe.'}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-12 border-t border-slate-200 pt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">What this place offers</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
                <div className="flex items-center gap-3 font-semibold text-slate-700">
                  <Wifi className="text-slate-400" /> High-speed WiFi
                </div>
                <div className="flex items-center gap-3 font-semibold text-slate-700">
                  <Users className="text-slate-400" /> Common Lounge
                </div>
                {/* Dynamically render array if available */}
                {hostel.facilities?.map((fac, idx) => (
                   <div key={idx} className="flex items-center gap-3 font-semibold text-slate-700">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> {fac}
                   </div>
                ))}
              </div>
            </div>

            <ReviewSection entityType="Hostel" entityId={id} />
          </div>

          {/* Booking Widget Sidebar */}
          <div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sticky top-32">
              <div className="mb-6 pb-6 border-b border-slate-100 flex items-end gap-2">
                <span className="text-3xl font-black text-slate-900">₹{hostel.pricePerNight}</span>
                <span className="text-slate-500 font-medium mb-1">/ night</span>
              </div>

              <div className="space-y-5 mb-8">
                
                {/* Dates Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Check-In</label>
                    <input 
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-transparent font-semibold text-slate-900 outline-none" 
                    />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Check-Out</label>
                    <input 
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full bg-transparent font-semibold text-slate-900 outline-none" 
                    />
                  </div>
                </div>

                {/* Setup Section */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    <BedDouble size={12} /> Room Type
                  </label>
                  <select 
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full bg-transparent font-semibold text-slate-900 outline-none appearance-none cursor-pointer"
                  >
                    {roomOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    <UserPlus size={12} /> Guests
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    max="10"
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(e.target.value)}
                    className="w-full bg-transparent font-semibold text-slate-900 outline-none" 
                  />
                </div>

              </div>

              {/* Live Cost Calculation */}
              {numNights > 0 && (
                <div className="mb-8 space-y-3">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>₹{hostel.pricePerNight} x {numNights} nights</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span className="underline decoration-slate-300">Service fee</span>
                    <span>₹0</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between text-lg font-black text-slate-900">
                    <span>Total Cost</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={bookingLoading}
                className="w-full bg-slate-900 text-white font-bold tracking-widest uppercase text-sm py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {bookingLoading ? <Loader2 className="animate-spin" size={20} /> : 'Reserve Now'}
              </button>
              
              <p className="text-center text-xs font-semibold text-slate-400 mt-4 tracking-wide">
                You won't be charged yet
              </p>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
