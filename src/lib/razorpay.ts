// Razorpay payment gateway integration
// This handles both online card payments and UPI payments through Razorpay

export interface RazorpayOrderResponse {
  status: boolean;
  message: string;
  order_id: string;
  amount: number;
  rzpay_order_id: string;
}

export interface RazorpayPaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string; // Now required since backend provides it
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  notes: {
    address: string;
    order_id?: string;
    backend_order_id?: string;
    amount?: string;
    [key: string]: string | undefined;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string; // Now required since we use backend order ID
  razorpay_signature: string; // Now required since we use backend order ID
}

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.head.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initializeRazorpayPayment = async (
  orderData: RazorpayOrderResponse,
  customerDetails: {
    name: string;
    email: string;
    phone?: string;
    address: string;
  },
  onSuccess: (response: RazorpayResponse) => void,
  onFailure: (error: any) => void,
  onDismiss: () => void
): Promise<void> => {
  try {
    console.log('Starting Razorpay initialization...');
    console.log('Order Data:', orderData);
    console.log('Customer Details:', customerDetails);

    // Load Razorpay script
    await loadRazorpayScript();
    console.log('Razorpay script loaded successfully');

    // Get Razorpay key
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SnhrMpmmCgio5Q';
    console.log('Razorpay Key:', razorpayKey ? 'Key found' : 'Key missing');

    // Validate required fields
    if (!orderData.order_id) {
      throw new Error('Order ID is required');
    }

    if (!orderData.rzpay_order_id) {
      throw new Error('Razorpay Order ID is required');
    }

    if (!orderData.amount || orderData.amount <= 0) {
      throw new Error('Invalid amount');
    }

    if (!customerDetails.email) {
      throw new Error('Customer email is required');
    }

    // Razorpay configuration
    const options: RazorpayPaymentOptions = {
      key: razorpayKey,
      amount: Math.round(orderData.amount * 100), // Razorpay expects amount in paise, ensure it's an integer
      currency: 'INR',
      name: 'JewTone Online',
      description: `${orderData.order_id}`,
      order_id: orderData.rzpay_order_id, // Use the Razorpay order ID from backend
      prefill: {
        name: customerDetails.name || 'Customer',
        email: customerDetails.email,
        contact: customerDetails.phone || ''
      },
      notes: {
        address: customerDetails.address || '',
        backend_order_id: orderData.order_id, // Store our backend order ID
        amount: orderData.amount.toString()
      },
      theme: {
        color: '#059669' // Emerald color matching your theme
      },
      handler: (response: RazorpayResponse) => {
        console.log('Payment successful:', response);
        console.log('Backend Order ID:', orderData.order_id);
        console.log('Razorpay Order ID:', response.razorpay_order_id);
        console.log('Razorpay Payment ID:', response.razorpay_payment_id);
        onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal dismissed');
          onDismiss();
        }
      }
    };

    console.log('Razorpay options:', options);

    // Create Razorpay instance and open payment modal
    const razorpay = new (window as any).Razorpay(options);
    console.log('Razorpay instance created');
    
    razorpay.open();
    console.log('Razorpay modal opened');

  } catch (error) {
    console.error('Razorpay initialization error:', error);
    onFailure(error);
  }
};

// Verify Razorpay payment signature (for server-side verification)
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  // This should be done on the server side for security
  // For now, we'll return true as a placeholder
  // In production, send these details to your backend for verification
  return true;
};

// Handle payment success
export const handlePaymentSuccess = async (response: RazorpayResponse, orderData?: RazorpayOrderResponse) => {
  console.log('Payment successful:', response);
  console.log('Backend Order ID:', orderData?.order_id);
  console.log('Razorpay Order ID:', response.razorpay_order_id);
  console.log('Razorpay Payment ID:', response.razorpay_payment_id);
  
  let serverVerified = false;
  try {
    // If we have order data, update the server immediately
    if (orderData) {
      const paymentData = {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        order_id: orderData.order_id, // This is your backend order ID
        amount: orderData.amount
      };

      // Import the API function dynamically to avoid circular dependencies
      const { verifyPaymentAndUpdateOrder } = await import('./api');
      
      console.log('Updating server with payment details...');
      console.log('Payment data being sent to server:', paymentData);
      const serverResponse = await verifyPaymentAndUpdateOrder(paymentData);
      console.log('Server update response:', serverResponse);
      serverVerified = !!(serverResponse?.status || serverResponse?.success);
    }
  } catch (error) {
    console.error('Failed to update server:', error);
    // Continue with redirect even if server update fails
  }
  
  // Redirect to success page with payment details
  const successUrl = `/payment/success?paymentId=${response.razorpay_payment_id}&orderId=${response.razorpay_order_id}&signature=${response.razorpay_signature}&backendOrderId=${orderData?.order_id || ''}&amount=${orderData?.amount || 0}&serverVerified=${serverVerified ? '1' : '0'}`;
  window.location.href = successUrl;
};

// Handle payment failure
export const handlePaymentFailure = (error: any) => {
  console.error('Payment failed:', error);
  
  // Redirect to failure page
  const failureUrl = `/payment/failed?error=${encodeURIComponent('Payment was cancelled or failed')}`;
  window.location.href = failureUrl;
};

// Handle payment modal dismissal
export const handlePaymentDismiss = () => {
  console.log('Payment modal dismissed');
  
  // Redirect to failure page
  const failureUrl = `/payment/failed?error=${encodeURIComponent('Payment was cancelled')}`;
  window.location.href = failureUrl;
};

// Test function to check Razorpay configuration
export const testRazorpayConfiguration = () => {
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  console.log('=== Razorpay Configuration Test ===');
  console.log('Key exists:', !!key);
  console.log('Key value:', key);
  console.log('Key format valid:', key?.startsWith('rzp_'));
  console.log('====================================');
};

// Declare Razorpay types for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
} 