import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, CreditCard, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { createOrder, verifyPayment } from '../services/razorpayService';

interface PaymentPageProps {
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage: React.FC<PaymentPageProps> = ({
  amount,
  orderId,
  customerName,
  customerEmail,
  onSuccess,
  onFailure
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const navigate = useNavigate();

  useEffect(() => {
    const loadRazorpay = async () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onerror = () => {
        setError('Failed to load payment gateway. Please try again later.');
      };
      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const orderResponse = await createOrder({
        amount,
        orderId,
        currency: 'INR'
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Indian Museum Booking',
        description: 'Museum Visit Ticket Payment',
        order_id: orderResponse.id,
        prefill: {
          name: customerName,
          email: customerEmail
        },
        theme: {
          color: '#2563EB'
        },
        handler: async function(response: any) {
          try {
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verification.success) {
              setPaymentStatus('success');
              onSuccess(response.razorpay_payment_id);
            } else {
              setPaymentStatus('failed');
              onFailure('Payment verification failed');
            }
          } catch (error) {
            setPaymentStatus('failed');
            onFailure('Payment verification failed');
          }
        },
        modal: {
          ondismiss: function() {
            setPaymentStatus('failed');
            onFailure('Payment cancelled by user');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError('Failed to initialize payment. Please try again.');
      onFailure('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Payment</h1>
            <p className="text-gray-600 mt-2">Secure payment powered by Razorpay</p>
          </div>

          <div className="space-y-6">
            {/* Amount Display */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Total Amount:</span>
                <span className="text-xl font-bold text-blue-600 flex items-center">
                  <IndianRupee className="w-5 h-5 mr-1" />
                  {amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Status */}
            {paymentStatus !== 'pending' && (
              <div className={`p-4 rounded-lg ${
                paymentStatus === 'success' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                <div className="flex items-center gap-2">
                  {paymentStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span>
                    {paymentStatus === 'success' 
                      ? 'Payment successful!' 
                      : 'Payment failed. Please try again.'}
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={loading || paymentStatus === 'success'}
              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                loading || paymentStatus === 'success'
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay Now</span>
                </>
              )}
            </button>

            {/* Security Notice */}
            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Your payment is secure and encrypted. We never store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;