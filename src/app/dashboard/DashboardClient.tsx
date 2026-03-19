"use client";
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { User, ShoppingBag, Heart, Settings, Package, Calendar, DollarSign, MapPin } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { getOrders } from '@/lib/api';
import { useEffect, useState } from 'react';
import DashboardBreadcrumb from '@/components/DashboardBreadcrumb';

export default function DashboardClient() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response || []);
        
        // Calculate total spent
        const total = response?.reduce((sum: number, order: any) => {
          return sum + parseFloat(order.final_amount || 0);
        }, 0) || 0;
        setTotalSpent(total);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <DashboardBreadcrumb items={[]} />
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">My Account</h1>
            <p className="text-slate-600 text-lg mt-2">Welcome back, {user?.name || user?.email}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Account Stats */}
            <Card className="border-2 border-purple-100 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {user?.email}</p>
                  <p><span className="font-medium">Member since:</span> 2024</p>
                  <p><span className="font-medium">Total orders:</span> {orders.length}</p>
                  <p><span className="font-medium">Total spent:</span> ${totalSpent.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            {/* Recent Orders */}
            <Card className="border-2 border-purple-100 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No orders yet</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div 
                          key={order.id} 
                          className="border-2 border-purple-100 rounded-xl p-3 bg-purple-50 cursor-pointer hover:bg-purple-100 hover:border-purple-300 transition-all"
                          onClick={() => router.push(`/order/${order.order_number}`)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-sm">{order.order_number}</p>
                              <p className="text-xs text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(order.placed_at)}
                              </p>
                            </div>
                            <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm">
                              <Package className="h-3 w-3 mr-1" />
                              {order.items?.length || 0} items
                            </div>
                            <div className="flex items-center font-medium text-sm">
                              <DollarSign className="h-3 w-3 mr-1" />
                              ${parseFloat(order.final_amount).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Link href="/order-history">
                  <Button variant="outline" size="sm" className="w-full mt-4 border-2 border-purple-200 hover:bg-purple-50 rounded-full">
                    View All Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Quick Actions */}
            <Card className="border-2 border-purple-100 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/order-history">
                  <Button variant="outline" className="w-full justify-start border-2 border-purple-100 hover:bg-purple-50 hover:border-purple-300 rounded-full">
                    <ShoppingBag className="mr-2 h-4 w-4 text-purple-600" />
                    Order History
                  </Button>
                </Link>
                <Link href="/addresses">
                  <Button variant="outline" className="w-full justify-start mt-2 border-2 border-purple-100 hover:bg-purple-50 hover:border-purple-300 rounded-full">
                    <MapPin className="mr-2 h-4 w-4 text-purple-600" />
                    Manage Addresses
                  </Button>
                </Link>
                <Link href="/addresses">
                  <Button variant="outline" className="w-full justify-start mt-2 border-2 border-purple-100 hover:bg-purple-50 hover:border-purple-300 rounded-full">
                    <Heart className="mr-2 h-4 w-4 text-purple-600" />
                    Wishlist
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start mt-2 border-2 border-purple-100 hover:bg-purple-50 hover:border-purple-300 rounded-full">
                    <Settings className="mr-2 h-4 w-4 text-purple-600" />
                    Account Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
} 