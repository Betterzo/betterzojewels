"use client";
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getOrders } from '@/lib/api';
import { useEffect, useState } from 'react';
import { Package, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import DashboardBreadcrumb from '@/components/DashboardBreadcrumb';

export default function OrderHistoryClient() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        console.log('Fetched orders:', response);
        setOrders(response || []);
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
          <DashboardBreadcrumb 
            items={[
              {
                label: 'Order History',
                icon: <ShoppingBag className="h-4 w-4" />
              }
            ]} 
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">Order History</h1>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{order.order_number}</CardTitle>
                      <p className="text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Placed on {formatDate(order.placed_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <p className="text-lg font-semibold text-emerald-800 mt-2">
                        ${parseFloat(order.final_amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product_name}</h4>
                          <p className="text-gray-600">SKU: {item.sku} • Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${parseFloat(item.price).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Subtotal: ${parseFloat(item.subtotal).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Payment Method:</span>
                      <span className="capitalize">{order.payment_method}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Payment Status:</span>
                      <Badge className={`text-xs ${getStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/order/${order.order_number}`)}
                    >
                      View Details
                    </Button>
                    {/* {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button variant="outline" size="sm">
                        Track Package
                      </Button>
                    )} */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
} 