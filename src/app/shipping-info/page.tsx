import { Metadata } from 'next';
import ShippingInfoClient from './ShippingInfoClient';

export const metadata: Metadata = {
  title: 'Shipping Information | JewTone Online',
  description: 'Learn about JewTone Online shipping options, delivery times, and shipping costs. Free shipping on orders over $50.',
  keywords: 'shipping, delivery, free shipping, jewelry shipping, shipping policy',
};

export default function ShippingInfoPage() {
  return <ShippingInfoClient />;
} 