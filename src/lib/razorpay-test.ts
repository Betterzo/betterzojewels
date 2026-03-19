// Simple Razorpay test for debugging
export const testRazorpaySimple = () => {
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  
  if (!key || key === 'rzp_test_YOUR_KEY_HERE') {
    alert('Please configure your Razorpay key in .env.local file');
    return;
  }

  // Load Razorpay script
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => {
    console.log('Razorpay script loaded');
    
    // Simple test options
    const options = {
      key: key,
      amount: 100, // ₹1 in paise
      currency: 'INR',
      name: 'Test Payment',
      description: 'Test Order',
      handler: function (response: any) {
        console.log('Payment successful:', response);
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
      },
      modal: {
        ondismiss: function () {
          console.log('Modal dismissed');
          alert('Payment cancelled');
        }
      }
    };

    try {
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Error:', error);
      alert('Error: ' + (error.message || 'Unknown error'));
    }
  };
  
  script.onerror = () => {
    alert('Failed to load Razorpay script');
  };
  
  document.head.appendChild(script);
}; 