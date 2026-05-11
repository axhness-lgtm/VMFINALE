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

    // 3. Store OTP in a 'otps' table (we'll create this in a moment)
    const { error: dbError } = await supabase
      .from('otps')
      .upsert({ 
        phone, 
        code: otp, 
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min expiry
      }, { onConflict: 'phone' })

    if (dbError) throw dbError

    // 4. Send SMS via Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

    const formData = new URLSearchParams()
    formData.append('To', phone)
    formData.append('From', twilioNumber!)
    formData.append('Body', `Your Vantammayilu verification code is: ${otp}. Valid for 10 minutes.`)

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      }
    )

    const twilioData = await response.json()
    if (!response.ok) throw new Error(twilioData.message)

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
