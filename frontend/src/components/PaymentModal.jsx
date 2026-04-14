import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, CheckCircle, Copy, ExternalLink, Loader2, CreditCard } from 'lucide-react';
import axios from 'axios';

const PaymentModal = ({ isOpen, onClose, bookingId, category, totalPrice, providerDetails, listingName }) => {
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;


  // upi://pay?pa=address@bank&pn=PayeeName&am=Amount&cu=INR
  const upiUri = `upi://pay?pa=${providerDetails?.upiId || ''}&pn=${encodeURIComponent(providerDetails?.businessName || 'Provider')}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent('Booking for ' + listingName)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(providerDetails?.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId) {
      alert('Please enter the Transaction ID');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/bookings/confirm-payment', {
        bookingId,
        category,
        transactionId,
        paymentMethod: 'UPI'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Submitted!</h2>
          <p className="text-slate-500 font-medium mb-8">
            The provider will verify your payment soon. You can track the status in your dashboard.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in slide-in-from-bottom-8 duration-300">
        
        {}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">Complete Payment</h3>
            <p className="text-slate-500 text-sm font-medium">Pay via UPI QR or Google Pay</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[80vh]">
          
          {}
          <div className="bg-blue-50 rounded-2xl p-4 mb-8 flex items-center justify-between border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CreditCard size={18} className="text-white" />
              </div>
              <span className="font-bold text-blue-900">Total Amount</span>
            </div>
            <span className="text-2xl font-black text-blue-900">₹{totalPrice}</span>
          </div>

          {!providerDetails?.upiId ? (
            <div className="text-center py-8">
              <p className="text-amber-600 font-bold mb-2">Notice</p>
              <p className="text-slate-500 text-sm">Provider hasn't set up UPI details yet. Please contact support or pay on arrival.</p>
              <button 
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {}
              <div className="flex flex-col items-center mb-8">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 mb-4">
                  <QRCodeCanvas value={upiUri} size={200} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">Scan with Google Pay, PhonePe, or BHIM</p>
                
                {}
                <a 
                  href={upiUri} 
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-colors mb-4 md:hidden"
                >
                  <ExternalLink size={18} />
                  Open in UPI App
                </a>

                {}
                <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">UPI ID</p>
                    <p className="font-bold text-slate-700 truncate">{providerDetails.upiId}</p>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="p-2 hover:bg-white rounded-lg transition-colors flex items-center gap-1.5 text-blue-600 font-bold text-xs"
                  >
                    {copied ? 'Copied!' : <><Copy size={14} /> Copy</>}
                  </button>
                </div>
              </div>

              {}
              <div className="border-t border-slate-100 pt-8 mt-4">
                <form onSubmit={handleSubmit}>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">After payment, enter Transaction ID</label>
                  <div className="relative mb-6">
                    <input 
                      type="text" 
                      placeholder="e.g. 123456789012"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none font-bold text-slate-900 transition-all pl-12"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <CheckCircle size={20} />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading || !transactionId}
                    className="w-full bg-slate-900 text-white font-black tracking-widest uppercase text-sm py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin text-white" /> : 'Confirm Payment'}
                  </button>
                </form>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
