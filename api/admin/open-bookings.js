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

    const { data: allSelectedUsers, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, phone, instagram_handle')
      .in('id', selected_user_ids);
    if (usersError) throw usersError;

    const users = allSelectedUsers || [];
    if (users.length === 0) {
      return res.status(400).json({ error: 'No user records found for the selected IDs.' });
    }

    const eligibleUserIds = users.map(u => u.id);

    // 1. Update or insert selected users' interest status to 'selected_by_founder', overriding previous rejection if explicitly chosen by admin
    for (const userId of eligibleUserIds) {
      // If user had [Tag: rejected] in instagram_handle, clean it up since founder explicitly invited them
      const userObj = users.find(u => u.id === userId);
      if (userObj && (userObj.instagram_handle || '').match(/^\[Tag:\s*rejected\]/i)) {
        const cleanHandle = userObj.instagram_handle.replace(/^\[Tag:\s*rejected\]\s*/i, '').trim();
        await supabase.from('users').update({ instagram_handle: cleanHandle }).eq('id', userId);
        userObj.instagram_handle = cleanHandle;
      }

      const { data: existing } = await supabase
        .from('occurrence_interests')
        .select('id, status')
        .eq('occurrence_id', occurrence_id)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('occurrence_interests')
          .update({ status: 'selected_by_founder' })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('occurrence_interests')
          .insert({
            occurrence_id,
            user_id: userId,
            status: 'selected_by_founder'
          });
      }
    }

    // 4. Fetch occurrence details
    let occurrence = { title: 'Curated Dinner', event_date: new Date().toISOString(), dietary_type: 'non_veg' };
    const { data: occData } = await supabase
      .from('occurrences')
      .select('*')
      .eq('id', occurrence_id)
      .maybeSingle();
    if (occData) {
      occurrence = occData;
      if (!occurrence.dietary_type && occurrence.title) {
        if (occurrence.title.match(/^\[VEG\]/i)) occurrence.dietary_type = 'veg';
        else if (occurrence.title.match(/^\[BOTH\]/i)) occurrence.dietary_type = 'both';
        else occurrence.dietary_type = 'non_veg';
      }
    }

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
        : `We have thoughtfully curated the guest list for <strong style="color: #e86321;">${occurrence.title}</strong>, and a place at our table has been reserved for you.<br/><br/>Please use your private invitation link below within the next <strong style="color: #e86321;">4 hours</strong> to reserve your seat. Candlelight, conversation, and culinary art await.`;

      const posterHtml = poster_url
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
             <tr>
               <td align="center">
                 <img src="${poster_url}" alt="Poster for ${occurrence.title}" style="width: 100%; max-width: 580px; height: auto; border-radius: 8px; display: block; margin: 0 auto; border: 0;" />
               </td>
             </tr>
           </table>`
        : '';

      const menuHtml = menu_url
        ? `<div style="margin: 32px 0;">
             <h3 style="font-family: 'Apricot', 'Caveat', cursive, Georgia; color: #e86321; font-size: 26px; margin-bottom: 12px; font-weight: normal; text-align: center;">Curated Menu</h3>
             <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
               <tr>
                 <td align="center">
                   <img src="${menu_url}" alt="Menu for ${occurrence.title}" style="width: 100%; max-width: 580px; height: auto; border-radius: 8px; display: block; margin: 0 auto; border: 0;" />
                 </td>
               </tr>
             </table>
           </div>`
        : '';

      const dietaryInfoHtml = occurrence.dietary_type && occurrence.dietary_type !== 'non_veg'
        ? `<div style="background-color: rgba(232,99,33,0.1); border: 1px solid rgba(232,99,33,0.3); padding: 10px 15px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
             <strong style="color: #e86321; font-family: 'The Seasons', Georgia, serif; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
               Dietary Course: ${occurrence.dietary_type === 'veg' ? '🌱 100% Vegetarian Course' : 'Chef\'s Custom Tasting / Both'}
             </strong>
           </div>`
        : `<div style="background-color: rgba(44,43,41,0.05); border: 1px solid rgba(44,43,41,0.15); padding: 10px 15px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
             <strong style="color: #2c2b29; font-family: 'The Seasons', Georgia, serif; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
               Dietary Course: 🥩 Non-Vegetarian Curated Course
             </strong>
           </div>`;

      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || 'hyndavio@vantammayilu.com',
        subject: custom_subject || `Your Private Invitation: ${occurrence.title}`,
        trackingSettings: {
          clickTracking: { enable: false, enableText: false },
          openTracking: { enable: false }
        },
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
            </style>
          </head>
          <body style="margin:0; padding:0; background-color:#efe8db; font-family: 'The Seasons', 'Playfair Display', Georgia, serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #efe8db; padding: 40px 30px; border-radius: 12px; color: #2c2b29; border: 1px solid rgba(44,43,41,0.15); line-height: 1.7;">
              <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid rgba(232,99,33,0.3); padding-bottom: 20px;">
                <h1 style="font-family: 'Apricot', 'Caveat', cursive, Georgia; color: #e86321; font-size: 38px; margin: 0; letter-spacing: 1px; font-weight: normal;">Vantammayilu</h1>
                <p style="font-family: 'Hibernate', 'The Seasons', Georgia, serif; font-style: italic; font-size: 16px; margin-top: 6px; color: #555; letter-spacing: 2px; text-transform: uppercase;">The Supper Social</p>
              </div>
              ${posterHtml}
              ${dietaryInfoHtml}
              <h2 style="font-family: 'Apricot', 'Caveat', cursive, Georgia; color: #e86321; font-size: 30px; margin-bottom: 16px; font-weight: normal;">An Invitation to the Table.</h2>
              <p style="font-size: 16px; font-family: 'Hibernate', 'The Seasons', Georgia, serif;">Hi ${user.name},</p>
              <p style="font-size: 16px; margin-bottom: 24px; font-family: 'Hibernate', 'The Seasons', Georgia, serif;">${formattedMessage}</p>
              ${menuHtml}
              <div style="margin: 32px 0; text-align: center;">
                <a href="${magicLink}" style="background-color: #e86321; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 16px; font-family: 'Hibernate', sans-serif; letter-spacing: 1px; text-transform: uppercase;">Reserve Your Seat Now</a>
              </div>
              <p style="font-size: 14px; color: #b91c1c; font-style: italic; text-align: center; font-family: 'Hibernate', 'The Seasons', Georgia, serif;">Note: This private invitation link is active for 4 hours from the time of sending. After 4 hours, expired seats will be offered to the next guest on the waitlist.</p>
              <div style="margin-top: 36px; border-top: 1px solid rgba(44,43,41,0.1); text-align: center; padding-top: 20px;">
                <p style="font-style: italic; font-size: 16px; margin-bottom: 4px; color: #555; font-family: 'The Seasons', Georgia, serif;">Warmly,</p>
                <p style="font-family: 'Apricot', 'Caveat', cursive, Georgia; font-size: 26px; color: #e86321; margin: 0;">Hyndavi & Artee</p>
              </div>
            </div>
          </body>
          </html>
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
