import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, phone, email, seats, dinner_id } = await req.json()

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    const keyId     = Deno.env.get('RAZORPAY_KEY_ID')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let activeDinnerId = dinner_id
    if (!activeDinnerId) {
      const { data: activeDinner } = await supabase
        .from('dinners')
        .select('id')
        .eq('is_active', true)
        .single();
      activeDinnerId = activeDinner?.id
    }

    let dinnerTitle = 'Vantammayilu Dinner';
    let eventDate = null;

    // FALLBACK MOCK MODE FOR DEV
    if (!keyId || !keySecret || razorpay_order_id.startsWith('MOCK_') || razorpay_order_id.startsWith('DEV_')) {
      console.warn('Razorpay environment variables are missing or mock order requested. Simulating database write for order:', razorpay_order_id);
      
      const { data: dinner } = await supabase
        .from('dinners')
        .select('title, event_date')
        .eq('id', activeDinnerId)
        .single();
      if (dinner) {
        dinnerTitle = dinner.title;
        eventDate = dinner.event_date;
      }
    } else {
      // 1. Verify HMAC signature
      const text = razorpay_order_id + "|" + razorpay_payment_id
      const encoder = new TextEncoder()
      const key = await crypto.subtle.importKey(
        "raw", encoder.encode(keySecret),
        { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
      )
      const sigBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(text))
      const generated = Array.from(new Uint8Array(sigBuf))
        .map(b => b.toString(16).padStart(2, "0")).join("")

      if (generated !== razorpay_signature) {
        throw new Error('Invalid payment signature')
      }

      // 2. Fetch Razorpay order for metadata
      const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
        headers: { 'Authorization': `Basic ${btoa(`${keyId}:${keySecret}`)}` }
      })
      const orderData = await orderRes.json()
      if (orderRes.ok && orderData.notes) {
        dinnerTitle = orderData.notes.dinner_title || dinnerTitle;
        eventDate = orderData.notes.event_date || null;
      }
    }

    // 3. Check if it's a repeat guest
    const { data: pastBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('phone', phone)
      .eq('status', 'confirmed')

    const is_repeat = (pastBookings?.length ?? 0) > 0

    // 4. Write booking
    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .insert({
        phone, email,
        dinner_id: activeDinnerId || null,
        seats: parseInt(seats),
        dinner_title: dinnerTitle,
        status: 'confirmed',
        razorpay_order_id,
        razorpay_payment_id,
        is_repeat_guest: is_repeat
      })
      .select()
      .single()

    if (dbError) throw dbError

    // 5. Increment confirmed_seats on dinner
    if (activeDinnerId) {
      try {
        await supabase.rpc('increment_confirmed_seats', {
          p_dinner_id: activeDinnerId,
          p_seats: parseInt(seats)
        })
      } catch (_e) {
        console.error('Failed to increment confirmed seats');
      }
    }

    // 6. Release seat lock
    await supabase.from('seat_locks').delete().eq('phone', phone)

    // 7. Trigger confirmation email + WhatsApp (fire-and-forget)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    fetch(`${supabaseUrl}/functions/v1/send-confirmation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        booking_id: booking.id,
        phone, email, name: email,
        seats: parseInt(seats),
        dinner_title: dinnerTitle,
        event_date: eventDate
      })
    }).catch(() => {})

    return new Response(JSON.stringify({ success: true, booking_id: booking.id }), {
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
