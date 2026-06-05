import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { booking_id, phone, email, name, seats, dinner_title, event_date } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const dateFormatted = new Date(event_date).toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })

    // ── 1. Send Email via Resend ───────────────────────────────────────────
    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Vantammayilu <hello@vantammayilu.com>',
          to: [email],
          subject: `[ BOOKING CONFIRMED ] ${dinner_title}`,
          html: `
            <div style="font-family:monospace;background:#efe9e1;padding:48px;max-width:560px;margin:0 auto;border:4px solid #002fa7;">
              <h1 style="font-family:sans-serif;color:#002fa7;font-size:32px;margin:0 0 8px;">SEAT SECURED.</h1>
              <p style="color:#002fa7;font-size:11px;letter-spacing:0.1em;margin:0 0 32px;">[ VANTAMMAYILU // ${dinner_title.toUpperCase()} ]</p>
              <table style="width:100%;border-collapse:collapse;color:#002fa7;">
                <tr><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">GUEST</td><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);font-weight:900;">${name}</td></tr>
                <tr><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">SEATS</td><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);font-weight:900;">${seats} COVER${seats > 1 ? 'S' : ''}</td></tr>
                <tr><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">DATE</td><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);font-weight:900;">${dateFormatted}</td></tr>
                <tr><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">LOCATION</td><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);font-weight:900;">Shared 24hrs before event</td></tr>
                <tr><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);border-bottom:1px solid rgba(0,47,167,0.2);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">BOOKING REF</td><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);border-bottom:1px solid rgba(0,47,167,0.2);font-weight:900;font-size:10px;">${booking_id.slice(0,8).toUpperCase()}</td></tr>
              </table>
              <p style="color:#002fa7;font-size:10px;margin:32px 0 0;opacity:0.6;text-transform:uppercase;letter-spacing:0.05em;">
                Phones off. Conversations on. Doors close at exactly 7:30 PM.<br/>
                You will receive reminders 48hrs and 12hrs before the dinner.
              </p>
            </div>
          `
        }),
      }).catch(err => console.error('Resend error:', err))
    }

    // ── 2. Send WhatsApp via Twilio ────────────────────────────────────────
    // Reuses the same Twilio account already used for OTP SMS — no new service needed.
    // SANDBOX MODE: users must first text "join <sandbox-word>" to whatsapp:+14155238886
    // PRODUCTION:   set TWILIO_WHATSAPP_NUMBER to your approved WhatsApp Business number
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken  = Deno.env.get('TWILIO_AUTH_TOKEN')
    const waFrom     = Deno.env.get('TWILIO_WHATSAPP_NUMBER') || 'whatsapp:+14155238886'

    if (accountSid && authToken) {
      const waBody = [
        `✅ *BOOKING CONFIRMED*`,
        ``,
        `*${dinner_title}*`,
        `Guest: ${name}`,
        `Seats: ${seats} cover${seats > 1 ? 's' : ''}`,
        `Date: ${dateFormatted}`,
        `Ref: ${booking_id.slice(0,8).toUpperCase()}`,
        ``,
        `📍 Location shared 24hrs before.`,
        `Phones off. Conversations on. 🕯️`,
      ].join('\n')

      const waForm = new URLSearchParams()
      waForm.append('To',   `whatsapp:${phone}`)
      waForm.append('From', waFrom)
      waForm.append('Body', waBody)

      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: waForm,
        }
      ).catch(err => console.error('Twilio WhatsApp error:', err))
    }

    // ── 3. Schedule 48hr + 12hr reminders (store in DB for Zapier/cron) ────
    try {
      await supabase.from('reminders').upsert([
        {
          booking_id,
          phone,
          email,
          send_at: new Date(new Date(event_date).getTime() - 48 * 60 * 60 * 1000).toISOString(),
          type: '48hr'
        },
        {
          booking_id,
          phone,
          email,
          send_at: new Date(new Date(event_date).getTime() - 12 * 60 * 60 * 1000).toISOString(),
          type: '12hr'
        }
      ], { onConflict: 'booking_id,type', ignoreDuplicates: true })
    } catch (_err) {
      // Note: reminders table is optional — if it doesn't exist yet the catch suppresses the error
    }

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
