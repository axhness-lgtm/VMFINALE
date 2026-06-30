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
const DOMAIN = process.env.VITE_DOMAIN || 'http://localhost:5173'; // Update with Vercel domain later

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
        { expiresIn: '24h' } // Token expires in 24 hours
      );

      const magicLink = `${DOMAIN}/dinner?token=${token}`;

      const formattedMessage = custom_message
        ? custom_message.replace(/\n/g, '<br/>')
        : `We've curated the list for <strong>${occurrence.title}</strong>, and we'd love for you to join us.<br/><br/>Please use the private link below to secure your seat. Bookings are on a first-come, first-served basis for the selected active list.`;

      const posterHtml = poster_url
        ? `<div style="margin-bottom: 24px;"><img src="${poster_url}" alt="Poster for ${occurrence.title}" style="width: 100%; max-width: 600px; border-radius: 8px; display: block;" /></div>`
        : '';

      const menuHtml = menu_url
        ? `<div style="margin: 32px 0;"><h3 style="color: #e86321; font-size: 18px; margin-bottom: 12px;">Curated Menu</h3><img src="${menu_url}" alt="Menu for ${occurrence.title}" style="width: 100%; max-width: 600px; border-radius: 8px; display: block;" /></div>`
        : '';

      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || 'hyndavio@vantammayilu.com',
        subject: custom_subject || `You're invited: ${occurrence.title}`,
        trackingSettings: {
          clickTracking: { enable: false, enableText: false },
          openTracking: { enable: false }
        },
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
            ${posterHtml}
            <h2 style="color: #e86321; font-size: 24px; margin-bottom: 16px;">You're invited to the table.</h2>
            <p>Hi ${user.name},</p>
            <p style="margin-bottom: 24px;">${formattedMessage}</p>
            ${menuHtml}
            <div style="margin: 32px 0;">
              <a href="${magicLink}" style="background-color: #e86321; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 16px;">Secure Your Seat</a>
            </div>
            <p style="font-size: 14px; color: #666;">If you don't book within the availability, your seat may be passed to the next person on the list.</p>
            <p style="margin-top: 32px;">Warmly,<br/><strong>Vantammayilu</strong></p>
          </div>
        `,
      };

      if (process.env.SENDGRID_API_KEY) {
        return sgMail.send(msg);
      } else {
        console.log(`[DEV] Mock email sent to ${user.email}. Link: ${magicLink}`);
        return Promise.resolve();
      }
    });

    await Promise.all(emailPromises);

    return res.status(200).json({ success: true, message: `Bookings opened and ${users.length} emails sent.` });
  } catch (error) {
    console.error('Error opening bookings:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
