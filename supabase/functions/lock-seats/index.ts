import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { phone, email, seats, dinner_id } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Check lockout
    const { data: lockout } = await supabase
      .from('lockouts')
      .select('blocked_until')
      .eq('phone', phone)
      .single()

    if (lockout && new Date(lockout.blocked_until) > new Date()) {
      const remaining = Math.ceil((new Date(lockout.blocked_until).getTime() - Date.now()) / 60000)
      throw new Error(`LOCKED_OUT:${remaining}`)
    }

    // 2. Check available seats (accounting for active locks)
    let activeDinnerId = dinner_id
    if (!activeDinnerId) {
      const { data: activeDinner } = await supabase
        .from('dinners')
        .select('id')
        .eq('is_active', true)
        .single();
      activeDinnerId = activeDinner?.id;
    }

    if (!activeDinnerId) throw new Error('Dinner not found')

    const { data: dinner } = await supabase
      .from('dinners')
      .select('total_seats, confirmed_seats')
      .eq('id', activeDinnerId)
      .single()

    if (!dinner) throw new Error('Dinner not found')

    const { data: activeLocks } = await supabase
      .from('seat_locks')
      .select('seats')
      .eq('dinner_id', activeDinnerId)
      .gt('locked_until', new Date().toISOString())

    const lockedSeats = activeLocks?.reduce((sum, l) => sum + l.seats, 0) ?? 0
    const available = dinner.total_seats - dinner.confirmed_seats - lockedSeats

    if (seats > available) {
      throw new Error('NOT_ENOUGH_SEATS')
    }

    // 3. Release any existing lock for this phone (re-booking attempt)
    await supabase.from('seat_locks').delete().eq('phone', phone)

    // 4. Create new 5-minute lock
    const locked_until = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    const { error: lockError } = await supabase
      .from('seat_locks')
      .insert({ phone, email, dinner_id: activeDinnerId, seats, locked_until })

    if (lockError) throw lockError

    return new Response(JSON.stringify({ success: true, locked_until }), {
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
