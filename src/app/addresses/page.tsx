import { Suspense } from 'react';
import { Metadata } from 'next';
import AddressesClient from './AddressesClient';
import { FormSkeleton } from '@/components/ui/skeletons';
import { LoadingPage } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'My Addresses | JewTone Online',
  description: 'Manage your shipping and billing addresses for faster checkout and order delivery.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <AddressesClient />
    </Suspense>
  );
} 