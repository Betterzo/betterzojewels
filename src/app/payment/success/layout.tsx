import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Successful | JewTone Online',
  description: 'Your payment was successful. Your order is being processed and you will receive a confirmation shortly.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
