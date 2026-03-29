'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';

const ContactUs = () => {
  const [loading, setLoading] = useState(false);



const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;

  const formData = {
    name: (form.elements.namedItem('name') as HTMLInputElement).value,
    email: (form.elements.namedItem('email') as HTMLInputElement).value,
    message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
  };

  try {
    setLoading(true);

    const response = await api.post(
      '/enquiry/submit',
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      alert('Message sent successfully 🎉');
      form.reset();
    }
  } catch (error: any) {
    console.error(error);

    alert(
      error?.response?.data?.message ||
        'Something went wrong 😓'
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-purple-100 shadow-xl bg-white">
            <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg py-8">
              <CardTitle className="text-3xl font-bold mb-2">Contact Us</CardTitle>
              <p className="text-white/90">
                We'd love to hear from you! Fill out the form below.
              </p>
            </CardHeader>

            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Your name" required />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full py-6 text-lg font-semibold"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default function ContactUsWrapper() {
  return <ContactUs />;
}