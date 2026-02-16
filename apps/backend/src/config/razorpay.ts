import 'dotenv/config';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

export const RAZORPAY_KEY_ID = keyId || '';
export const RAZORPAY_KEY_SECRET = keySecret || '';

if (keyId && keySecret) {
  console.log('✅ Razorpay configured successfully');
} else {
  console.warn('⚠️  Razorpay credentials not configured. Payment features will be disabled.');
}

export const razorpay = keyId && keySecret 
  ? new Razorpay({ key_id: keyId, key_secret: keySecret })
  : null;

export const RAZORPAY_WEBHOOK_SECRET = webhookSecret || '';

export const isRazorpayConfigured = (): boolean => {
  return !!(keyId && keySecret);
};

export const verifyWebhookSignature = (payload: string, signature: string): boolean => {
  if (!RAZORPAY_WEBHOOK_SECRET) {
    console.error('Razorpay webhook secret not configured');
    return false;
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  if (!RAZORPAY_KEY_SECRET) {
    console.error('Razorpay key secret not configured');
    return false;
  }
  
  const payload = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};
