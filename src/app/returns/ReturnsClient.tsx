"use client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartProvider } from '@/contexts/CartContext';

export default function ReturnsClient() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Returns & Exchanges</CardTitle>
                <p className="text-gray-600">We want you to love your jewelry. Read our return and exchange policy below.</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-2">Return Policy</h2>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Returns accepted within 30 days of delivery.</li>
                    <li>Items must be unworn, in original packaging, and with all tags attached.</li>
                    <li>Custom or engraved items are non-returnable.</li>
                  </ul>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">How to Return</h2>
                  <ol className="list-decimal pl-6 text-gray-700 space-y-1">
                    <li>Contact our support team to initiate a return.</li>
                    <li>Pack your item securely and include your order number.</li>
                    <li>Ship the item using the provided return label.</li>
                    <li>Refunds are processed within 5-7 business days after receipt.</li>
                  </ol>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
                  <p className="text-gray-700">Email us at <a href="mailto:support@luxegems.com" className="text-emerald-700 hover:underline">support@luxegems.com</a> or call <a href="tel:+15551234567" className="text-emerald-700 hover:underline">+1 (555) 123-4567</a>.</p>
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