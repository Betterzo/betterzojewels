"use client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartProvider } from '@/contexts/CartContext';

export default function SizeGuideClient() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Size Guide</CardTitle>
                <p className="text-gray-600">Find your perfect fit with our comprehensive size guide.</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-2">Ring Size Chart</h2>
                  <table className="w-full text-left border mt-2">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-3">US Size</th>
                        <th className="py-2 px-3">Diameter (mm)</th>
                        <th className="py-2 px-3">Circumference (mm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="py-1 px-3">5</td><td>15.7</td><td>49.3</td></tr>
                      <tr><td className="py-1 px-3">6</td><td>16.5</td><td>51.9</td></tr>
                      <tr><td className="py-1 px-3">7</td><td>17.3</td><td>54.4</td></tr>
                      <tr><td className="py-1 px-3">8</td><td>18.1</td><td>57.0</td></tr>
                      <tr><td className="py-1 px-3">9</td><td>18.9</td><td>59.5</td></tr>
                    </tbody>
                  </table>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">How to Measure Your Ring Size</h2>
                  <ol className="list-decimal pl-6 text-gray-700 space-y-1">
                    <li>Wrap a strip of paper around the base of your finger.</li>
                    <li>Mark where the paper overlaps and measure the length in millimeters.</li>
                    <li>Use the chart above to find your corresponding US ring size.</li>
                  </ol>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">Tips for the Perfect Fit</h2>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Measure your finger at the end of the day when it's largest.</li>
                    <li>Avoid measuring when your hands are cold.</li>
                    <li>If you're between sizes, size up for comfort.</li>
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