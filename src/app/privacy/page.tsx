import { Suspense } from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | JewTone Online',
  description: 'Read JewTone Online\'s privacy policy to understand how we collect, use, and protect your personal information.',
  robots: {
    index: true,
    follow: true,
  },
};

function PrivacyContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">Privacy Policy</h1>
          <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">1. Information We Collect</h2>
              <p className="text-slate-700 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, shipping address, and payment information.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">2. How We Use Your Information</h2>
              <p className="text-slate-700 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">3. Information Sharing</h2>
              <p className="text-slate-700 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy or as required by law.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">4. Data Security</h2>
              <p className="text-slate-700 leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">5. Your Rights</h2>
              <p className="text-slate-700 leading-relaxed">
                You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us. Contact us if you need assistance with any of these requests.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">6. Cookies and Tracking</h2>
              <p className="text-slate-700 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience on our website, analyze usage patterns, and provide personalized content and advertisements.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">7. Changes to This Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

import { LoadingPage } from '@/components/ui/loading';

export default function PrivacyPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <PrivacyContent />
    </Suspense>
  );
} 