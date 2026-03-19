import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Failed | JewTone Online',
  description: 'Your payment could not be processed. Please try again or contact support for assistance.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentFailedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
