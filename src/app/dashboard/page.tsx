import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'My Account | JewTone Online',
  description: 'Manage your account, view order history, update your profile, and manage addresses.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
} 