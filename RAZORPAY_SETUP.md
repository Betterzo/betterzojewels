# Razorpay Payment Gateway Setup

## Overview
This application now supports Razorpay payment gateway for both online card payments and UPI payments.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in your project root with the following variables:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.4:8000/api/v1
```

### 2. Get Razorpay Keys
1. Sign up for a Razorpay account at https://razorpay.com
2. Go to Settings > API Keys
3. Generate a new key pair
4. Use the Key ID in `NEXT_PUBLIC_RAZORPAY_KEY_ID`
5. Use the Key Secret in `RAZORPAY_KEY_SECRET` (for server-side verification)

### 3. Payment Flow
The payment flow works as follows:

1. **User selects payment method** (Online/UPI)
2. **Order is placed** in your backend first
3. **Backend returns** order details:
   ```json
   {
     "status": true,
     "message": "Order placed successfully",
     "order_id": "ORM00011",
     "amount": 4120
   }
   ```
4. **Razorpay modal opens** with payment options
5. **User completes payment** through Razorpay
6. **Success/failure handling** redirects to appropriate pages

### 4. Testing
For testing, you can use Razorpay's test cards:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

### 5. Production Deployment
Before going live:
1. Switch to Razorpay live keys
2. Implement server-side payment verification
3. Set up webhook handling for payment status updates
4. Test the complete payment flow

## Files Modified
- `src/lib/razorpay.ts` - Razorpay integration service
- `src/app/checkout/page.tsx` - Updated checkout flow
- `src/app/payment/success/page.tsx` - Updated success page
- `src/app/payment/failed/page.tsx` - Payment failure handling

## Security Notes
- Never expose your Razorpay secret key in client-side code
- Always verify payments on the server side
- Use HTTPS in production
- Implement proper error handling and logging 