import React from 'react';
import { IndianRupee } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaymentDetailsComponentProps {
  subtotal: number;
  visitors: {
    adult: number;
    child: number;
    senior: number;
    tourist: number;
  };
  onPaymentComplete: () => void;
}

const PaymentDetailsComponent: React.FC<PaymentDetailsComponentProps> = ({ 
  subtotal, 
  onPaymentComplete 
}) => {
  const { t } = useTranslation();

  const handlePayment = () => {
    const options = {
      key: "rzp_test_TcOpvpk1Nnan1a",
      amount: subtotal * 100, // Amount in paise
      currency: "INR",
      name: "Indian Museum Booking",
      description: "Museum Visit Booking",
      handler: function(response: any) {
        console.log("Payment successful", response);
        onPaymentComplete();
      },
      prefill: {
        name: "Visitor",
        email: "visitor@example.com"
      },
      theme: {
        color: "#2563EB"
      }
    };

    const razorpayWindow = new (window as any).Razorpay(options);
    razorpayWindow.open();
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div className="space-y-3 border-t pt-3">
        <div className="flex justify-between text-gray-600">
          <span>{t('payment.amount')}</span>
          <span className="flex items-center">
            <IndianRupee className="w-4 h-4 mr-1" />
            {subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        className="w-full py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2"
      >
        <IndianRupee className="w-5 h-5" />
        Pay Now
      </button>

      <p className="text-xs text-gray-500 text-center">
        Secure payment powered by Razorpay
      </p>
    </div>
  );
};

export default PaymentDetailsComponent;