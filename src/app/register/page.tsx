import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Create Account | BetterZoJewels Online',
  description: 'Create your BetterZoJewels account to start shopping premium jewelry. Get access to exclusive deals and faster checkout.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
} 