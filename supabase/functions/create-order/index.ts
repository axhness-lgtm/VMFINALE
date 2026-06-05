import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, phone, email, seats, dinner_title } = await req.json()

    const keyId = Deno.env.get('RAZORPAY_KEY_ID')
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    // FALLBACK MOCK MODE FOR DEV
    if (!keyId || !keySecret) {
      console.warn('Razorpay environment variables are missing. Using mock order simulator.');
      const mockOrder = {
        id: `MOCK_RZP_ORDER_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR',
        notes: { phone, email, seats, dinner_title }
      };
      return new Response(JSON.stringify(mockOrder), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Create Order via Razorpay API
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay takes amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: { phone, email, seats, dinner_title }
      }),
    })

    const order = await response.json()
    if (!response.ok) throw new Error(order.error?.description || 'Failed to create order')

    return new Response(JSON.stringify(order), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
