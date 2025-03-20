# Razorpay Payment Gateway Integration

This project implements a secure payment gateway integration using Razorpay for the Indian Museum Booking System.

## Features

- Secure payment processing with Razorpay
- Server-side payment verification
- Webhook support for payment events
- TypeScript support
- Error handling and logging
- Responsive UI with loading states

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Razorpay credentials:
   ```
   VITE_RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   PORT=3001
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Start the backend server:
   ```bash
   npm run server
   ```

## Usage

1. Import the PaymentPage component:
   ```typescript
   import PaymentPage from './components/PaymentPage';
   ```

2. Use the component:
   ```typescript
   <PaymentPage
     amount={1000}
     orderId="ORDER123"
     customerName="John Doe"
     customerEmail="john@example.com"
     onSuccess={(paymentId) => console.log('Payment successful:', paymentId)}
     onFailure={(error) => console.error('Payment failed:', error)}
   />
   ```

## Security

- All sensitive data is handled server-side
- Payment verification using cryptographic signatures
- Environment variables for secure credential management
- CORS protection
- Request validation

## API Endpoints

- POST `/api/create-order`: Create a new order
- POST `/api/verify-payment`: Verify payment signature
- GET `/api/payment/:paymentId`: Get payment details
- POST `/api/webhook`: Handle Razorpay webhooks

## Error Handling

The integration includes comprehensive error handling for:
- Network failures
- Payment verification failures
- Invalid signatures
- Server errors
- User cancellations

## Testing

Test cards for development:
- Success: 4111 1111 1111 1111
- Failure: 4242 4242 4242 4242

## Production Deployment

1. Update environment variables with production credentials
2. Configure proper webhook URLs
3. Enable SSL/TLS
4. Set up proper logging and monitoring