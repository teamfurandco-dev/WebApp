import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@fur-co/utils';

const OrderSuccess = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-furco-cream flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 3c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-16 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z' fill='%23000'/%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }}
      />

      <div className="text-center space-y-6 max-w-md relative z-10">
        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-peace-sans font-medium text-black">Order Placed!</h1>
          <p className="text-black/50">
            Thank you for your order. We've sent a confirmation to your email.
          </p>
        </div>

        {order && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5 text-left space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-black/5">
              <div className="w-10 h-10 bg-furco-yellow rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="font-medium text-black">Order #{order.orderNumber}</p>
                <p className="text-sm text-black/40">Total: {formatPrice(order.total)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-black/60">Shipping to:</p>
              <div className="text-sm text-black">
                <p className="font-medium">{order.shippingAddress?.fullName}</p>
                <p className="text-black/60">{order.shippingAddress?.addressLine1}</p>
                <p className="text-black/60">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link to="/products" className="flex-1">
            <Button className="w-full h-12 bg-black text-white hover:bg-furco-yellow hover:text-black rounded-xl">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/account/orders" className="flex-1">
            <Button variant="outline" className="w-full h-12 rounded-xl">
              View Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
