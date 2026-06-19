import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { dinner_id } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch the dinner details
    const { data: dinner, error: dinnerErr } = await supabase
      .from('dinners')
      .select('*')
      .eq('id', dinner_id)
      .single()

    if (dinnerErr || !dinner) throw new Error('Active dinner not found')

    // Fetch waitlist members
    const { data: waitlist } = await supabase
      .from('waitlist')
      .select('email, phone, name')
      .eq('dinner_id', dinner_id)

    // Fetch past unique guests from bookings table
    const { data: bookings } = await supabase
      .from('bookings')
      .select('email, phone')
      .eq('status', 'confirmed')

    // Combine and deduplicate contacts (using Set/Map)
    const contactsMap = new Map()
    
    // Add bookings (defaulting name to Guest)
    bookings?.forEach(b => {
      contactsMap.set(b.email.toLowerCase(), { email: b.email.toLowerCase(), phone: b.phone, name: 'Guest' })
    })

    // Add waitlist (overriding if name is present)
    waitlist?.forEach(w => {
      contactsMap.set(w.email.toLowerCase(), { email: w.email.toLowerCase(), phone: w.phone, name: w.name || 'Guest' })
    })

    const recipients = Array.from(contactsMap.values())

    const dateFormatted = new Date(dinner.event_date).toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })

    const trialPageUrl = `${Deno.env.get('PUBLIC_FRONTEND_URL') || 'http://localhost:5173'}/dinner-trial`

    let emailCount = 0
    let whatsappCount = 0
    let instagramMockCount = 0

    // Send emails via Resend API
    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (resendKey && recipients.length > 0) {
      for (const recipient of recipients) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Vantammayilu <hello@vantammayilu.com>',
              to: [recipient.email],
              subject: `[ EXCLUSIVE INVITATION ] ${dinner.title}`,
              html: `
                <div style="font-family:monospace;background:#efe9e1;padding:48px;max-width:560px;margin:0 auto;border:4px solid #002fa7;">
                  <h1 style="font-family:sans-serif;color:#002fa7;font-size:28px;margin:0 0 8px;text-transform:uppercase;">You're Invited.</h1>
                  <p style="color:#e86321;font-weight:bold;font-size:12px;letter-spacing:0.15em;margin:0 0 32px;">[ CHAPTER 04 // POSTCARDS FROM OAXACA ]</p>
                  
                  <p style="color:#002fa7;font-size:13px;line-height:1.6;margin:0 0 24px;">
                    Hello ${recipient.name},<br/><br/>
                    Seats are opening at the Chabudai table for our next volume. We invite you to secure your seat.
                  </p>

                  <table style="width:100%;border-collapse:collapse;color:#002fa7;margin-bottom:32px;">
                    <tr><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">EVENT</td><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);font-weight:900;">${dinner.title}</td></tr>
                    <tr><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">DATE & TIME</td><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);font-weight:900;">${dateFormatted}</td></tr>
                    <tr><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);border-bottom:1px solid rgba(0,47,167,0.2);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">PRICE</td><td style="padding:12px 0;border-top:1px solid rgba(0,47,167,0.2);border-bottom:1px solid rgba(0,47,167,0.2);font-weight:900;color:#e86321;">₹2,999 / seat</td></tr>
                  </table>

                  <div style="text-align:center;margin-bottom:32px;">
                    <a href="${trialPageUrl}" style="background:#e86321;color:#efe9e1;padding:16px 24px;text-decoration:none;font-weight:bold;font-size:12px;letter-spacing:0.1em;border:2px solid #002fa7;display:inline-block;">[ SECURE SEATS ON BLUEPRINT MAP ]</a>
                  </div>

                  <p style="color:#002fa7;font-size:10px;opacity:0.6;text-transform:uppercase;letter-spacing:0.05em;">
                    Phones off. Conversations on. Doors close at 7:30 PM.<br/>
                    Do not share this link. Allocations are strictly limited.
                  </p>
                </div>
              `
            }),
          })
          emailCount++
        } catch (e) {
          console.error(`Failed to send email to ${recipient.email}:`, e)
        }
      }
    }

    // Send WhatsApp messages via Twilio API
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken  = Deno.env.get('TWILIO_AUTH_TOKEN')
    const waFrom     = Deno.env.get('TWILIO_WHATSAPP_NUMBER') || 'whatsapp:+14155238886'

    if (accountSid && authToken && recipients.length > 0) {
      for (const recipient of recipients) {
        if (!recipient.phone) continue;
        try {
          const waBody = [
            `🕯️ *EXCLUSIVE INVITATION: VANTAMMAYILU*`,
            ``,
            `Hi ${recipient.name}, seats are opening for *${dinner.title}*.`,
            `📅 Date: ${dateFormatted}`,
            `🎟️ Price: ₹2,999 / cover`,
            ``,
            `Secure your cover here:`,
            `👉 ${trialPageUrl}`,
            ``,
            `*Phones off. Conversations on.* 🕯️`
          ].join('\n')

          const waForm = new URLSearchParams()
          waForm.append('To',   `whatsapp:${recipient.phone}`)
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
          )
          whatsappCount++
        } catch (e) {
          console.error(`Failed to send WhatsApp to ${recipient.phone}:`, e)
        }
      }
    }

    // Simulate Instagram Broadcast
    if (recipients.length > 0) {
      console.log(`[INSTAGRAM BROADCAST] Simulated community post / direct message link dispatch:`);
      recipients.forEach(r => {
        console.log(`- Dispatched to @community_member_${r.name.replace(/\s+/g, '_').toLowerCase()}`);
        instagramMockCount++;
      });
    }

    return new Response(JSON.stringify({
      success: true,
      recipients_count: recipients.length,
      emails_sent: emailCount,
      whatsapp_sent: whatsappCount,
      instagram_mock_sent: instagramMockCount
    }), {
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
