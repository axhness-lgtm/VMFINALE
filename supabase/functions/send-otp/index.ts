import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, email } = await req.json()

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // 2. Setup Supabase Client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Store OTP in DB (verify-otp reads from here — this is real)
    const { error: dbError } = await supabase
      .from('otps')
      .upsert({ 
        phone, 
        code: otp, 
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      }, { onConflict: 'phone' })

    if (dbError) throw dbError

    // 4. OTP SMS via Twilio is temporarily simulated (trial account restriction).
    //    Return the code directly so the frontend auto-fills it.
    //    When Twilio is upgraded to a paid account, replace this block with real SMS.
    console.log(`[SIMULATED] OTP for ${phone}: ${otp}`)
    return new Response(JSON.stringify({ success: true, devMode: true, code: otp }), {
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

