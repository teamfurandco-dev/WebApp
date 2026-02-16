import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useRazorpayCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkout = async ({
    amount,
    userEmail,
    userPhone,
    shippingAddressId,
    customerNotes,
    onSuccess,
    onFailure,
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error('Please login to complete the purchase');
      }
      
      const configRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/config`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const configData = await configRes.json();

      if (!configData.success || !configData.data.razorpayConfigured) {
        throw new Error('Razorpay is not configured');
      }

      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      
      const orderData = await orderRes.json();
      
      if (!orderData.success) {
        throw new Error(orderData.error?.message || 'Failed to create order');
      }

      const { razorpayOrderId, keyId } = orderData.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: 'INR',
        name: 'Fur & Co',
        description: 'Pet Products Payment',
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                shippingAddressId: shippingAddressId,
                customerNotes: customerNotes || undefined
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              onSuccess?.(verifyData.data);
            } else {
              onFailure?.(verifyData.error?.message || 'Payment verification failed');
            }
          } catch (err) {
            onFailure?.(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          email: userEmail,
          contact: userPhone
        },
        theme: {
          color: '#528FF0'
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', (response) => {
          onFailure?.(response.error.description || 'Payment failed');
        });

        rzp.open();
      } else {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', (response) => {
            onFailure?.(response.error.description || 'Payment failed');
          });
          rzp.open();
        };
        document.body.appendChild(script);
      }
    } catch (err) {
      setError(err.message);
      onFailure?.(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { checkout, isLoading, error };
};

export default useRazorpayCheckout;
