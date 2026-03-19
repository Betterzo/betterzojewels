"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { requestOTP, verifyOTP } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await requestOTP(email.trim());
      setStep('otp');
      setCountdown(60);
      toast.success('OTP sent to your email!');
      
      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTP(email, otp);
      
      // Use AuthContext to handle login
      const userData = response;
      const token = response.auth_token;
      
      login(userData, token);
      
      toast.success('Login successful!');
      
      // Redirect to the intended page or dashboard
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      await requestOTP(email);
      setCountdown(60);
      toast.success('OTP resent to your email!');
      
      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setCountdown(0);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border border-purple-100/50 shadow-2xl bg-white rounded-3xl overflow-hidden">
              <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-10">
                <CardTitle className="text-3xl font-extrabold">
                  {step === 'email' ? 'Welcome Back' : 'Enter OTP'}
                </CardTitle>
                <p className="text-white/95 mt-3 text-lg">
                  {step === 'email' 
                    ? 'Sign in to your account' 
                    : `We've sent a 6-digit code to ${email}`
                  }
                </p>
                {redirectTo !== '/dashboard' && (
                  <p className="text-sm text-white/80 mt-2">
                    You'll be redirected to {redirectTo === '/checkout' ? 'checkout' : 'your intended page'} after login
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {step === 'email' ? (
                  <form onSubmit={handleRequestOTP} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={loading}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      disabled={loading}
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                      <Label htmlFor="otp">Enter 6-digit OTP</Label>
                      <div className="flex justify-center mt-2">
                        <InputOTP
                          value={otp}
                          onChange={setOtp}
                          maxLength={6}
                          disabled={loading}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                        disabled={loading || otp.length !== 6}
                      >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </Button>
                      
                      <div className="flex justify-between items-center text-sm">
                        <button
                          type="button"
                          onClick={handleBackToEmail}
                          className="text-purple-600 hover:text-purple-700 font-medium"
                          disabled={loading}
                        >
                          ← Back to email
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={loading || countdown > 0}
                          className={`font-medium ${
                            countdown > 0 
                              ? 'text-slate-400 cursor-not-allowed' 
                              : 'text-purple-600 hover:text-purple-700'
                          }`}
                        >
                          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                
                <div className="mt-6 text-center">
                  <p className="text-slate-600">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
                      Create one
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
} 