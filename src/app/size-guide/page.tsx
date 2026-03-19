import { Metadata } from 'next';
import SizeGuideClient from './SizeGuideClient';

export const metadata: Metadata = {
  title: 'Size Guide | JewTone Online',
  description: 'Find the perfect jewelry size with our comprehensive size guide. Learn how to measure rings, bracelets, and necklaces.',
  keywords: 'jewelry size guide, ring size, bracelet size, necklace length, jewelry measurements',
};

export default function SizeGuidePage() {
  return <SizeGuideClient />;
} 