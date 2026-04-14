import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { bookingAPI, paymentAPI } from '../services/api';
import { CheckCircle, CreditCard, ShieldCheck, Loader2, ArrowLeft, Smartphone, Building, Car, Map } from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, type } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!booking || !type) {
      navigate('/my-bookings');
    }
  }, [booking, type, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create order on backend
      const { data: orderData } = await paymentAPI.createOrder({
        amount: booking.totalPrice,
        receipt: `receipt_${booking._id}`
      });

      if (!orderData.success) {
        throw new Error('Order creation failed');
      }

      // 2. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ScXDjnESw0yCBK',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AllAboutIndia Travel',
        description: `Booking for ${type === 'hostel' ? booking.hostelId?.name : (type === 'rental' ? booking.rentalId?.modelName : booking.guideId?.name)}`,
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            // 3. Verify payment on backend
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              // 4. Update booking status to 'Paid'
              try {
                await bookingAPI.payBooking(type, booking._id);
                setIsSuccess(true);
                // Redirect will happen after a short delay via the success UI or immediate navigate
                setTimeout(() => {
                  navigate('/payment/success', { 
                    state: { 
                      paymentId: response.razorpay_payment_id,
                      orderId: response.razorpay_order_id
                    } 
                  });
                }, 3000);
              } catch (updateErr) {
                console.error('Booking update error:', updateErr);
                // Even if booking update fails, payment was verified. 
                // We should probably still show success but maybe warn or log it.
                setIsSuccess(true);
                navigate('/payment/success', { 
                  state: { 
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    warning: 'Payment verified but booking status update failed. Please contact support.'
                  } 
                });
              }
            } else {
              navigate('/payment/failure', { state: { error: 'Payment verification failed' } });
            }
          } catch (err) {
            console.error('Verification error:', err);
            navigate('/payment/failure', { state: { error: err.message } });
          }
        },
        prefill: {
          name: '', // Will be filled by Razorpay UI usually or we can pass if we have it
          email: '',
          contact: '',
        },
        theme: {
          color: '#0f172a',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Could not initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!booking) return null;

  const getIcon = () => {
    if (type === 'hostel') return <Building className="text-blue-600" />;
    if (type === 'rental') return <Car className="text-orange-600" />;
    return <Map className="text-emerald-600" />;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-12 shadow-xl max-w-md w-full text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">Payment Successful!</h1>
            <p className="text-slate-500 mb-8">Your booking is now confirmed. Redirecting you to your itinerary...</p>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 animate-[progress_3s_ease-in-out_forwards]"></div>
            </div>
          </div>
        </div>
        <Footer />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="pt-12 pb-24 px-6 lg:px-12 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm mb-10 transition tracking-wide"
        >
          <ArrowLeft size={16} /> Back to Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Order Summary */}
          <div className="space-y-8">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Complete your booking</h1>
            
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition hover:shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  {getIcon()}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order Summary</p>
                  <h2 className="text-xl font-bold text-slate-900">
                    {type === 'hostel' ? booking.hostelId?.name : (type === 'rental' ? booking.rentalId?.modelName : booking.guideId?.name)}
                  </h2>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Base Price</span>
                  <span>₹{booking.totalPrice}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1">Service Fee <ShieldCheck size={14} className="text-slate-400" /></span>
                  <span>₹0</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between text-2xl font-black text-slate-900">
                  <span>Total Amount</span>
                  <span>₹{booking.totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-700">
              <ShieldCheck size={24} className="shrink-0" />
              <p className="text-sm font-semibold">Your payment information is encrypted and secure. We never store your sensitive card details locally.</p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg sticky top-32">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Payment Methods</h2>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-900 bg-slate-50 cursor-pointer transition">
                <div className="w-6 h-6 rounded-full border-4 border-slate-900 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                </div>
                <div className="flex items-center gap-3 font-bold text-slate-900">
                  <Smartphone className="text-slate-400" /> Secure UPI / NetBanking
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 opacity-50 cursor-not-allowed">
                <div className="w-6 h-6 rounded-full border border-slate-300"></div>
                <div className="flex items-center gap-3 font-bold text-slate-400">
                  <CreditCard className="text-slate-300" /> Credit / Debit Card
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-slate-900 text-white font-bold tracking-widest uppercase text-sm py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden relative"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{booking.totalPrice}</span>
                </>
              )}
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-6 opacity-30 grayscale">
               {/* Mock payment logos */}
               <div className="text-[10px] font-black tracking-tighter">RAZORPAY</div>
               <div className="text-[10px] font-black tracking-tighter">STRIPE</div>
               <div className="text-[10px] font-black tracking-tighter">UPI</div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
