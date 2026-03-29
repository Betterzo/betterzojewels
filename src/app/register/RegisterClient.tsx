"use client";
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function RegisterClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [step, setStep] = useState<'register' | 'otp'>('register');
const [otp, setOtp] = useState('');
const [userEmail, setUserEmail] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const validation = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 characters required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await api.post('/register', {
        name: formData.name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      });

     if (res.data?.success) {
  toast.success(res.data.message || "OTP sent to your email");

  setUserEmail(formData.email);
  setStep('otp'); // 🔥 switch to OTP screen


      } else {
        toast.error(res.data?.message || "Registration failed");
      }

    } catch (error: any) {
      console.log("API Error:", error);

      // 🔥 Backend error handling
      if (error.response) {
        const msg =
          error.response.data?.message ||
          error.response.data?.error ||
          "Something went wrong";

        toast.error(msg);

        // अगर backend field-wise errors भेजता है
        if (error.response.data?.errors) {
          setErrors(error.response.data.errors);
        }

      } else {
        toast.error("Network error, please try again");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!otp) {
    toast.error("Please enter OTP");
    return;
  }

  setLoading(true);

  try {
    console.log("Verifying OTP for:", formData.email, "OTP:", otp); // 🔥 debug log
    const res = await api.post('/verify-email-otp', {
      email: formData.email, // 🔥 use formData.email instead of userEmail to ensure correct email is sent
      otp: otp
    });

    if (res.data?.success) {
      toast.success("Account verified successfully 🎉");

      // redirect ya login
      // window.location.href = "/login";
      router.push('/login');
    } else {
      toast.error(res.data?.error || "Invalid OTP");
    }

  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "OTP verification failed"
    );
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // error clear on typing
    setErrors((prev: any) => ({
      ...prev,
      [e.target.name]: ''
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-purple-100 shadow-xl bg-white">
            
            <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg py-8">
              <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
              <p className="text-white/90 mt-2">Join our exclusive jewelry collection</p>
            </CardHeader>

            <CardContent>
             { step === 'register' ? (
                <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div>
                    <Label>Last Name</Label>
                    <Input name="last_name" value={formData.last_name} onChange={handleChange} />
                    {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div>
                  <Label>Password</Label>
                  <Input name="password" type="password" value={formData.password} onChange={handleChange} />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <div>
                  <Label>Confirm Password</Label>
                  <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-center">
                  <input type="checkbox" required className="mr-2" />
                  <span className="text-sm">
                    I agree to <Link href="/terms" className="text-purple-600">Terms</Link>
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>

              </form>
              ) : (
                 <form onSubmit={handleVerifyOtp} className="space-y-4">

    <div>
      <Label>Enter OTP</Label>
      <Input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6 digit OTP"
      />
    </div>

    <Button type="submit" disabled={loading} className="w-full">
      {loading ? "Verifying..." : "Verify OTP"}
    </Button>

    <p className="text-sm text-center">
      Didn't receive OTP?{" "}
      <span
        className="text-purple-600 cursor-pointer"
        onClick={async () => {
          await api.post('/resend-otp', { email: userEmail });
          toast.success("OTP resent");
        }}
      >
        Resend
      </span>
    </p>

  </form>
              )}
            </CardContent>

          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}