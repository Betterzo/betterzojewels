import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Betterzojewels Online - Premium Jewelry Store | Rings, Necklaces, Earrings & More',
  description: 'Discover our exclusive collection of premium jewelry. Shop for rings, necklaces, earrings, bracelets and more with secure payment options. Free shipping on orders over $50.',
  keywords: 'jewelry, rings, necklaces, earrings, bracelets, premium jewelry, online jewelry store, diamond jewelry, gold jewelry',
  openGraph: {
    title: 'Betterzojewels Online - Premium Jewelry Store',
    description: 'Discover our exclusive collection of premium jewelry. Shop for rings, necklaces, earrings, and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Betterzojewels Online - Premium Jewelry Store',
    description: 'Discover our exclusive collection of premium jewelry.',
  },
};

export default function HomePage() {
  return <HomeClient />;
} 