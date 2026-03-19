import { Metadata } from 'next';
import ReturnsClient from './ReturnsClient';

export const metadata: Metadata = {
  title: 'Returns & Exchanges | JewTone Online',
  description: 'Learn about JewTone Online\'s return and exchange policy. Easy 30-day returns on all jewelry purchases.',
  keywords: 'returns, exchanges, refund policy, jewelry returns, return policy',
};

export default function ReturnsPage() {
  return <ReturnsClient />;
} 