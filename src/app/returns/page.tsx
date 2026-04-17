import { Metadata } from 'next';
import ReturnsClient from './ReturnsClient';

export const metadata: Metadata = {
  title: 'Returns & Exchanges | BetterZoJewels Online',
  description: 'Learn about BetterZoJewels Online\'s return and exchange policy. Easy 30-day returns on all jewelry purchases.',
  keywords: 'returns, exchanges, refund policy, jewelry returns, return policy',
};

export default function ReturnsPage() {
  return <ReturnsClient />;
} 