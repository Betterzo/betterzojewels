"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';
import AddressModule from '@/components/AddressModule';
import { CreditCard, DollarSign, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { applyCoupon, placeOrder } from '@/lib/api';
import { validateCardNumber, validateExpiryDate, validateCVV, validateUPIId } from '@/lib/payment';
import { 
  initializeRazorpayPayment, 
  handlePaymentSuccess, 
  handlePaymentFailure, 
  handlePaymentDismiss,
  RazorpayOrderResponse,
  testRazorpayConfiguration
} from '@/lib/razorpay';
import { testRazorpaySimple } from '@/lib/razorpay-test';
import { debugRazorpayOrderIds } from '@/lib/razorpay-debug';

const CheckoutPage = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    upiId: ''
  });
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const getCouponApiErrorMessage = (error: any) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.data?.message ||
      error?.message ||
      'Invalid or expired coupon code.'
    );
  };

  // Pre-fill form with user data when authenticated
  useEffect(() => {
    if (user?.user) {
      setFormData(prev => ({
        ...prev,
        email: user.user.email || '',
        firstName: user.user.name || '',
        lastName: user.user.lastName || '',
        address: user.user.address || '',
        city: user.user.city || '',
        state: user.user.state || '',
        zipCode: user.user.zipCode || ''
      }));
    }
  }, [user]);

  // When an address is selected from AddressModule, update form fields
  useEffect(() => {
    if (selectedAddress) {
      setFormData(prev => ({
        ...prev,
        nameOnCard: selectedAddress.name || prev.nameOnCard,
        email: selectedAddress.email || prev.email,
        address: selectedAddress.address_line_1 || prev.address,
        city: selectedAddress.city || prev.city,
        state: selectedAddress.state || prev.state,
        zipCode: selectedAddress.zip || prev.zipCode,
        country: selectedAddress.country || prev.country,
      }));
    }
  }, [selectedAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      const match = cleaned.match(/(\d{1,4})/g);
      formattedValue = match ? match.join(' ') : cleaned;
    }

    // Format expiry date
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        formattedValue = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      } else {
        formattedValue = cleaned;
      }
    }

    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const couponCode = coupon.trim();
    if (!couponCode) {
      setDiscount(0);
      setAppliedCoupon('');
      setCouponError('Please enter a coupon code.');
      return;
    }

    try {
      setIsApplyingCoupon(true);
      setCouponError('');

      const response = await applyCoupon(couponCode, getTotalPrice());
      const couponData = response?.data;
      const appliedDiscount = Number.parseFloat(couponData?.discount ?? '0');

      if (!response?.status || !couponData) {
        throw new Error(response?.message || 'Invalid or expired coupon code.');
      }

      setDiscount(Number.isFinite(appliedDiscount) ? appliedDiscount : 0);
      setAppliedCoupon(couponData?.coupon?.code || couponCode.toUpperCase());
      toast.success(response?.message || 'Coupon applied successfully');
    } catch (error: any) {
      setDiscount(0);
      setAppliedCoupon('');
      const apiMessage = getCouponApiErrorMessage(error);
      setCouponError(apiMessage);
      toast.error(apiMessage);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that an address is selected
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    // For online and UPI payments, we only need basic validation
    // Razorpay will handle the actual payment details
    if (paymentMethod === 'online' || paymentMethod === 'upi') {
      if (!formData.nameOnCard && !formData.firstName) {
        toast.error('Please enter your name for payment');
        return;
      }
    }

    // Validate cart has items
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // For online and UPI payments, place order first to get order_id
      if (paymentMethod === 'online' || paymentMethod === 'upi') {
        // Prepare order data according to API structure
        const orderData = {
          shipping_address_id: selectedAddress.id.toString(),
          payment_method: paymentMethod
        };

        // Call the checkout API to place order first
        const orderResponse = await placeOrder(orderData);
        
        // Check if order was placed successfully
        if (!orderResponse.status) {
          toast.error(orderResponse.message || 'Failed to place order');
          return;
        }

        // Order placed successfully, now initialize Razorpay payment
        const razorpayOrderData: RazorpayOrderResponse = {
          status: orderResponse.status,
          message: orderResponse.message,
          order_id: orderResponse.order_id,
          amount: orderResponse.amount,
          rzpay_order_id: orderResponse.rzpay_order_id
        };

        // Customer details for Razorpay
        const customerDetails = {
          name: formData.nameOnCard || `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: selectedAddress.phone,
          address: `${selectedAddress.address_line_1}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zip}`
        };

        // Test Razorpay configuration first
        // testRazorpayConfiguration();

        // Initialize Razorpay payment
        try {
          console.log('About to initialize Razorpay payment...');
          console.log('Order data being sent to Razorpay:', razorpayOrderData);
          
          await initializeRazorpayPayment(
            razorpayOrderData,
            customerDetails,
            (response) => {
              // Debug order IDs
              debugRazorpayOrderIds(razorpayOrderData, response);
              handlePaymentSuccess(response, razorpayOrderData);
            },
            handlePaymentFailure,
            handlePaymentDismiss
          );
          console.log('Razorpay initialization completed');
        } catch (error) {
          console.error('Error initializing Razorpay:', error);
          toast.error('Failed to initialize payment. Please try again.');
        }

        return; // Don't proceed further as Razorpay will handle the flow
      }

      // For COD orders, proceed normally
      const orderData = {
        shipping_address_id: selectedAddress.id.toString(),
        payment_method: paymentMethod
      };

      // Call the checkout API
      const response = await placeOrder(orderData);
      
      // Show success message for COD
      toast.success('Order placed successfully! You will pay on delivery.');
      
      // Clear the cart after successful order
      // await clearCart();
      
      // Redirect to dashboard for COD orders
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Order placement error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Please login again to place your order');
        router.push('/login');
      } else if (error.response?.status === 422) {
        toast.error('Please check your order details and try again');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getTotalPrice();
  const tax = (subtotal - discount) * 0.03;
  const total = subtotal - discount + tax;

  return (
    <ProtectedRoute redirectTo="/login">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Checkout</h1>
            {user?.user && (
              <p className="text-slate-600 text-lg mt-2">
                Welcome back, {user.user.name || user.user.email}! Your information has been pre-filled below.
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <Card className="border-2 border-purple-100 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AddressModule
                    onSelect={setSelectedAddress}
                    editable={true}
                    selectedId={selectedAddress?.id || null}
                  />
                  {!selectedAddress && (
                    <div className="text-amber-600 text-sm flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>Please select a shipping address to continue</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method Selection */}
              <Card className="border-2 border-purple-100 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {/* Cash on Delivery */}
                    {/* <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <div className="flex items-center space-x-3 flex-1">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <div>
                          <Label htmlFor="cod" className="text-base font-medium cursor-pointer">
                            Cash on Delivery (COD)
                          </Label>
                          <p className="text-sm text-gray-500">Pay when you receive your order</p>
                        </div>
                      </div>
                    </div> */}

                    {/* Online Payment */}
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="online" id="online" />
                      <div className="flex items-center space-x-3 flex-1">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <Label htmlFor="online" className="text-base font-medium cursor-pointer">
                            Online Payment
                          </Label>
                          <p className="text-sm text-gray-500">Credit/Debit Card, UPI, Net Banking</p>
                        </div>
                      </div>
                    </div>

                    {/* UPI Payment */}
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="upi" id="upi" />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="h-5 w-5 bg-purple-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">UPI</span>
                        </div>
                        <div>
                          <Label htmlFor="upi" className="text-base font-medium cursor-pointer">
                            UPI Payment
                          </Label>
                          <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                        </div>
                      </div>
                    </div>

                    {/* Bank Transfer - Disabled */}
                    <div className="flex items-center space-x-3 p-4 border rounded-lg bg-gray-100 opacity-60 cursor-not-allowed">
                      <RadioGroupItem value="bank" id="bank" disabled />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="h-5 w-5 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">BT</span>
                        </div>
                        <div>
                          <Label htmlFor="bank" className="text-base font-medium cursor-not-allowed">
                            Bank Transfer
                          </Label>
                          <p className="text-sm text-gray-500">Direct bank transfer</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <AlertCircle className="h-3 w-3 text-orange-500" />
                            <span className="text-xs text-orange-600">Coming Soon</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Information - Show for online payment */}
              {paymentMethod === 'online' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <span>Online Payment Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nameOnCard">Name for Payment</Label>
                      <Input
                        id="nameOnCard"
                        name="nameOnCard"
                        required
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800">Secure Payment Gateway</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Your payment will be processed securely through Razorpay. You can pay using:
                          </p>
                          <ul className="text-sm text-blue-700 mt-2 space-y-1">
                            <li>• Credit/Debit Cards</li>
                            <li>• Net Banking</li>
                            <li>• UPI</li>
                            <li>• Wallets</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Lock className="h-4 w-4" />
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* UPI Payment Information */}
              {paymentMethod === 'upi' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="h-5 w-5 bg-purple-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">UPI</span>
                      </div>
                      <span>UPI Payment Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nameOnCard">Name for Payment</Label>
                      <Input
                        id="nameOnCard"
                        name="nameOnCard"
                        required
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-5 w-5 bg-purple-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">UPI</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-800">UPI Payment</h4>
                          <p className="text-sm text-purple-700 mt-1">
                            Pay using UPI through Razorpay's secure payment gateway.
                          </p>
                          <ul className="text-sm text-purple-700 mt-2 space-y-1">
                            <li>• Google Pay, PhonePe, Paytm</li>
                            <li>• Any UPI-enabled app</li>
                            <li>• Quick and secure payment</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Lock className="h-4 w-4" />
                      <span>Your UPI payment is secure and encrypted</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* COD Information */}
              {paymentMethod === 'cod' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span>Cash on Delivery</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800">Pay on Delivery</h4>
                          <p className="text-sm text-green-700 mt-1">
                            You can pay with cash when your order is delivered. No advance payment required.
                          </p>
                          <ul className="text-sm text-green-700 mt-2 space-y-1">
                            <li>• Pay with cash, card, or UPI at delivery</li>
                            <li>• No additional charges</li>
                            <li>• Secure and convenient</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4 border-2 border-purple-100 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Coupon Code */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      placeholder="Coupon code"
                      className="border rounded px-3 py-2 flex-1"
                    />
                    <Button type="submit" size="sm" disabled={isApplyingCoupon}>
                      {isApplyingCoupon ? 'Applying...' : 'Apply'}
                    </Button>
                  </form>
                  {appliedCoupon && (
                    <div className="text-green-600 text-sm mb-2">Coupon <b>{appliedCoupon}</b> applied! -${discount.toFixed(2)}</div>
                  )}
                  {couponError && (
                    <div className="text-red-600 text-sm mb-2">{couponError}</div>
                  )}
                  
                  {/* Payment Method Display */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      {paymentMethod === 'cod' ? (
                        <DollarSign className="h-4 w-4 text-green-600" />
                      ) : paymentMethod === 'upi' ? (
                        <div className="h-4 w-4 bg-purple-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">UPI</span>
                        </div>
                      ) : (
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      )}
                      <span className="text-sm font-medium">
                        {paymentMethod === 'cod' ? 'Cash on Delivery' : 
                         paymentMethod === 'upi' ? 'UPI Payment' : 'Online Payment'}
                      </span>
                    </div>
                  </div>

                  {/* Test Razorpay Button (for debugging) */}
                  {/* {(paymentMethod === 'online' || paymentMethod === 'upi') && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 mb-2">Debug: Test Razorpay Integration</p>
                      <Button 
                        onClick={testRazorpaySimple}
                        size="sm"
                        variant="outline"
                        className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                      >
                        Test Razorpay (₹1)
                      </Button>
                    </div>
                  )} */}

                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.featured_image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>Discount</span>
                        <span>- ${discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total</span>
                      <span className="text-emerald-800">${total.toLocaleString()}</span>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      disabled={isSubmitting || !selectedAddress || items.length === 0}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        paymentMethod === 'cod' ? 'Place Order (Pay on Delivery)' : 
                        paymentMethod === 'upi' ? 'Complete UPI Payment' : 'Complete Online Payment'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default CheckoutPage; 