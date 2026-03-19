import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | JewTone Online',
  description: 'Get in touch with JewTone Online. We\'re here to help with your jewelry questions, orders, and support needs.',
  keywords: 'contact, customer service, support, jewelry help, JewTone support',
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
