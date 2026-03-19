// Payment service for handling online and UPI payments
// This is a mock implementation that can be easily replaced with real payment gateways like Razorpay, Stripe, etc.

export interface PaymentDetails {
  amount: number;
  currency: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod: 'online' | 'upi';
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
  };
  upiDetails?: {
    upiId: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  message: string;
  redirectUrl?: string;
}

// Mock payment gateway class
class PaymentGateway {
  private apiKey: string;
  private secretKey: string;

  constructor() {
    // In real implementation, these would come from environment variables
    this.apiKey = 'mock_api_key';
    this.secretKey = 'mock_secret_key';
  }

  // Initialize payment
  async initializePayment(paymentDetails: PaymentDetails): Promise<PaymentResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (paymentDetails.amount <= 0) {
        throw new Error('Invalid amount');
      }

      if (paymentDetails.paymentMethod === 'online' && !paymentDetails.cardDetails) {
        throw new Error('Card details required for online payment');
      }

      // Special handling for demo card number
      if (paymentDetails.paymentMethod === 'online' && 
          paymentDetails.cardDetails?.cardNumber.replace(/\s/g, '') === '4111111111111111') {
        // Always succeed for demo card number
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return {
          success: true,
          transactionId,
          paymentId,
          message: 'Payment processed successfully (Demo)',
          redirectUrl: `/payment/success?transactionId=${transactionId}&paymentId=${paymentId}`
        };
      }

      if (paymentDetails.paymentMethod === 'upi' && !paymentDetails.upiDetails) {
        throw new Error('UPI ID required for UPI payment');
      }

      // Generate mock transaction ID
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate payment processing
      const isSuccess = Math.random() > 0.1; // 90% success rate for demo

      if (isSuccess) {
        return {
          success: true,
          transactionId,
          paymentId,
          message: 'Payment processed successfully',
          redirectUrl: `/payment/success?transactionId=${transactionId}&paymentId=${paymentId}`
        };
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Payment processing failed',
        redirectUrl: `/payment/failed?error=${encodeURIComponent(error.message || 'Payment processing failed')}`
      };
    }
  }

  // Verify payment
  async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock verification
      const isValid = transactionId.startsWith('TXN_');

      if (isValid) {
        return {
          success: true,
          transactionId,
          message: 'Payment verified successfully'
        };
      } else {
        throw new Error('Invalid transaction ID');
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Payment verification failed'
      };
    }
  }

  // Process UPI payment
  async processUPIPayment(paymentDetails: PaymentDetails): Promise<PaymentResponse> {
    try {
      // Simulate UPI payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!paymentDetails.upiDetails?.upiId) {
        throw new Error('UPI ID is required');
      }

      // Validate UPI ID format (basic validation)
      const upiIdRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
      if (!upiIdRegex.test(paymentDetails.upiDetails.upiId)) {
        throw new Error('Invalid UPI ID format');
      }

      // Special handling for demo UPI ID
      if (paymentDetails.upiDetails.upiId === 'demo@jewtone') {
        // Always succeed for demo UPI ID
        const transactionId = `UPI_TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const paymentId = `UPI_PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return {
          success: true,
          transactionId,
          paymentId,
          message: 'UPI payment processed successfully (Demo)',
          redirectUrl: `/payment/success?transactionId=${transactionId}&paymentId=${paymentId}`
        };
      }

      const transactionId = `UPI_TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const paymentId = `UPI_PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate UPI payment success
      const isSuccess = Math.random() > 0.05; // 95% success rate for UPI

      if (isSuccess) {
        return {
          success: true,
          transactionId,
          paymentId,
          message: 'UPI payment processed successfully',
          redirectUrl: `/payment/success?transactionId=${transactionId}&paymentId=${paymentId}`
        };
      } else {
        throw new Error('UPI payment failed. Please check your UPI ID and try again.');
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'UPI payment processing failed',
        redirectUrl: `/payment/failed?error=${encodeURIComponent(error.message || 'UPI payment processing failed')}`
      };
    }
  }
}

// Create payment gateway instance
const paymentGateway = new PaymentGateway();

// Export payment functions
export const initializePayment = async (paymentDetails: PaymentDetails): Promise<PaymentResponse> => {
  if (paymentDetails.paymentMethod === 'upi') {
    return await paymentGateway.processUPIPayment(paymentDetails);
  } else {
    return await paymentGateway.initializePayment(paymentDetails);
  }
};

export const verifyPayment = async (transactionId: string): Promise<PaymentResponse> => {
  return await paymentGateway.verifyPayment(transactionId);
};

// Helper function to format card number for display
export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  const match = cleaned.match(/(\d{1,4})/g);
  return match ? match.join(' ') : cardNumber;
};

// Helper function to validate card number (Luhn algorithm)
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(cleaned)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Helper function to validate expiry date
export const validateExpiryDate = (expiryDate: string): boolean => {
  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expMonth = parseInt(month);
  const expYear = parseInt(year);

  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;
  if (expMonth < 1 || expMonth > 12) return false;

  return true;
};

// Helper function to validate CVV
export const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

// Helper function to validate UPI ID
export const validateUPIId = (upiId: string): boolean => {
  const upiIdRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
  return upiIdRegex.test(upiId);
}; 