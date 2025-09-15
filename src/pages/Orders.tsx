import React from 'react';
import Navigation from '@/components/Navigation';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

export default function Orders() {
  const { user } = useAuth();
  const { orders, loading, updateOrderStatus } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'refunded':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, 'cancelled');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please log in to view your orders.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2 mb-6">
            <Package className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Your Orders</h1>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground">
                  When you make a purchase, your orders will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-1">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(order.created_at), 'MMM dd, yyyy')}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <CreditCard className="h-4 w-4" />
                            <span className="capitalize">{order.payment_method}</span>
                          </span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusColor(order.status)} className="mb-2">
                          {order.status.toUpperCase()}
                        </Badge>
                        <div className="text-lg font-semibold">
                          ${order.total_amount.toFixed(2)} {order.currency}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {order.order_items && order.order_items.length > 0 && (
                    <CardContent>
                      <div className="space-y-3">
                        {order.order_items.map((item, index) => (
                          <div key={item.id}>
                            <div className="flex items-center space-x-4">
                              <img 
                                src={item.product_image} 
                                alt={item.product_title}
                                className="h-12 w-12 rounded-md object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.product_title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                            {index < order.order_items!.length - 1 && <Separator className="mt-3" />}
                          </div>
                        ))}
                      </div>
                      
                      {order.status === 'pending' && (
                        <div className="mt-4 pt-4 border-t">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel Order
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}