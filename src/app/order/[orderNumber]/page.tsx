import { Metadata } from 'next';
import OrderDetailClient from './OrderDetailClient';

interface OrderDetailPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order #${orderNumber} | JewTone Online`,
    description: `View details and track your order #${orderNumber} on JewTone Online.`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = await params;
  return <OrderDetailClient orderNumber={orderNumber} />;
} 