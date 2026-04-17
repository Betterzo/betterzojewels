import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | BetterZoJewels Online',
  description: 'Complete your jewelry purchase securely. Choose your shipping address and payment method.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
