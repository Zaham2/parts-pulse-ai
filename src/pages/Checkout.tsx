import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export default function Checkout() {
  const { state: cartState, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [billingData, setBillingData] = useState({
    first_name: '',
    last_name: '',
    email: user?.email || '',
    phone_number: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingData({
      ...billingData,
      [e.target.name]: e.target.value,
    });
  };

  const processPayment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue with checkout.",
        variant: "destructive",
      });
      return;
    }

    if (cartState.items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const orderItems = cartState.items.map(item => ({
        name: item.title,
        amount_cents: item.price * 100,
        description: `${item.category} - ${item.title}`,
        quantity: item.quantity,
      }));

      const paymentRequest = {
        amount: cartState.total,
        currency: 'EGP',
        order_id: `order_${Date.now()}_${user.id}`,
        billing_data: billingData,
        items: orderItems,
      };

      const { data, error } = await supabase.functions.invoke('paymob-payment', {
        body: paymentRequest,
      });

      if (error) {
        throw error;
      }

      // Open Paymob iframe for payment
      const paymentWindow = window.open(
        data.iframe_url,
        'PaymobPayment',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for payment completion
      const checkPaymentStatus = setInterval(() => {
        if (paymentWindow?.closed) {
          clearInterval(checkPaymentStatus);
          // In a real implementation, you'd verify payment status with Paymob webhooks
          toast({
            title: "Payment initiated",
            description: "Please complete your payment in the popup window.",
          });
          // For demo purposes, we'll clear the cart
          // In production, only clear after successful payment verification
          clearCart();
        }
      }, 1000);

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                Please log in to continue with checkout.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Enter your billing details for payment processing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={billingData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={billingData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={billingData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={billingData.phone_number}
                  onChange={handleInputChange}
                  placeholder="+20xxxxxxxxxx"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-sm">Cards</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Smartphone className="h-5 w-5" />
                    <span className="text-sm">Apple Pay</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Globe className="h-5 w-5" />
                    <span className="text-sm">Google Pay</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Review your items before checkout.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${cartState.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${cartState.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={processPayment}
                  disabled={loading || cartState.items.length === 0 || !billingData.first_name || !billingData.last_name || !billingData.phone_number}
                >
                  {loading ? 'Processing...' : `Pay $${cartState.total.toFixed(2)}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}