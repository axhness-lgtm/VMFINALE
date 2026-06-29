import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const DOMAIN = process.env.VITE_DOMAIN || 'http://localhost:5173';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { occurrence_id, custom_subject, custom_message, poster_url, password } = req.body;

  if (password !== (process.env.ADMIN_PASSWORD || 'Hyndavio@1001')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!occurrence_id) {
    return res.status(400).json({ error: 'Occurrence ID is required.' });
  }

  try {
    // Fetch occurrence details
    const { data: occ } = await supabase.from('occurrences').select('*').eq('id', occurrence_id).single();
    if (!occ) throw new Error('Occurrence not found');

    // Fetch all users in community waitlist
    const { data: users, error: usersError } = await supabase.from('users').select('email, name');
    if (usersError) throw usersError;

    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'No community members found to send email.' });
    }

    const formattedMessage = custom_message
      ? custom_message.replace(/\n/g, '<br/>')
      : `We are thrilled to announce our upcoming gathering: <strong>${occ.title}</strong>.<br/><br/>As a member of our cherished community waitlist, you are receiving this announcement first. Visit our website below to click "I'm Interested" to join the active list for this dinner!`;

    const posterHtml = poster_url
      ? `<div style="margin-bottom: 24px;"><img src="${poster_url}" alt="${occ.title}" style="width: 100%; max-width: 600px; border-radius: 8px; display: block;" /></div>`
      : '';

    const interestLink = `${DOMAIN}/dinner`;

    const msgs = users.map(user => ({
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'founder@vantammayilu.com',
      subject: custom_subject || `Announcing: ${occ.title}`,
      trackingSettings: {
        clickTracking: { enable: false, enableText: false },
        openTracking: { enable: false }
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
          ${posterHtml}
          <h2 style="color: #e86321; font-size: 24px; margin-bottom: 16px;">An Invitation to the Table.</h2>
          <p>Hi ${user.name},</p>
          <p style="margin-bottom: 24px;">${formattedMessage}</p>
          <div style="margin: 32px 0;">
            <a href="${interestLink}" style="background-color: #e86321; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 16px;">Express Interest Now</a>
          </div>
          <p style="font-size: 14px; color: #666;">Seats are limited. Only guests who click "I'm Interested" will be curated for the active invite list.</p>
          <p style="margin-top: 32px;">Warmly,<br/><strong>Vantammayilu</strong></p>
        </div>
      `
    }));

    if (process.env.SENDGRID_API_KEY) {
      // Send in batches of 100 to avoid SendGrid batch limits
      for (let i = 0; i < msgs.length; i += 100) {
        await sgMail.send(msgs.slice(i, i + 100));
      }
    } else {
      console.log(`[DEV] Simulated Community Blast sent to ${msgs.length} recipients.`);
    }

    return res.status(200).json({ success: true, message: `Announcement broadcast sent to ${msgs.length} community members.` });
  } catch (error) {
    console.error('Error sending community blast:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
