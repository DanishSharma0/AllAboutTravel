import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReviewSection from '../components/ReviewSection';
import { rentalsAPI } from '../services/api';
import PaymentModal from '../components/PaymentModal';
import { AuthContext } from '../context/AuthContext';
import { Car, MapPin, ArrowLeft, Loader2, Calendar, Map } from 'lucide-react';

export default function RentalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);


  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [numDays, setNumDays] = useState(0);


  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    fetchRentalDetails();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate) {
      const inDate = new Date(startDate);
      const outDate = new Date(endDate);
      const diffTime = outDate - inDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNumDays(diffDays > 0 ? diffDays : 0);
    } else {
      setNumDays(0);
    }
  }, [startDate, endDate]);

  const fetchRentalDetails = async () => {
    try {
      const response = await rentalsAPI.getById(id);
      setRental(response.data);
    } catch (error) {
      console.error('Error fetching rental:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!startDate || !endDate || numDays <= 0 || !pickupLocation || !dropLocation) {
      alert('Please fill out all booking fields with valid dates.');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await rentalsAPI.bookRental({
        rentalId: id,
        startDate,
        endDate,
        pickupLocation,
        dropLocation,
      });
      

      navigate('/checkout', { 
        state: { 
          booking: response.data.booking, 
          type: 'rental' 
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

  if (!rental) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-medium text-slate-500">
        Vehicle not found.
      </div>
    );
  }

  const totalPrice = numDays * (rental.pricePerDay || 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="pt-12 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/rentals')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm mb-10 transition tracking-wide"
        >
          <ArrowLeft size={16} /> Back to Vehicles
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            
            <div className="mb-8">
              <div className="flex items-center gap-2 text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-3">
                <Car size={14} />
                <span>{rental.vehicleType || 'Vehicle'} • {rental.cityId?.name || 'City'}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                {rental.modelName}
              </h1>
              <p className="text-slate-500 text-lg">Premium Mobility Service</p>
            </div>

            <div className="w-full h-96 bg-slate-200 rounded-2xl overflow-hidden mb-12 shadow-sm border border-slate-100 flex items-center justify-center">
              {rental.image ? (
                <img src={rental.image} alt={rental.modelName} className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400">
                  <Car size={64} className="opacity-50" />
                </div>
              )}
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">About this vehicle</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {rental.description || `Enjoy a smooth ride with our top-of-the-line ${rental.modelName}. Perfect for city navigation or long weekend trips.`}
              </p>
            </div>

            <ReviewSection entityType="Rental" entityId={id} />
          </div>

          {}
          <div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sticky top-32">
              <div className="mb-6 pb-6 border-b border-slate-100 flex items-end gap-2">
                <span className="text-3xl font-black text-slate-900">₹{rental.pricePerDay}</span>
                <span className="text-slate-500 font-medium mb-1">/ day</span>
              </div>

              <div className="space-y-5 mb-8">
                
                {}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Pickup Date</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-transparent font-semibold text-slate-900 outline-none" 
                    />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Drop Date</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full bg-transparent font-semibold text-slate-900 outline-none" 
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    <Map size={12} /> Pickup Location
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Airport, Hotel Name"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-transparent font-semibold text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-normal" 
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    <Map size={12} /> Drop Location
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Train Station"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    className="w-full bg-transparent font-semibold text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-normal" 
                  />
                </div>

              </div>

              {numDays > 0 && (
                <div className="mb-8 space-y-3">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>₹{rental.pricePerDay} x {numDays} days</span>
                    <span>₹{totalPrice}</span>
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
                {bookingLoading ? <Loader2 className="animate-spin" size={20} /> : 'Book Vehicle'}
              </button>
              
              <p className="text-center text-xs font-semibold text-slate-400 mt-4 tracking-wide">
                Pay nothing until confirmation
              </p>

            </div>
          </div>

        </div>
      </div>

      <Footer />

      <Footer />
    </div>
  );
}
