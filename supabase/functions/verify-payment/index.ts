import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json()

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    
    // 1. Verify Signature (Manual verification since no official SDK in Deno yet)
    const text = razorpay_order_id + "|" + razorpay_payment_id
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(keySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    )
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(text))
    const signatureArray = Array.from(new Uint8Array(signatureBuffer))
    const generated_signature = signatureArray.map(b => b.toString(16).padStart(2, "0")).join("")

    if (generated_signature !== razorpay_signature) {
      throw new Error('Invalid payment signature')
    }

    // 2. Fetch Order Details from Razorpay to get metadata
    const keyId = Deno.env.get('RAZORPAY_KEY_ID')
    const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
      headers: { 'Authorization': `Basic ${btoa(`${keyId}:${keySecret}`)}` }
    })
    const orderData = await orderRes.json()

    // 3. Update Supabase Bookings
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: dbError } = await supabase
      .from('bookings')
      .insert({
        phone: orderData.notes.phone,
        email: orderData.notes.email,
        seats: parseInt(orderData.notes.seats),
        dinner_title: orderData.notes.dinner_title,
        status: 'confirmed',
        razorpay_order_id,
        razorpay_payment_id
      })

    if (dbError) throw dbError

    return new Response(JSON.stringify({ success: true }), {
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
