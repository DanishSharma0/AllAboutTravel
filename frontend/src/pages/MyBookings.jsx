import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { bookingAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Calendar, Building, Car, Map, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function MyBookings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState({ hostels: [], rentals: [], tours: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await bookingAPI.getMyBookings();
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
      </div>
    );
  }

  const hasBookings = bookings.hostels.length > 0 || bookings.rentals.length > 0 || bookings.tours.length > 0;

  const StatusBadge = ({ status }) => {
    let classes = 'bg-slate-100 text-slate-600';
    let Icon = Clock;

    if (status === 'Pending') {
      classes = 'bg-amber-100 text-amber-700';
    } else if (status === 'Confirmed' || status === 'Completed') {
      classes = 'bg-emerald-100 text-emerald-700';
      Icon = CheckCircle;
    } else if (status === 'Cancelled') {
      classes = 'bg-red-100 text-red-700';
      Icon = XCircle;
    }

    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${classes}`}>
        <Icon size={12} /> {status}
      </span>
    );
  };

  const PaymentStatusBadge = ({ status }) => {
    let classes = status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100';
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border ${classes}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="pt-12 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3">
            My Itinerary
          </h1>
          <p className="text-slate-500 text-lg">Manage your upcoming stays, rides, and local guides.</p>
        </div>

        {!hasBookings ? (
          <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Calendar size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No upcoming plans</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't made any bookings yet. Start exploring properties, vehicles, and tours for your next adventure.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-slate-900 text-white font-bold tracking-widest uppercase text-sm px-8 py-4 rounded-xl shadow-md hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
            >
              Start Exploring <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Hostels Section */}
            {bookings.hostels.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl"><Building size={24} /></div>
                  <h2 className="text-2xl font-bold text-slate-900">Stays & Hostels</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookings.hostels.map(h => (
                    <div key={h._id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition group">
                      <div className="w-full md:w-32 h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        {h.hostelId?.image ? (
                          <img src={h.hostelId.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400"><Building /></div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xl text-slate-900 line-clamp-1">{h.hostelId?.name || 'Unknown Hostel'}</h3>
                            <div className="flex flex-col items-end gap-2">
                              <StatusBadge status={h.status} />
                              <PaymentStatusBadge status={h.paymentStatus} />
                            </div>
                          </div>
                          <p className="text-slate-500 text-sm mb-4">{new Date(h.checkIn).toLocaleDateString()} — {new Date(h.checkOut).toLocaleDateString()}</p>
                        </div>
                          <div className="flex justify-between items-end pt-4 border-t border-slate-100 mt-auto">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Details</p>
                              <p className="text-slate-700 font-semibold text-sm">{h.roomType} • {h.numberOfGuests} Guests</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-right mb-2">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total</p>
                                 <p className="text-slate-900 font-black text-xl">₹{h.totalPrice}</p>
                              </div>
                              {h.paymentStatus === 'Unpaid' && (
                                <button 
                                  onClick={() => navigate('/checkout', { state: { booking: h, type: 'hostel' } })}
                                  className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-800 transition"
                                >
                                  Pay Now
                                </button>
                              )}
                            </div>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rentals Section */}
            {bookings.rentals.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-orange-100 text-orange-700 rounded-xl"><Car size={24} /></div>
                  <h2 className="text-2xl font-bold text-slate-900">Vehicles</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookings.rentals.map(r => (
                    <div key={r._id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition">
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{r.rentalId?.vehicleType || 'Vehicle'}</p>
                                 <h3 className="font-bold text-xl text-slate-900">{r.rentalId?.modelName || 'Unknown Vehicle'}</h3>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <StatusBadge status={r.status} />
                                <PaymentStatusBadge status={r.paymentStatus} />
                              </div>
                            </div>
                          <p className="text-slate-500 text-sm mb-2">{new Date(r.startDate).toLocaleDateString()} — {new Date(r.endDate).toLocaleDateString()}</p>
                          <p className="text-slate-400 text-xs mt-3"><span className="font-medium text-slate-600 border-b border-dashed border-slate-300 pb-0.5">{r.pickupLocation}</span> &nbsp;→&nbsp; <span className="font-medium text-slate-600 border-b border-dashed border-slate-300 pb-0.5">{r.dropLocation}</span></p>
                        </div>
                        <div className="flex justify-between items-end pt-4 border-t border-slate-100 mt-6">
                          <div className="flex flex-col items-end">
                            <div className="text-right mb-2">
                               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total</p>
                               <p className="text-slate-900 font-black text-xl">₹{r.totalPrice}</p>
                            </div>
                            {r.paymentStatus === 'Unpaid' && (
                              <button 
                                onClick={() => navigate('/checkout', { state: { booking: r, type: 'rental' } })}
                                className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-800 transition"
                              >
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tours Section */}
            {bookings.tours.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl"><Map size={24} /></div>
                  <h2 className="text-2xl font-bold text-slate-900">Local Guides</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookings.tours.map(t => (
                    <div key={t._id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition">
                       <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 overflow-hidden shrink-0 border-2 border-emerald-100">
                         {t.guideId?.image ? <img src={t.guideId.image} className="w-full h-full object-cover" /> : <Map size={32} />}
                       </div>
                       <div className="flex-1 flex flex-col justify-between">
                         <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-xl text-slate-900">{t.guideId?.name || 'Local Guide'}</h3>
                              <div className="flex flex-col items-end gap-2">
                                <StatusBadge status={t.status} />
                                <PaymentStatusBadge status={t.paymentStatus} />
                              </div>
                            </div>
                            <p className="text-slate-500 text-sm mb-4">
                              {new Date(t.bookingDate).toLocaleDateString()} 
                              {t.duration === 'Multi-day' ? ` — ${new Date(t.endDate).toLocaleDateString()}` : ''}
                            </p>
                         </div>
                         <div className="flex justify-between items-end pt-4 border-t border-slate-100 mt-2">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Duration</p>
                            <p className="text-slate-700 font-semibold text-sm">{t.duration} ({t.numberOfPeople} ppl)</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-right mb-2">
                               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total</p>
                               <p className="text-slate-900 font-black text-xl">₹{t.totalPrice}</p>
                            </div>
                            {t.paymentStatus === 'Unpaid' && (
                              <button 
                                onClick={() => navigate('/checkout', { state: { booking: t, type: 'tour' } })}
                                className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-800 transition"
                              >
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
