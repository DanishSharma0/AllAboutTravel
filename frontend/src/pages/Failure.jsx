import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, Home, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Failure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = location.state || {};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6 mt-16 mb-16">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={48} />
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 mb-2">Payment Failed</h1>
            <p className="text-slate-500 mb-8 font-medium">Unfortunately, your payment could not be processed at this time.</p>
            
            {error && (
              <div className="mb-8 bg-red-50 p-4 rounded-2xl border border-red-100">
                <p className="text-red-700 text-sm font-bold">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-slate-900 text-white font-black tracking-widest uppercase text-xs py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Try Again <RefreshCw size={16} />
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

export default Failure;
