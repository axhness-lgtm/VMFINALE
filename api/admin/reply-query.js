
import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { booking_id, reply_text, password } = req.body;

  // Simple admin auth check
  if (password !== (process.env.ADMIN_PASSWORD || 'Hyndavio@1001')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!booking_id || !reply_text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Get booking details to find user info
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        id,
        customer_query,
        user_id,
        users ( name, email )
      `)
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) throw new Error('Booking not found');

    const customerEmail = booking.users?.email;
    const customerName = booking.users?.name || 'Guest';

    if (!customerEmail) {
      throw new Error('Customer email not found');
    }

    // 2. Send email
    const msg = {
      to: customerEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'hyndavio@vantammayilu.com',
      subject: `Reply to your query regarding your upcoming dinner`,
      trackingSettings: {
        clickTracking: { enable: false, enableText: false },
        openTracking: { enable: false }
      },
      html: `
        <div style="font-family: 'The Seasons', Georgia, serif; max-width: 600px; margin: 0 auto; background-color: #efe8db; padding: 40px 30px; border-radius: 12px; color: #2c2b29; border: 1px solid rgba(44,43,41,0.15); line-height: 1.7;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid rgba(232,99,33,0.3); padding-bottom: 20px;">
            <h1 style="font-family: 'Apricot', Georgia, cursive; color: #e86321; font-size: 34px; margin: 0; letter-spacing: 1px;">Vantammayilu</h1>
            <p style="font-family: 'The Seasons', Georgia, serif; font-style: italic; font-size: 16px; margin-top: 6px; color: #555;">The Supper Social</p>
          </div>
          <h2 style="font-family: 'Apricot', Georgia, cursive; color: #e86321; font-size: 26px; margin-bottom: 16px;">A Note From Your Hosts.</h2>
          <p style="font-size: 16px;">Hi ${customerName},</p>
          <p style="font-size: 16px;">Thank you for sharing your thoughts and dietary inquiry with us:</p>
          <blockquote style="border-left: 3px solid #e86321; padding-left: 14px; font-style: italic; margin: 20px 0; color: #555;">
            "${booking.customer_query}"
          </blockquote>
          <p style="font-size: 16px;"><strong>Here is our reply:</strong></p>
          <div style="background-color: #faf8f5; padding: 20px; border-radius: 8px; margin: 16px 0;">
            <p style="white-space: pre-wrap; margin: 0; font-size: 16px; color: #2c2b29;">${reply_text}</p>
          </div>
          <div style="margin-top: 36px; border-top: 1px solid rgba(44,43,41,0.1); text-align: center; padding-top: 20px;">
            <p style="font-style: italic; font-size: 16px; margin-bottom: 4px; color: #555;">Warmly,</p>
            <p style="font-family: 'Apricot', Georgia, cursive; font-size: 22px; color: #e86321; margin: 0;">Hyndavi & Artee</p>
          </div>
        </div>
      `,
    };

    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(msg);
    } else {
      console.log(`[DEV] Mock reply email sent to ${customerEmail}. Reply: ${reply_text}`);
    }

    // 3. Update database with founder_reply
    await supabase
      .from('bookings')
      .update({ founder_reply: reply_text })
      .eq('id', booking_id);

    const modeTail = !process.env.SENDGRID_API_KEY ? ` (NOTE: SENDGRID_API_KEY missing in Vercel environment variables, so email was logged in mock dev mode)` : `.`;
    return res.status(200).json({ success: true, message: `Reply sent successfully${modeTail}` });
  } catch (error) {
    console.error('Error sending reply:', error);
    const errDetails = error?.response?.body?.errors?.map(e => e.message).join('; ') || error?.message || String(error);
    return res.status(500).json({ error: errDetails || 'Internal Server Error', details: errDetails });
  }
}
