'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-purple-100 mb-6">
              <Search className="h-16 w-16 text-purple-600" />
            </div>
            <h1 className="text-6xl  font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Page Not Found</h2>
            <p className="text-lg text-slate-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                <Home className="mr-2 h-5 w-5" />
                Go to Home
              </Button>
            </Link>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="rounded-full border-2 border-purple-200 hover:bg-purple-50 px-8 py-6 text-lg font-semibold"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-purple-100">
            <p className="text-slate-600 mb-4">Popular Pages:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/category/rings" className="text-purple-600 hover:text-purple-700 font-medium">
                Rings
              </Link>
              <Link href="/category/necklaces" className="text-purple-600 hover:text-purple-700 font-medium">
                Necklaces
              </Link>
              <Link href="/category/earrings" className="text-purple-600 hover:text-purple-700 font-medium">
                Earrings
              </Link>
              <Link href="/category/bracelets" className="text-purple-600 hover:text-purple-700 font-medium">
                Bracelets
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
