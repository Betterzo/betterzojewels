import { Suspense } from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingPage } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'Terms of Service | BetterZoJewels Online',
  description:
    "Read BetterZoJewels Online's terms of service to understand the rules and regulations for using our platform.",
  robots: {
    index: true,
    follow: true,
  },
};

function TermsContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            Terms of Service
          </h1>
          <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-700 leading-relaxed">
                By accessing and using BetterZoJewels Online, you agree to these terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                2. Use License
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Permission is granted to temporarily download one copy of site materials for personal, non-commercial viewing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                3. Disclaimer
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Materials on BetterZoJewels Online are provided &apos;as is&apos; without warranties of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                4. Limitations
              </h2>
              <p className="text-slate-700 leading-relaxed">
                BetterZoJewels Online is not liable for damages arising from use or inability to use the website materials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                5. Revisions and Errata
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Content may include technical or typographical errors and can be updated without prior notice.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function TermsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <TermsContent />
    </Suspense>
  );
}
