import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Shopping Cart | JewTone Online',
  description: 'Review your selected jewelry items. Add, remove, or update quantities before checkout.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartPage() {
  return <CartClient />;
} 