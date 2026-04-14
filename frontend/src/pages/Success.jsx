import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentId, orderId } = location.state || {};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6 mt-16 mb-16">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 mb-2">Payment Successful!</h1>
            <p className="text-slate-500 mb-8 font-medium">Thank you for your payment. Your booking is now confirmed.</p>
            
            <div className="space-y-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Payment ID</span>
                <span className="text-slate-900 font-mono font-bold text-xs">{paymentId || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Order ID</span>
                <span className="text-slate-900 font-mono font-bold text-xs">{orderId || 'N/A'}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/my-bookings')}
                className="w-full bg-slate-900 text-white font-black tracking-widest uppercase text-xs py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                View My Bookings <ArrowRight size={16} />
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-white text-slate-900 font-black tracking-widest uppercase text-xs py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                Back to Home <Home size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Success;
