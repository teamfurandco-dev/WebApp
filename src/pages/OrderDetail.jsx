import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { format } from 'date-fns';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-12 text-center">Loading Order Details...</div>;
  if (!order) return <div className="p-12 text-center">Order not found</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/account/orders">
           <Button variant="ghost" size="icon" className="rounded-full">
             <ArrowLeft className="w-5 h-5" />
           </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-serif font-bold">Order #{order.id}</h2>
          <p className="text-muted-foreground">
             Placed on {format(new Date(order.created_at), 'PPP')}
          </p>
        </div>
      </div>

      {/* Tracking Timeline */}
      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardHeader className="bg-stone-50 border-b border-stone-100">
           <CardTitle className="flex items-center gap-2">
             <Truck className="w-5 h-5 text-furco-yellow" />
             Shipment Tracking
           </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="relative">
             {/* Progress Bar Background */}
             <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100 md:w-full md:h-0.5 md:left-0 md:top-4 md:bottom-auto" />
             
             <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
               {order.events.map((event, index) => {
                 const Icon = event.completed ? CheckCircle : Clock;
                 return (
                   <div key={index} className="flex md:flex-col items-start md:items-center gap-4 md:gap-2 bg-white md:bg-transparent p-2 md:p-0 rounded-lg">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2",
                        event.completed 
                          ? "bg-green-100 border-green-500 text-green-600" 
                          : "bg-gray-50 border-gray-200 text-gray-300"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="md:text-center">
                        <p className={cn("font-bold text-sm", event.completed ? "text-black" : "text-muted-foreground")}>{event.status}</p>
                        <p className="text-xs text-muted-foreground">{event.date ? format(new Date(event.date), 'MMM d, h:mm a') : 'Pending'}</p>
                        <p className="text-xs text-gray-400 mt-1 max-w-[150px]">{event.description}</p>
                      </div>
                   </div>
                 );
               })}
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items Ordered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-6">
                <div className="h-24 w-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">Qty: {item.quantity}</p>
                  <p className="font-bold text-furco-yellow">{formatPrice(item.price_cents_at_purchase)}</p>
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.total_amount_cents)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-xl mt-4">
              <span>Total</span>
              <span>{formatPrice(order.total_amount_cents)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
