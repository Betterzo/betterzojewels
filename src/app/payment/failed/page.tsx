"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, CreditCard, Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import { PageSkeleton } from '@/components/ui/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

const PaymentFailedContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const errorMessage = searchParams.get('error') || 'Payment processing failed';
  const transactionId = searchParams.get('transactionId');

  const handleTryAgain = () => {
    router.push('/checkout');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-800">
                Payment Failed
              </CardTitle>
              <p className="text-red-700 mt-2">
                {errorMessage}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Details */}
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-gray-900 mb-3">Error Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error:</span>
                    <span className="text-red-700">{errorMessage}</span>
                  </div>
                  {transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-gray-900">{transactionId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Common Solutions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Possible Solutions
                </h3>
                <div className="space-y-2 text-sm text-yellow-800">
                  <div>• Check your card details and try again</div>
                  <div>• Ensure you have sufficient funds</div>
                  <div>• Verify your UPI ID is correct</div>
                  <div>• Try a different payment method</div>
                  <div>• Contact your bank if the issue persists</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleTryAgain}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Try Payment Again
                </Button>
                <Button 
                  onClick={handleGoBack}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
                <Button 
                  onClick={handleGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                </Button>
              </div>

              {/* Support Information */}
              <div className="text-center text-sm text-gray-600">
                <p>Need help? Contact our support team at support@jewtone.com</p>
                <p className="mt-1">or call us at +91-1234567890</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

function PaymentFailedPageSkeleton() {
  return (
    <PageSkeleton>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-purple-100 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 h-24 rounded-t-lg">
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

const PaymentFailedPage = () => {
  return (
    <Suspense fallback={<PaymentFailedPageSkeleton />}>
      <PaymentFailedContent />
    </Suspense>
  );
};

export default PaymentFailedPage; 