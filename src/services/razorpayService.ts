import axios from 'axios';

interface OrderRequest {
  amount: number;
  orderId: string;
  currency: string;
}

interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

export const createOrder = async (orderData: OrderRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-order`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

export const verifyPayment = async (verificationData: PaymentVerificationRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-payment`, verificationData);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Payment verification failed');
  }
};

export const getPaymentDetails = async (paymentId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payment/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
};