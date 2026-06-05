import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { dinner_id, email, phone, name } = await req.json()

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

    const { error } = await supabase
      .from('waitlist')
      .insert({ dinner_id: activeDinnerId || null, email, phone: phone || null, name: name || null })

    // Ignore unique constraint violation (user already on waitlist)
    if (error && !error.message.includes('unique')) throw error

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
