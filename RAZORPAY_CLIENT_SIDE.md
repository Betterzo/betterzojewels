# Razorpay Client-Side Integration Guide

## Understanding Razorpay Response Fields

### Client-Side Integration Response
When using Razorpay's client-side integration, the response contains:

```javascript
{
  razorpay_payment_id: "pay_QxerhUDDErOuXf",  // ✅ Always present
  razorpay_order_id: undefined,                // ❌ Not available in client-side
  razorpay_signature: undefined                // ❌ Not available in client-side
}
```

### Why Some Fields Are Undefined

1. **`razorpay_payment_id`** - ✅ Always available
   - This is the unique payment identifier
   - Use this to track payments in your system

2. **`razorpay_order_id`** - ❌ Not available in client-side
   - Only available in server-side integration
   - In client-side, Razorpay handles orders internally

3. **`razorpay_signature`** - ❌ Not available in client-side
   - Only available in server-side integration
   - Used for signature verification on server

## Updated Payment Flow

### 1. Payment Data Sent to Server
```javascript
{
  razorpay_payment_id: "pay_QxerhUDDErOuXf",
  razorpay_order_id: undefined,        // Optional
  razorpay_signature: undefined,       // Optional
  order_id: "ORM00023",               // Your backend order ID
  amount: 1442
}
```

### 2. Server-Side Verification
Your backend should:
1. Use `razorpay_payment_id` to verify payment with Razorpay API
2. Update order status using your `order_id`
3. Store payment details in your database

### 3. Backend API Implementation

```php
// Example backend verification
public function verifyPayment(Request $request)
{
    $paymentId = $request->razorpay_payment_id;
    $orderId = $request->order_id;
    
    // 1. Verify payment with Razorpay API
    $razorpay = new Razorpay(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
    $payment = $razorpay->payment->fetch($paymentId);
    
    if ($payment->status !== 'captured') {
        return response()->json(['status' => false, 'message' => 'Payment not captured']);
    }
    
    // 2. Update your order
    $order = Order::where('order_id', $orderId)->first();
    $order->update([
        'payment_status' => 'paid',
        'payment_id' => $paymentId,
        'paid_at' => now()
    ]);
    
    return response()->json(['status' => true, 'message' => 'Payment verified']);
}
```

## Database Schema

### Orders Table
```sql
ALTER TABLE orders ADD COLUMN payment_id VARCHAR(255) NULL;
ALTER TABLE orders ADD COLUMN payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN paid_at TIMESTAMP NULL;
```

## Security Considerations

### 1. Server-Side Verification
- Always verify payments on your server
- Use Razorpay API to fetch payment details
- Don't rely only on client-side data

### 2. Webhook Integration
- Set up webhooks for real-time updates
- Handle payment status changes
- Implement idempotency

### 3. Error Handling
- Handle network failures
- Implement retry mechanisms
- Log all payment events

## Testing

### Test Payment Flow
1. Complete a test payment
2. Check browser console for logs
3. Verify server receives payment data
4. Confirm order status updates

### Expected Console Output
```
Payment successful: {razorpay_payment_id: "pay_QxerhUDDErOuXf"}
Backend Order ID: ORM00023
Razorpay Order ID: undefined
Razorpay Payment ID: pay_QxerhUDDErOuXf
Payment data being sent to server: {razorpay_payment_id: "pay_QxerhUDDErOuXf", order_id: "ORM00023", amount: 1442}
```

## Production Checklist

- [ ] Backend payment verification implemented
- [ ] Database schema updated
- [ ] Webhooks configured
- [ ] Error handling in place
- [ ] Logging implemented
- [ ] Security measures applied
- [ ] Testing completed

## Key Points

1. **Client-side integration** only provides `razorpay_payment_id`
2. **Server-side verification** is essential for security
3. **Use your backend order ID** for tracking orders
4. **Implement webhooks** for real-time updates
5. **Handle undefined fields** gracefully in your code 