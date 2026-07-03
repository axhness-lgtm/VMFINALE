import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
const DOMAIN = process.env.VITE_DOMAIN || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://vantammayilu.com');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { occurrence_id, selected_user_ids, password, custom_subject, custom_message, poster_url, menu_url } = req.body;

  // Simple admin auth check
  if (password !== (process.env.ADMIN_PASSWORD || 'Hyndavio@1001')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!occurrence_id || !selected_user_ids || !Array.isArray(selected_user_ids)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // NOTE: We do NOT change occurrence status here — magic links are individual.
    // The occurrence status is managed separately via the admin occurrences tab.

    // 1. Update selected users' interest status to 'selected_by_founder'
    await supabase
      .from('occurrence_interests')
      .update({ status: 'selected_by_founder' })
      .eq('occurrence_id', occurrence_id)
      .in('user_id', selected_user_ids);

    // 3. Fetch user details to send emails
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, phone')
      .in('id', selected_user_ids);

    if (usersError) throw usersError;

    // 4. Fetch occurrence details
    const { data: occurrence } = await supabase
      .from('occurrences')
      .select('title, event_date')
      .eq('id', occurrence_id)
      .single();

    // 5. Send Magic Link Emails
    const emailPromises = users.map(user => {
      // Create JWT token for the magic link
      const token = jwt.sign(
        { user_id: user.id, email: user.email, phone: user.phone, occurrence_id },
        JWT_SECRET,
        { expiresIn: '4h' } // Token expires strictly in 4 hours
      );

      const magicLink = `${DOMAIN}/dinner?token=${token}`;

      const formattedMessage = custom_message
        ? custom_message.replace(/\n/g, '<br/>')
        : `We have thoughtfully curated the guest list for <strong>${occurrence.title}</strong>, and a place at our table has been reserved for you.<br/><br/>Please use your private invitation link below within the next <strong>4 hours</strong> to reserve your seat. Candlelight, conversation, and culinary art await.`;

      const posterHtml = poster_url
        ? `<div style="margin-bottom: 24px;"><img src="${poster_url}" alt="Poster for ${occurrence.title}" style="width: 100%; max-width: 600px; border-radius: 8px; display: block;" /></div>`
        : '';

      const menuHtml = menu_url
        ? `<div style="margin: 32px 0;"><h3 style="font-family: 'Apricot', Georgia, cursive; color: #e86321; font-size: 24px; margin-bottom: 12px;">Curated Menu</h3><img src="${menu_url}" alt="Menu for ${occurrence.title}" style="width: 100%; max-width: 600px; border-radius: 8px; display: block;" /></div>`
        : '';

      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || 'hyndavio@vantammayilu.com',
        subject: custom_subject || `Your Private Invitation: ${occurrence.title}`,
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
            ${posterHtml}
            <h2 style="font-family: 'Apricot', Georgia, cursive; color: #e86321; font-size: 28px; margin-bottom: 16px;">An Invitation to the Table.</h2>
            <p style="font-size: 16px;">Hi ${user.name},</p>
            <p style="font-size: 16px; margin-bottom: 24px;">${formattedMessage}</p>
            ${menuHtml}
            <div style="margin: 32px 0; text-align: center;">
              <a href="${magicLink}" style="background-color: #e86321; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 16px;">Reserve Your Seat Now</a>
            </div>
            <p style="font-size: 14px; color: #b91c1c; font-style: italic;">Note: This private invitation link is active for 4 hours from the time of sending. After 4 hours, expired seats will be offered to the next guest on the waitlist.</p>
            <div style="margin-top: 36px; border-top: 1px solid rgba(44,43,41,0.1); text-align: center; padding-top: 20px;">
              <p style="font-style: italic; font-size: 16px; margin-bottom: 4px; color: #555;">Warmly,</p>
              <p style="font-family: 'Apricot', Georgia, cursive; font-size: 22px; color: #e86321; margin: 0;">Hyndavi & Artee</p>
            </div>
          </div>
        `,
      };

      if (process.env.SENDGRID_API_KEY) {
        return sgMail.send(msg);
      } else {
        console.log(`[DEV] Mock email sent to ${user.email}. Link: ${magicLink}`);
        return Promise.resolve('MOCK');
      }
    });

    const results = await Promise.allSettled(emailPromises);
    const failures = results.filter(r => r.status === 'rejected');
    const isMock = !process.env.SENDGRID_API_KEY;

    if (failures.length > 0) {
      const firstErr = failures[0].reason;
      const sendgridDetails = firstErr?.response?.body?.errors?.map(e => e.message).join('; ') || firstErr?.message || String(firstErr);
      throw new Error(`SendGrid failed to send email: ${sendgridDetails}`);
    }

    const modeTail = isMock ? ` (NOTE: SENDGRID_API_KEY is not set in Vercel, so mock links were logged to console instead of sending live emails.)` : `.`;
    return res.status(200).json({ success: true, message: `Bookings opened and ${users.length} invitation emails processed${modeTail}` });
  } catch (error) {
    console.error('Error opening bookings:', error);
    const errDetails = error?.response?.body?.errors?.map(e => e.message).join('; ') || error?.message || String(error);
    return res.status(500).json({ error: errDetails || 'Internal Server Error', details: errDetails });
  }
}
