// Debug utility for Razorpay order IDs
export const debugRazorpayOrderIds = (orderData: any, response: any) => {
  console.log('=== RAZORPAY ORDER ID DEBUG ===');
  console.log('Backend Order Data:', orderData);
  console.log('Razorpay Response:', response);
  console.log('Backend Order ID:', orderData?.order_id);
  console.log('Backend Razorpay Order ID:', orderData?.rzpay_order_id);
  console.log('Razorpay Order ID:', response?.razorpay_order_id);
  console.log('Razorpay Payment ID:', response?.razorpay_payment_id);
  console.log('================================');
};

// Test function to simulate payment response
export const simulatePaymentResponse = () => {
  const mockResponse = {
    razorpay_payment_id: 'pay_test1234567890',
    razorpay_order_id: 'order_test1234567890',
    razorpay_signature: 'test_signature_1234567890'
  };
  
  const mockOrderData = {
    order_id: 'ORM00011',
    rzpay_order_id: 'order_QxzbGQBwJJPuII',
    amount: 4120,
    status: true,
    message: 'Order placed successfully'
  };
  
  debugRazorpayOrderIds(mockOrderData, mockResponse);
  return { mockResponse, mockOrderData };
}; 