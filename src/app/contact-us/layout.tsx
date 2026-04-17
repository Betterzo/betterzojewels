import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | BetterZoJewels Online',
  description: 'Get in touch with BetterZoJewels Online. We\'re here to help with your jewelry questions, orders, and support needs.',
  keywords: 'contact, customer service, support, jewelry help, BetterZoJewels support',
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
