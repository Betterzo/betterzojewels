import { Suspense } from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | JewTone Online',
  description: 'Read JewTone Online\'s terms of service to understand the rules and regulations for using our platform.',
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">Terms of Service</h1>
          <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                By accessing and using JewTone Online, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">2. Use License</h2>
              <p className="text-slate-700 leading-relaxed">
                Permission is granted to temporarily download one copy of the materials (information or software) on JewTone Online for personal, non-commercial transitory viewing only.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">3. Disclaimer</h2>
              <p className="text-slate-700 leading-relaxed">
                The materials on JewTone Online are provided on an 'as is' basis. JewTone Online makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">4. Limitations</h2>
              <p className="text-slate-700 leading-relaxed">
                In no event shall JewTone Online or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on JewTone Online, even if JewTone Online or a JewTone Online authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">5. Revisions and Errata</h2>
              <p className="text-slate-700 leading-relaxed">
                The materials appearing on JewTone Online could include technical, typographical, or photographic errors. JewTone Online does not warrant that any of the materials on its website are accurate, complete or current.
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

export default function TermsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <TermsContent />
    </Suspense>
  );
} 