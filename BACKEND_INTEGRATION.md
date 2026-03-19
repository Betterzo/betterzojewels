# Backend Integration for Payment Processing

## Overview
This document outlines the backend API endpoints and webhook handling required for complete payment integration with Razorpay.

## Required Backend API Endpoints

### 1. Payment Verification Endpoint

**Endpoint:** `POST /api/v1/payment/verify`

**Request Body:**
```json
{
  "razorpay_payment_id": "pay_1234567890",
  "razorpay_order_id": "order_1234567890", 
  "razorpay_signature": "abc123def456...",
  "order_id": "ORM00011",
  "amount": 4120
}
```

**Response:**
```json
{
  "status": true,
  "message": "Payment verified and order updated successfully",
  "data": {
    "order_id": "ORM00011",
    "payment_id": "pay_1234567890",
    "status": "paid",
    "amount": 4120,
    "payment_method": "card",
    "captured_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Payment Status Check Endpoint

**Endpoint:** `GET /api/v1/payment/status/{order_id}`

**Response:**
```json
{
  "status": true,
  "data": {
    "order_id": "ORM00011",
    "payment_status": "paid",
    "payment_id": "pay_1234567890",
    "amount": 4120,
    "payment_method": "card",
    "captured_at": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Order Status Update Endpoint

**Endpoint:** `PUT /api/v1/orders/{order_id}/status`

**Request Body:**
```json
{
  "status": "paid"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Order status updated successfully"
}
```

### 4. Webhook Handler Endpoint

**Endpoint:** `POST /api/v1/payment/webhook`

**Request Body (Payment Captured):**
```json
{
  "payment_id": "pay_1234567890",
  "order_id": "ORM00011",
  "amount": 4120,
  "status": "captured",
  "payment_method": "card",
  "captured_at": "2024-01-15T10:30:00Z"
}
```

**Request Body (Payment Failed):**
```json
{
  "payment_id": "pay_1234567890",
  "order_id": "ORM00011",
  "status": "failed",
  "error_code": "PAYMENT_DECLINED",
  "error_description": "Payment was declined by the bank"
}
```

## Backend Implementation Steps

### Step 1: Payment Verification Logic

```php
// Example in PHP/Laravel
public function verifyPayment(Request $request)
{
    $paymentId = $request->razorpay_payment_id;
    $orderId = $request->order_id;
    $signature = $request->razorpay_signature;
    $amount = $request->amount;

    // 1. Verify signature with Razorpay
    $expectedSignature = hash_hmac('sha256', $paymentId . '|' . $orderId, env('RAZORPAY_KEY_SECRET'));
    
    if ($signature !== $expectedSignature) {
        return response()->json(['status' => false, 'message' => 'Invalid signature'], 400);
    }

    // 2. Verify payment with Razorpay API
    $razorpay = new Razorpay(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
    $payment = $razorpay->payment->fetch($paymentId);

    if ($payment->status !== 'captured') {
        return response()->json(['status' => false, 'message' => 'Payment not captured'], 400);
    }

    if ($payment->amount !== $amount * 100) { // Convert to paise
        return response()->json(['status' => false, 'message' => 'Amount mismatch'], 400);
    }

    // 3. Update order status in database
    $order = Order::where('order_id', $orderId)->first();
    if (!$order) {
        return response()->json(['status' => false, 'message' => 'Order not found'], 404);
    }

    $order->update([
        'payment_status' => 'paid',
        'payment_id' => $paymentId,
        'payment_method' => $payment->method,
        'paid_at' => now()
    ]);

    // 4. Clear cart and send confirmation email
    // ... your business logic here

    return response()->json([
        'status' => true,
        'message' => 'Payment verified and order updated successfully',
        'data' => $order
    ]);
}
```

### Step 2: Webhook Handler

```php
// Example in PHP/Laravel
public function handleWebhook(Request $request)
{
    $payload = $request->all();
    
    switch ($payload['status']) {
        case 'captured':
            $this->handlePaymentCaptured($payload);
            break;
        case 'failed':
            $this->handlePaymentFailed($payload);
            break;
        default:
            Log::info('Unhandled webhook status: ' . $payload['status']);
    }

    return response()->json(['status' => 'ok']);
}

private function handlePaymentCaptured($payload)
{
    $order = Order::where('order_id', $payload['order_id'])->first();
    
    if ($order) {
        $order->update([
            'payment_status' => 'paid',
            'payment_id' => $payload['payment_id'],
            'payment_method' => $payload['payment_method'],
            'paid_at' => $payload['captured_at']
        ]);

        // Send confirmation email
        // Update inventory
        // Trigger any other business logic
    }
}

private function handlePaymentFailed($payload)
{
    $order = Order::where('order_id', $payload['order_id'])->first();
    
    if ($order) {
        $order->update([
            'payment_status' => 'failed',
            'payment_error' => $payload['error_description']
        ]);

        // Send failure notification
        // Restore inventory
    }
}
```

## Database Schema Updates

### Orders Table
```sql
ALTER TABLE orders ADD COLUMN payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN payment_id VARCHAR(255) NULL;
ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) NULL;
ALTER TABLE orders ADD COLUMN paid_at TIMESTAMP NULL;
ALTER TABLE orders ADD COLUMN payment_error TEXT NULL;
```

### Payments Table (Optional)
```sql
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) NOT NULL,
    payment_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method VARCHAR(50),
    status ENUM('pending', 'captured', 'failed') DEFAULT 'pending',
    razorpay_order_id VARCHAR(255),
    razorpay_signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_payment_id (payment_id)
);
```

## Environment Variables

Add these to your backend `.env` file:

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here
API_SECRET_KEY=your_api_secret_for_webhooks
```

## Webhook Configuration

1. **In Razorpay Dashboard:**
   - Go to Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/webhook/razorpay`
   - Select events: `payment.captured`, `payment.failed`, `order.paid`
   - Save webhook

2. **Test Webhook:**
   - Use Razorpay's webhook testing tool
   - Verify your webhook endpoint receives events

## Security Considerations

1. **Signature Verification:** Always verify webhook signatures
2. **Idempotency:** Handle duplicate webhook events
3. **Error Handling:** Log all webhook failures
4. **Rate Limiting:** Implement rate limiting on webhook endpoints
5. **HTTPS:** Use HTTPS for all webhook URLs

## Testing

1. **Test Payment Flow:**
   - Complete a test payment
   - Verify order status updates
   - Check webhook events

2. **Test Error Scenarios:**
   - Failed payments
   - Network timeouts
   - Invalid signatures

3. **Monitor Logs:**
   - Payment verification logs
   - Webhook event logs
   - Error logs

## Production Checklist

- [ ] All endpoints implemented and tested
- [ ] Database schema updated
- [ ] Environment variables configured
- [ ] Webhooks configured in Razorpay dashboard
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Security measures in place
- [ ] Load testing completed
- [ ] Monitoring and alerting set up 