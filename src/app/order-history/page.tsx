import { Metadata } from 'next';
import OrderHistoryClient from './OrderHistoryClient';

export const metadata: Metadata = {
  title: 'Order History | JewTone Online',
  description: 'View your complete order history, track orders, and manage your purchases.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function OrderHistoryPage() {
  return <OrderHistoryClient />;
} 