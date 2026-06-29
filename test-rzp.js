import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

async function testOrder() {
  console.log('Testing Razorpay order creation with Key ID:', process.env.VITE_RAZORPAY_KEY_ID);
  try {
    const order = await razorpay.orders.create({
      amount: 100, // ₹1
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    });
    console.log('✅ Razorpay Order Created Successfully:', order);
  } catch (err) {
    console.error('❌ Razorpay Error:', err);
  }
}

testOrder();
