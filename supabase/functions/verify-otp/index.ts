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
    const { phone, code } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Fetch the code from DB
    const { data, error } = await supabase
      .from('otps')
      .select('*')
      .eq('phone', phone)
      .single()

    if (error || !data) throw new Error('Verification code not found. Please request a new one.')

    // 2. Check expiry
    if (new Date(data.expires_at) < new Date()) {
      throw new Error('Code expired. Please request a new one.')
    }

    // 3. Match code
    if (data.code !== code) {
      throw new Error('Invalid verification code.')
    }

    // 4. Cleanup (optional: delete code after use)
    await supabase.from('otps').delete().eq('phone', phone)

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
