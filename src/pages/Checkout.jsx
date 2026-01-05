import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { logActivity } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (user) {
      await logActivity(user.id, 'place_order', 'order', 'ord_mock_123', { total_amount_cents: 189700 });
    }

    setLoading(false);
    toast.success("Order placed successfully!");
    navigate('/account/orders'); // Redirect to orders
  };

  return (
    <div className="container px-4 md:px-6 py-12 max-w-4xl">
      <div className="mb-8">
        <Link to="/cart" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Step 1: Shipping Address */}
          <Card className={step === 1 ? 'border-primary ring-1 ring-primary' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>1</div>
                Shipping Address
              </CardTitle>
            </CardHeader>
            {step === 1 && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="400001" />
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => setStep(2)}>Continue to Payment</Button>
              </CardContent>
            )}
            {step > 1 && (
              <CardContent>
                <p className="text-muted-foreground">123 Main St, Mumbai, 400001</p>
                <Button variant="link" className="p-0 h-auto" onClick={() => setStep(1)}>Edit</Button>
              </CardContent>
            )}
          </Card>

          {/* Step 2: Payment */}
          <Card className={step === 2 ? 'border-primary ring-1 ring-primary' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>2</div>
                Payment Method
              </CardTitle>
            </CardHeader>
            {step === 2 && (
              <CardContent className="space-y-4">
                <RadioGroup defaultValue="card">
                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Truck className="h-5 w-5" />
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>
                
                <div className="space-y-2 pt-4">
                  <Label>Card Details (Mock)</Label>
                  <Input placeholder="0000 0000 0000 0000" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" />
                    <Input placeholder="CVC" />
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-1" onClick={() => setStep(3)}>Review Order</Button>
                </div>
              </CardContent>
            )}
            {step > 2 && (
              <CardContent>
                <p className="text-muted-foreground">Credit/Debit Card ending in 0000</p>
                <Button variant="link" className="p-0 h-auto" onClick={() => setStep(2)}>Edit</Button>
              </CardContent>
            )}
          </Card>

          {/* Step 3: Review */}
          <Card className={step === 3 ? 'border-primary ring-1 ring-primary' : ''}>
             <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>3</div>
                Review & Place Order
              </CardTitle>
            </CardHeader>
            {step === 3 && (
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between font-medium">
                    <span>Premium Chicken & Rice Dog Food x 1</span>
                    <span>₹1299</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Durable Rope Toy x 2</span>
                    <span>₹598</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Order Total</span>
                  <span>₹1897</span>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="md:col-span-1">
          <Card className="sticky top-24 bg-muted/50">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹1897</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹1897</span>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              By placing an order, you agree to our Terms of Service and Privacy Policy.
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
