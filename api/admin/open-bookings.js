import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
const DOMAIN = process.env.VITE_DOMAIN || 'http://localhost:5173'; // Update with Vercel domain later

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { occurrence_id, selected_user_ids, password } = req.body;

  // Simple admin auth check
  if (password !== (process.env.ADMIN_PASSWORD || 'founder123')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!occurrence_id || !selected_user_ids || !Array.isArray(selected_user_ids)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Update occurrence status to bookings_open
    await supabase
      .from('occurrences')
      .update({ status: 'bookings_open' })
      .eq('id', occurrence_id);

    // 2. Update selected users' interest status
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

      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || 'founder@vantammayilu.com', // Replace with verified sender
        subject: `You're invited: ${occurrence.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>You're invited to the table.</h2>
            <p>Hi ${user.name},</p>
            <p>We've curated the list for <strong>${occurrence.title}</strong>, and we'd love for you to join us.</p>
            <p>Please use the private link below to secure your seat. Bookings are on a first-come, first-served basis for the selected active list.</p>
            <div style="margin: 30px 0;">
              <a href="${magicLink}" style="background-color: #e86321; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px;">Secure Your Seat</a>
            </div>
            <p>If you don't book within the availability, your seat may be passed to the next person on the list.</p>
            <p>Warmly,<br/>Vantammayilu</p>
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
