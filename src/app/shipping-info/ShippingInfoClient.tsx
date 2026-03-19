"use client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartProvider } from '@/contexts/CartContext';

export default function ShippingInfoClient() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Shipping Information</CardTitle>
                <p className="text-gray-600">Learn about our shipping methods, delivery times, and more.</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-2">Shipping Methods</h2>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Standard Shipping (5-7 business days)</li>
                    <li>Express Shipping (2-3 business days)</li>
                    <li>Overnight Shipping (1 business day)</li>
                    <li>Free shipping on orders over $500</li>
                  </ul>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">Delivery Times</h2>
                  <p className="text-gray-700">Orders are processed within 1-2 business days. Delivery times depend on your selected shipping method and location. You will receive a tracking number once your order ships.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">Shipping FAQs</h2>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>We ship worldwide.</li>
                    <li>All shipments are insured and require a signature upon delivery.</li>
                    <li>Contact our support for any special shipping requests.</li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
} 