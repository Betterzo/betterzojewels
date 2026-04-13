"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProtectedRoute from '@/components/ProtectedRoute';
import api, { downloadOrderInvoice, getOrderByNumber } from '@/lib/api';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Truck, 
  MapPin,
  Phone,
  User,
  ShoppingBag,
  Clock,

} from 'lucide-react';
import DashboardBreadcrumb from '@/components/DashboardBreadcrumb';
import { OrderCardSkeleton } from '@/components/ui/skeletons';
import { toast } from 'sonner';

interface OrderDetailClientProps {
  orderNumber: string;
}

export default function OrderDetailClient({ orderNumber }: OrderDetailClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderByNumber(orderNumber);
        setOrder(orderData);
      } catch (error: any) {
        console.error('Error fetching order:', error);
        setError(error.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      case 'cancelled':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <OrderCardSkeleton />
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
              <p className="text-gray-500 mb-4">{error || 'The order you are looking for does not exist.'}</p>
              {/* <Button onClick={() => router.push('/order-history')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Order History
              </Button> */}
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  const handleDownloadInvoice = async() => {
    setDownloading(true);
    try{
         const blob= await downloadOrderInvoice(order.id);
         const url = window.URL.createObjectURL(new Blob([blob]));
         const link = document.createElement('a');
         link.href=url;
         link.download=`invoice_${order.order_number || order.id}.pdf`;      
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
       toast.success("Invoice downloaded successfully");  
    }  catch(error:any){
      console.error('Error downloading invoice:', error);
      toast.error(error.response?.data?.message || 'Failed to download invoice');
    }
    finally{
      setDownloading(false);
    }

  };


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <DashboardBreadcrumb 
            items={[
              {
                label: 'Order History',
                href: '/order-history',
                icon: <ShoppingBag className="h-4 w-4" />
              },
              {
                label: orderNumber,
                icon: <Package className="h-4 w-4" />
              }
            ]} 
          />
          {/* Header */}
          <div className="mb-8">
            {/* <Button 
              variant="outline" 
              onClick={() => router.push('/order-history')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Order History
            </Button> */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{order.order_number}</h1>
                <p className="text-gray-600 flex items-center mt-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Placed on {formatDate(order.placed_at)}
                </p>
              </div>
              <div className="text-right">
                <Badge className={`text-sm ${getStatusColor(order.status)} flex items-center gap-1`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </Badge>
                <p className="text-2xl font-bold text-emerald-800 mt-2">
                  ${parseFloat(order.final_amount).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Order Items ({order.items?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items?.map((item: any, index: number) => (
                      <div key={item.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${parseFloat(item.price).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Subtotal: ${parseFloat(item.subtotal).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span>-${parseFloat(order.discount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span>${parseFloat(order.tax).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span>${parseFloat(order.shipping_charge).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-emerald-800">${parseFloat(order.final_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="capitalize">{order.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <Badge className={`text-xs ${getStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full"
                      onClick={handleDownloadInvoice}
                    >
                      Download Invoice
                    </Button>
                    {/* {order.status === 'delivered' && (
                      <Button variant="outline" className="w-full">
                        Reorder Items
                      </Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button variant="outline" className="w-full">
                        Track Package
                      </Button>
                    )} */}

                    <Button variant="outline" className="w-full">
                    <Link href={"/contact-us"} >
                      Contact Support
                    </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
} 