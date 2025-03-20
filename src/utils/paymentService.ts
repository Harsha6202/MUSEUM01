declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOrderParams {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  handler: (response: any) => void;
}

/**
 * Create a Razorpay order
 */
export const createRazorpayOrder = async (params: RazorpayOrderParams) => {
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: params.orderAmount,
        currency: params.orderCurrency,
        receipt: params.orderId,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

/**
 * Initialize Razorpay payment
 */
export const initiateRazorpayPayment = async (
  orderDetails: {
    orderId: string;
    amount: number;
    currency: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  },
  onSuccess: (response: any) => void,
  onFailure: (error: any) => void
) => {
  try {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onerror = () => {
      onFailure({ error: 'Failed to load Razorpay SDK' });
    };
    document.body.appendChild(script);

    script.onload = () => {
      const options: RazorpayOptions = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_TcOpvpk1Nnan1a',
        amount: orderDetails.amount * 100, // Convert to paise
        currency: orderDetails.currency,
        name: 'Museum Booking',
        description: 'Museum Visit Ticket Booking',
        order_id: orderDetails.orderId,
        prefill: {
          name: orderDetails.customerName,
          email: orderDetails.customerEmail,
          contact: orderDetails.customerPhone,
        },
        handler: function (response: any) {
          onSuccess(response);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  } catch (error) {
    console.error('Error in payment process:', error);
    onFailure({ error: 'Payment initialization failed' });
  }
};
