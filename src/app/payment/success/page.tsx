"use client";
import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard, DollarSign, ArrowRight, Home, Package } from 'lucide-react';
import { verifyPayment } from '@/lib/payment';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { verifyPaymentAndUpdateOrder, getPaymentStatus } from '@/lib/api';
import { PageSkeleton } from '@/components/ui/skeletons';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';

const PaymentSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const { clearCart } = useCart();

  const transactionId = searchParams.get('transactionId');
  const paymentId = searchParams.get('paymentId');
  const orderId = searchParams.get('orderId'); // This is Razorpay's order ID
  const backendOrderId = searchParams.get('backendOrderId'); // This is your backend order ID
  const signature = searchParams.get('signature');
  const serverVerifiedInRedirect = searchParams.get('serverVerified') === '1';
  const amountParam = searchParams.get('amount');
  const paymentMethodParam = searchParams.get('paymentMethod') || 'Online Payment';
  const verificationKey = `${transactionId || ''}|${paymentId || ''}|${orderId || ''}|${backendOrderId || ''}|${signature || ''}|${serverVerifiedInRedirect ? '1' : '0'}|${amountParam || ''}|${paymentMethodParam}`;
  const processedVerificationRef = useRef<string | null>(null);

  useEffect(() => {
    if (processedVerificationRef.current === verificationKey) {
      return;
    }
    processedVerificationRef.current = verificationKey;

    const verifyPaymentStatus = async () => {
      // For Razorpay payments, we have paymentId (required), orderId and signature (optional)
      if (paymentId) {
        try {
          if (serverVerifiedInRedirect) {
            setVerificationStatus('success');
            setPaymentDetails({
              transactionId: paymentId,
              paymentId,
              orderId,
              backendOrderId,
              amount: amountParam,
              paymentMethod: paymentMethodParam,
              serverVerified: true
            });
            clearCart().catch(() => {});
            setIsLoading(false);
            return;
          }

          // First, verify with server
          const paymentData = {
            razorpay_payment_id: paymentId,
            razorpay_order_id: orderId || undefined,
            razorpay_signature: signature || undefined,
            order_id: backendOrderId || orderId || '', // Use backend order ID if available
            amount: parseInt(amountParam || '0')
          };

          console.log('Verifying payment with server...');
          const serverResponse = await verifyPaymentAndUpdateOrder(paymentData);
          console.log('Server verification response:', serverResponse);

          if (serverResponse?.status || serverResponse?.success) {
            setVerificationStatus('success');
            setPaymentDetails({
              transactionId: paymentId,
              paymentId,
              orderId,
              backendOrderId,
              amount: amountParam,
              paymentMethod: paymentMethodParam,
              serverVerified: true
            });
            // Keep UI cart state in sync immediately after success.
            clearCart().catch(() => {});
          } else {
            // Fallback to client-side verification
            const isValid = orderId && signature ? verifyPaymentSignature(orderId, paymentId, signature) : false;
            if (isValid) {
              setVerificationStatus('success');
                          setPaymentDetails({
              transactionId: paymentId,
              paymentId,
              orderId,
              backendOrderId,
              amount: amountParam,
              paymentMethod: paymentMethodParam,
              serverVerified: false
            });
            } else {
              setVerificationStatus('failed');
            }
          }
        } catch (error) {
          console.error('Server verification failed:', error);
          // Fallback to client-side verification
          const isValid = orderId && signature ? verifyPaymentSignature(orderId, paymentId, signature) : false;
          if (isValid) {
            setVerificationStatus('success');
            setPaymentDetails({
              transactionId: paymentId,
              paymentId,
              orderId,
              backendOrderId,
              amount: amountParam,
              paymentMethod: paymentMethodParam,
              serverVerified: false
            });
          } else {
            setVerificationStatus('failed');
          }
        }
      } else if (transactionId) {
        // Fallback for other payment methods
        try {
          const response = await verifyPayment(transactionId);
          if (response.success) {
            setVerificationStatus('success');
            setPaymentDetails({
              transactionId: response.transactionId,
              paymentId,
              amount: amountParam,
              paymentMethod: paymentMethodParam
            });
          } else {
            setVerificationStatus('failed');
          }
        } catch (error) {
          setVerificationStatus('failed');
        }
      }
      setIsLoading(false);
    };

    verifyPaymentStatus();
  }, [transactionId, paymentId, orderId, signature, clearCart, serverVerifiedInRedirect, backendOrderId, amountParam, paymentMethodParam, verificationKey]);

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleViewOrders = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Verifying payment...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {verificationStatus === 'success' ? (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-800">
                  Payment Successful!
                </CardTitle>
                <p className="text-green-700 mt-2">
                  Your payment has been processed successfully and your order has been placed.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Details */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-mono text-gray-900">{paymentDetails?.paymentId}</span>
                    </div>
                    {paymentDetails?.backendOrderId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your Order ID:</span>
                        <span className="font-mono text-gray-900">{paymentDetails?.backendOrderId}</span>
                      </div>
                    )}
                    {paymentDetails?.orderId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Razorpay Order ID:</span>
                        <span className="font-mono text-gray-900">{paymentDetails?.orderId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="text-gray-900">{paymentDetails?.paymentMethod}</span>
                    </div>
                    {paymentDetails?.amount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold text-green-700">₹{paymentDetails.amount}</span>
                      </div>
                    )}
                    {paymentDetails?.serverVerified !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Server Verified:</span>
                        <span className={`font-semibold ${paymentDetails.serverVerified ? 'text-green-700' : 'text-yellow-600'}`}>
                          {paymentDetails.serverVerified ? 'Yes' : 'No'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Your order will be processed and shipped soon</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>You'll receive order confirmation via email</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-4 w-4" />
                      <span>Track your order in your dashboard</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleViewOrders}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    View My Orders
                  </Button>
                  <Button 
                    onClick={handleContinueShopping}
                    variant="outline"
                    className="flex-1"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-red-600">!</span>
                  </div>
                </div>
                <CardTitle className="text-2xl text-red-800">
                  Payment Verification Failed
                </CardTitle>
                <p className="text-red-700 mt-2">
                  We couldn't verify your payment. Please contact support if you believe this is an error.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Transaction Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-gray-900">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-mono text-gray-900">{paymentId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => router.push('/checkout')}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Try Payment Again
                  </Button>
                  <Button 
                    onClick={handleContinueShopping}
                    variant="outline"
                    className="flex-1"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Go to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

function PaymentSuccessPageSkeleton() {
  return (
    <PageSkeleton>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-purple-100 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 h-24 rounded-t-lg">
              <Skeleton className="h-12 w-12 rounded-full bg-white/20 mx-auto mb-2" />
              <Skeleton className="h-6 w-48 bg-white/20 mx-auto" />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-full" />
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </PageSkeleton>
  );
}

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={<PaymentSuccessPageSkeleton />}>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage; 