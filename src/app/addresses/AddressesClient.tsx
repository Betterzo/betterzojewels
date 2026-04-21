"use client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddressModule from '@/components/AddressModule';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import DashboardBreadcrumb from '@/components/DashboardBreadcrumb';

export default function AddressesClient() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
        <Header />

        <div className="container mx-auto px-4 py-12">

          {/* Breadcrumb */}
          <DashboardBreadcrumb 
            items={[
              {
                label: 'Addresses',
                icon: <MapPin className="h-4 w-4 text-purple-600" />
              }
            ]} 
          />

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-4xl leading-[1.2] pb-2 font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
              <MapPin className="mr-3 h-9 w-9 text-purple-600" />
              My Addresses
            </h1>

            <p className="text-slate-600 mt-3 text-lg">
              Manage your shipping and billing addresses for faster checkout
            </p>
          </div>

          {/* Address Card */}
          <div className="max-w-4xl mx-auto">
            <Card className="rounded-2xl shadow-xl border-2 border-purple-100 bg-white">

              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-2xl">
                <CardTitle className="text-xl font-semibold">
                  Address Management
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8">
                <AddressModule editable={true} />
              </CardContent>

            </Card>
          </div>

        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}