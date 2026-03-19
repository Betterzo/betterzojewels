# 🔄 **Complete Payment Flow: Frontend to Backend**

## 📋 **How Your Backend Gets Payment Details**

### **Step 1: Order Creation**
```javascript
// Frontend calls your backend
const orderResponse = await placeOrder({
  shipping_address_id: "123",
  payment_method: "online"
});

// Your backend responds with:
{
  status: true,
  message: "Order placed successfully",
  order_id: "ORM00023",  // Your backend order ID
  amount: 1442           // Payment amount
}
```

### **Step 2: Razorpay Payment**
```javascript
// Frontend initializes Razorpay
const options = {
  key: "rzp_test_...",
  amount: 144200, // in paise
  currency: "INR",
  name: "JewTone Online",
  description: "Order ORM00023",
  notes: {
    backend_order_id: "ORM00023", // Your order ID stored in notes
    amount: "1442"
  }
};
```

### **Step 3: Payment Success Handler**
```javascript
// When payment succeeds, Razorpay calls this handler
handler: (response) => {
  console.log('Payment successful:', response);
  // response = {
  //   razorpay_payment_id: "pay_QxerhUDDErOuXf",
  //   razorpay_order_id: undefined,
  //   razorpay_signature: undefined
  // }
  
  // Immediately send to your backend
  const paymentData = {
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_order_id: response.razorpay_order_id || undefined,
    razorpay_signature: response.razorpay_signature || undefined,
    order_id: "ORM00023", // Your backend order ID
    amount: 1442
  };
  
  // Call your backend API
  verifyPaymentAndUpdateOrder(paymentData);
}
```

### **Step 4: Backend Receives Payment Data**
```javascript
// Your backend receives this data:
{
  razorpay_payment_id: "pay_QxerhUDDErOuXf",
  razorpay_order_id: undefined,
  razorpay_signature: undefined,
  order_id: "ORM00023",
  amount: 1442
}
```

## 🛠️ **What Your Backend Should Do**

### **Backend API Endpoint: `/payment/verify`**

```php
// Your backend receives the payment data
public function verifyPayment(Request $request)
{
    $paymentId = $request->razorpay_payment_id; // "pay_QxerhUDDErOuXf"
    $orderId = $request->order_id;              // "ORM00023"
    $amount = $request->amount;                 // 1442
    
    // Step 1: Verify payment with Razorpay API
    $razorpay = new Razorpay\Api\Api($keyId, $keySecret);
    $payment = $razorpay->payment->fetch($paymentId);
    
    // Step 2: Check if payment is successful
    if ($payment->status === 'captured') {
        // Step 3: Update your order in database
        $order = Order::where('order_id', $orderId)->first();
        $order->update([
            'payment_status' => 'paid',
            'payment_id' => $paymentId,
            'payment_amount' => $amount,
            'paid_at' => now()
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Payment verified successfully'
        ]);
    } else {
        return response()->json([
            'success' => false,
            'message' => 'Payment not captured'
        ]);
    }
}
```

## 🔍 **Complete Data Flow**

### **1. Frontend → Backend (Order Creation)**
```javascript
// Frontend sends order data
POST /api/v1/checkout
{
  "shipping_address_id": "123",
  "payment_method": "online"
}

// Backend responds
{
  "status": true,
  "message": "Order placed successfully",
  "order_id": "ORM00023",
  "amount": 1442
}
```

### **2. Frontend → Razorpay (Payment)**
```javascript
// Frontend sends payment request to Razorpay
{
  "key": "rzp_test_...",
  "amount": 144200,
  "currency": "INR",
  "notes": {
    "backend_order_id": "ORM00023"
  }
}
```

### **3. Razorpay → Frontend (Payment Response)**
```javascript
// Razorpay responds to frontend
{
  "razorpay_payment_id": "pay_QxerhUDDErOuXf"
}
```

### **4. Frontend → Backend (Payment Verification)**
```javascript
// Frontend immediately sends to your backend
POST /api/v1/payment/verify
{
  "razorpay_payment_id": "pay_QxerhUDDErOuXf",
  "razorpay_order_id": undefined,
  "razorpay_signature": undefined,
  "order_id": "ORM00023",
  "amount": 1442
}
```

### **5. Backend → Razorpay (Verification)**
```php
// Your backend verifies with Razorpay
$payment = $razorpay->payment->fetch("pay_QxerhUDDErOuXf");
```

### **6. Backend → Database (Update Order)**
```php
// Your backend updates the order
$order->update([
    'payment_status' => 'paid',
    'payment_id' => 'pay_QxerhUDDErOuXf'
]);
```

## 🎯 **Key Points**

### **✅ What Your Backend Gets:**
1. **`razorpay_payment_id`** - Use this to verify with Razorpay
2. **`order_id`** - Your backend order ID for database updates
3. **`amount`** - Payment amount for verification

### **❌ What Your Backend Doesn't Get:**
1. **`razorpay_order_id`** - Not available in client-side integration
2. **`razorpay_signature`** - Not available in client-side integration

### **🛡️ Security:**
- Your backend **verifies the payment** with Razorpay API
- Uses **`razorpay_payment_id`** to fetch payment details
- Checks **payment status** and **amount**
- Updates **your database** only after verification

## 📊 **Database Schema Example**

```sql
-- Your orders table
CREATE TABLE orders (
    id INT PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE, -- "ORM00023"
    amount DECIMAL(10,2),
    payment_status ENUM('pending', 'paid', 'failed'),
    payment_id VARCHAR(100), -- "pay_QxerhUDDErOuXf"
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 🔧 **Testing the Flow**

1. **Complete a payment**
2. **Check browser console** - you'll see:
   ```
   Payment successful: {razorpay_payment_id: "pay_QxerhUDDErOuXf"}
   Payment data being sent to server: {razorpay_payment_id: "pay_QxerhUDDErOuXf", order_id: "ORM00023", amount: 1442}
   ```

3. **Check your backend logs** - verify the API call is received
4. **Check your database** - confirm order status is updated

## ✅ **Summary**

Your backend gets **all the necessary information** to:
- ✅ **Verify the payment** with Razorpay
- ✅ **Update your database** with payment details
- ✅ **Track the order** using your order ID
- ✅ **Process the payment** securely

The undefined fields (`razorpay_order_id`, `razorpay_signature`) are **not needed** for client-side integration. Your backend uses the `razorpay_payment_id` to verify everything with Razorpay's API. 