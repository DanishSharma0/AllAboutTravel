import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { providerAPI } from '../services/api';
import { Building, Car, Map, Plus, ArrowRight, CreditCard, LayoutDashboard, CalendarCheck, CheckCircle, XCircle, Clock, Info } from 'lucide-react';

export default function ProviderDashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState({ hostels: [], rentals: [], tours: [] });
  const [bookings, setBookings] = useState({ hostels: [], rentals: [], tours: [] });
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    ifscCode: '',
  });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);


  useEffect(() => {
    if (user?.paymentDetails) {
      setPaymentDetails({
        upiId: user.paymentDetails.upiId || '',
        bankName: user.paymentDetails.bankName || '',
        accountNumber: user.paymentDetails.accountNumber || '',
        accountHolderName: user.paymentDetails.accountHolderName || '',
        ifscCode: user.paymentDetails.ifscCode || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== 'PROVIDER') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [listingsRes, bookingsRes] = await Promise.all([
          providerAPI.getMyListings(),
          providerAPI.getProviderBookings()
        ]);
        setListings(listingsRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Failed to fetch provider data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const response = await providerAPI.updatePaymentDetails(paymentDetails);
      alert('Payment details updated successfully!');

      setUser({ ...user, paymentDetails: response.data.paymentDetails });
      localStorage.setItem('user', JSON.stringify({ ...user, paymentDetails: response.data.paymentDetails }));
    } catch (error) {
      alert('Failed to update payment details');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleVerifyPayment = async (bookingId, category, status) => {
    try {
      await providerAPI.verifyPayment({ bookingId, category, status });
      alert(`Payment marked as ${status}`);

      const bookingsRes = await providerAPI.getProviderBookings();
      setBookings(bookingsRes.data);
    } catch (error) {
      alert('Failed to verify payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const totalListings = listings.hostels.length + listings.rentals.length + listings.tours.length;
  const allBookings = [...bookings.hostels.map(b => ({ ...b, category: 'hostel' })),
  ...bookings.rentals.map(b => ({ ...b, category: 'rental' })),
  ...bookings.tours.map(b => ({ ...b, category: 'tour' }))].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2">
              Business Dashboard
            </h1>
            <p className="text-slate-500 font-medium">
              Manage your services for <span className="text-slate-900 font-bold">{user.businessDetails?.businessName || user.name}</span>
            </p>
          </div>

          <Link
            to="/provider/add-listing"
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold tracking-widest uppercase text-xs px-8 py-4 rounded-xl hover:bg-slate-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={18} />
            Add New Listing
          </Link>
        </div>

        {}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold tracking-wide transition-all whitespace-nowrap ${activeTab === 'listings' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutDashboard size={18} /> My Listings
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold tracking-wide transition-all whitespace-nowrap ${activeTab === 'bookings' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <CalendarCheck size={18} /> Manage Bookings
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold tracking-wide transition-all whitespace-nowrap ${activeTab === 'payments' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <CreditCard size={18} /> Payment Settings
          </button>
        </div>

        {}
        {activeTab === 'listings' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Total Listings</p>
                <p className="text-4xl font-black text-slate-900">{totalListings}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Hostels</p>
                <p className="text-4xl font-black text-slate-900">{listings.hostels.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Vehicles</p>
                <p className="text-4xl font-black text-slate-900">{listings.rentals.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Tours</p>
                <p className="text-4xl font-black text-slate-900">{listings.tours.length}</p>
              </div>
            </div>

            {}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Building size={24} /></div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Hostels</h2>
              </div>
              {listings.hostels.length === 0 ? (
                <EmptyState icon={<Building size={48} />} title="No Hostels Yet" link="/provider/add-listing" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {listings.hostels.map(hostel => (
                    <ListingCard key={hostel._id} item={hostel} type="hostel" />
                  ))}
                </div>
              )}
            </section>

            {}
            <section className="pt-12 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Car size={24} /></div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Vehicles</h2>
              </div>
              {listings.rentals.length === 0 ? (
                <EmptyState icon={<Car size={48} />} title="No Vehicles Yet" link="/provider/add-listing" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {listings.rentals.map(rental => (
                    <ListingCard key={rental._id} item={rental} type="rental" />
                  ))}
                </div>
              )}
            </section>

            {}
            <section className="pt-12 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Map size={24} /></div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Tours</h2>
              </div>
              {listings.tours.length === 0 ? (
                <EmptyState icon={<Map size={48} />} title="No Tours Yet" link="/provider/add-listing" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {listings.tours.map(tour => (
                    <ListingCard key={tour._id} item={tour} type="tour" />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {}
        {activeTab === 'bookings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Recent Bookings & Payments</h2>
            {allBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-200">
                <CalendarCheck size={64} className="mx-auto text-slate-200 mb-6" />
                <p className="text-slate-400 font-bold mb-2">No bookings yet</p>
                <p className="text-slate-400 text-sm">Once customers start booking your services, they will appear here.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Service</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Stat</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction ID</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {allBookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-5">
                            <p className="font-bold text-slate-900">{booking.userId?.name}</p>
                            <p className="text-xs text-slate-400 font-semibold">{booking.userId?.phone}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter mr-2 ${booking.category === 'hostel' ? 'bg-blue-50 text-blue-600' :
                                booking.category === 'rental' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                              }`}>
                              {booking.category}
                            </span>
                            <span className="font-bold text-slate-700 text-sm">
                              {booking.hostelId?.name || booking.rentalId?.modelName || booking.guideId?.name}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <PaymentStatusBadge status={booking.paymentStatus} />
                          </td>
                          <td className="px-6 py-5 font-mono text-xs text-slate-500 font-bold">
                            {booking.transactionId || '---'}
                          </td>
                          <td className="px-6 py-5 font-black text-slate-900">
                            ₹{booking.totalPrice}
                          </td>
                          <td className="px-6 py-5">
                            {booking.paymentStatus === 'Pending Verification' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleVerifyPayment(booking._id, booking.category, 'Paid')}
                                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors shadow-sm"
                                  title="Verify Payment"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button
                                  onClick={() => handleVerifyPayment(booking._id, booking.category, 'Unpaid')}
                                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                                  title="Reject Payment"
                                >
                                  <XCircle size={18} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {}
        {activeTab === 'payments' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Settings</h2>
            <p className="text-slate-500 font-medium mb-10">Configure how you want to receive payments from customers.</p>

            <form onSubmit={handleUpdatePayment} className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm">
              <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl h-fit">
                    <Info size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">UPI & QR Integration</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Enter your UPI ID to automatically generate payment QR codes and Google Pay links for your customers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-slate-900 transition-colors">UPI ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@upi"
                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-900 transition-all font-bold text-slate-900"
                    value={paymentDetails.upiId}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Bank Name</label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-900 transition-all font-bold text-slate-900"
                      value={paymentDetails.bankName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, bankName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Account Number</label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-900 transition-all font-bold text-slate-900"
                      value={paymentDetails.accountNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">IFSC Code</label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-900 transition-all font-bold text-slate-900"
                      value={paymentDetails.ifscCode}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, ifscCode: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Account Holder</label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-900 transition-all font-bold text-slate-900"
                      value={paymentDetails.accountHolderName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, accountHolderName: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saveLoading}
                  className="w-full bg-slate-900 text-white font-black tracking-widest uppercase text-xs py-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {saveLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div> : 'Save Payment Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

function PaymentStatusBadge({ status }) {
  if (status === 'Paid') return <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-green-100">Confirmed</span>;
  if (status === 'Pending Verification') return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-amber-100 animate-pulse"><Clock size={12} /> Pending Verif</span>;
  return <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-lg">Unpaid</span>;
}

function EmptyState({ icon, title, link }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
      <div className="text-slate-200 mb-6 flex justify-center">{icon}</div>
      <p className="text-slate-500 font-bold mb-4">{title}</p>
      <Link to={link} className="inline-flex items-center gap-2 bg-slate-50 px-6 py-2 rounded-xl text-slate-900 font-bold text-sm border border-slate-200 hover:bg-white transition-all shadow-sm">
        List Now <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function ListingCard({ item, type }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="h-56 bg-slate-200 relative overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name || item.modelName} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-slate-300 bg-slate-100">
            {type === 'hostel' ? <Building size={48} /> : type === 'rental' ? <Car size={48} /> : <Map size={48} />}
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm ${type === 'hostel' ? 'bg-blue-600 text-white' :
              type === 'rental' ? 'bg-orange-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
            {type}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-black text-xl text-slate-900 mb-1 truncate">{item.name || item.modelName}</h3>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6 truncate">{item.address || item.vehicleType || 'Local Service'}</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Starting at</p>
            <p className="font-black text-2xl text-slate-900">₹{item.pricePerNight || item.pricePerDay || item.chargesPerDay} <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">/ day</span></p>
          </div>
          <p className="text-xs font-black text-slate-900 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            {item.availableRooms || item.totalVehicles || 'Active'}
          </p>
        </div>
      </div>
    </div>
  );
}
