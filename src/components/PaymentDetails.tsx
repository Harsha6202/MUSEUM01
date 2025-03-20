import React, { useEffect } from 'react';
import { QrCode, IndianRupee, Tag, X } from 'lucide-react';
import { PaymentDetails as IPaymentDetails, Museum } from '../types';

interface PaymentDetailsComponentProps {
  subtotal: number;
  visitors: {
    adult: number;
    child: number;
    senior: number;
    tourist: number;
  };
  museum: Museum;
  onPaymentComplete: (details: IPaymentDetails) => void;
}

const PaymentDetailsComponent: React.FC<PaymentDetailsComponentProps> = ({
  subtotal,
  visitors,
  museum,
  onPaymentComplete,
}) => {
  useEffect(() => {
    // Load Razorpay embed button script
    const script = document.createElement('script');
    script.src = 'https://cdn.razorpay.com/static/embed_btn/bundle.js';
    script.defer = true;
    script.id = 'razorpay-embed-btn-js';
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize the Razorpay embed button
      if (window.__rzp__) {
        window.__rzp__.init();
      }
    };

    // Clean up the script when the component unmounts
    return () => {
      const existingScript = document.getElementById('razorpay-embed-btn-js');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      {/* Price Breakdown */}
      <div className="space-y-3 border-t pt-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Razorpay Embed Button */}
      <div
        className="razorpay-embed-btn"
        data-url="https://rzp.io/rzp/NutPxHo" // Replace with your Razorpay payment link
        data-text="Pay Now"
        data-color="#528FF0"
        data-size="large"
      ></div>

      {/* Security Note */}
      <p className="text-xs text-gray-500 text-center">
        Your payment is secure and encrypted. By proceeding, you agree to our
        terms and conditions.
      </p>
    </div>
  );
};

export default PaymentDetailsComponent;
