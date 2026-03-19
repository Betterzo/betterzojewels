import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Create Account | JewTone Online',
  description: 'Create your JewTone account to start shopping premium jewelry. Get access to exclusive deals and faster checkout.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
} 