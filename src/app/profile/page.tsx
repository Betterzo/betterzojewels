import { Metadata } from 'next';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
  title: 'Profile Settings | BetterZoJewels Online',
  description: 'Update your profile information, change password, and manage your account settings.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
} 