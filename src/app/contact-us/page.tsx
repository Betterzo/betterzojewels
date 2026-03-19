'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-purple-100 shadow-xl bg-white">
            <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg py-8">
              <CardTitle className="text-3xl font-bold mb-2">Contact Us</CardTitle>
              <p className="text-white/90">We'd love to hear from you! Fill out the form below or reach us at our contact details.</p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Your name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="you@email.com" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="How can we help you?" rows={5} required />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">Send Message</Button>
              </form>
              <div className="mt-8 border-t-2 border-purple-100 pt-6 text-center text-slate-600">
                <p>Email: <a href="mailto:support@luxegems.com" className="text-purple-600 hover:text-purple-700 hover:underline font-medium">support@luxegems.com</a></p>
                <p>Phone: <a href="tel:+15551234567" className="text-purple-600 hover:text-purple-700 hover:underline font-medium">+1 (555) 123-4567</a></p>
                <p>123 Main Street, New York, NY 10001</p>
                <div className="mt-4">
                  <iframe
                    title="Our Location"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-74.0104%2C40.7075%2C-74.0004%2C40.7175&amp;layer=mapnik"
                    className="w-full h-48 rounded-lg border"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
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