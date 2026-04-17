import { Suspense } from 'react';
import { Metadata } from 'next';
import LoginClient from './LoginClient';
import { LoadingPage } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'Sign In | BetterZoJewels Online',
  description: 'Sign in to your BetterZoJewels account to access your orders, wishlist, and personalized recommendations.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LoginClient />
    </Suspense>
  );
} 