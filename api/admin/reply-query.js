import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
      from: process.env.SENDGRID_FROM_EMAIL || 'founder@vantammayilu.com',
      subject: `Reply to your query regarding your upcoming dinner`,
      trackingSettings: {
        clickTracking: { enable: false, enableText: false },
        openTracking: { enable: false }
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hi ${customerName},</p>
          <p>Thank you for reaching out with your question:</p>
          <blockquote style="border-left: 3px solid #ccc; padding-left: 10px; font-style: italic;">
            ${booking.customer_query}
          </blockquote>
          <p><strong>Here is the reply from the founder:</strong></p>
          <p style="white-space: pre-wrap;">${reply_text}</p>
          <p>Warmly,<br/>Vantammayilu Founder</p>
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

    return res.status(200).json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    console.error('Error sending reply:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
