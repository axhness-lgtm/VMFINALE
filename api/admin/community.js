import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const DOMAIN = process.env.VITE_DOMAIN || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://vantammayilu.com');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return res.status(200).json({ success: true, count: count || 0 });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }

  if (req.method === 'POST') {
    const { action, password, users, occurrence_id, custom_subject, custom_message, poster_url } = req.body;

    if (password !== (process.env.ADMIN_PASSWORD || 'Hyndavio@1001')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (action === 'list') {
      try {
        const { data: allUsers, error } = await supabase.from('users').select('*').order('created_at', { ascending: false }).limit(2000);
        if (error) throw error;

        const { data: bookings } = await supabase.from('bookings').select('user_id').eq('status', 'confirmed');
        const { data: interests } = await supabase.from('occurrence_interests').select('user_id, status');

        const attendedSet = new Set((bookings || []).map(b => b.user_id));
        const rejectedSet = new Set((interests || []).filter(i => i.status === 'rejected').map(i => i.user_id));
        const activeSet = new Set((interests || []).map(i => i.user_id));

        const enrichedUsers = (allUsers || []).map(u => {
          let computedTag = 'general';
          const isRejectedTag = (u.instagram_handle || '').match(/^\[Tag:\s*rejected\]/i);
          if (rejectedSet.has(u.id) || isRejectedTag) {
            computedTag = 'rejected';
          } else if (attendedSet.has(u.id)) {
            computedTag = 'attended';
          } else if (activeSet.has(u.id)) {
            computedTag = 'general';
          } else {
            const match = (u.instagram_handle || '').match(/^\[Tag:\s*(.*?)\]/i);
            computedTag = match ? match[1].toLowerCase() : 'general';
          }
          return { ...u, segregation_tag: computedTag };
        });

        return res.status(200).json({ success: true, users: enrichedUsers });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch community list', details: error.message });
      }
    }

    if (action === 'export') {
      try {
        const { data: allUsers, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        const { data: bookings } = await supabase.from('bookings').select('user_id').eq('status', 'confirmed');
        const { data: interests } = await supabase.from('occurrence_interests').select('user_id, status');

        const attendedSet = new Set((bookings || []).map(b => b.user_id));
        const rejectedSet = new Set((interests || []).filter(i => i.status === 'rejected').map(i => i.user_id));
        const activeSet = new Set((interests || []).map(i => i.user_id));

        const exportedUsers = (allUsers || []).map(u => {
          let computedTag = 'general';
          const isRejectedTag = (u.instagram_handle || '').match(/^\[Tag:\s*rejected\]/i);
          if (rejectedSet.has(u.id) || isRejectedTag) {
            computedTag = 'rejected';
          } else if (attendedSet.has(u.id)) {
            computedTag = 'attended';
          } else if (activeSet.has(u.id)) {
            computedTag = 'general';
          } else {
            const match = (u.instagram_handle || '').match(/^\[Tag:\s*(.*?)\]/i);
            computedTag = match ? match[1].toLowerCase() : 'general';
          }
          return { ...u, segregation_tag: computedTag };
        });

        return res.status(200).json({ success: true, users: exportedUsers });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to export community list', details: error.message });
      }
    }

    if (action === 'delete') {
      const { user_ids, occurrence_id } = req.body;
      if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
        return res.status(400).json({ error: 'No user IDs provided for deletion.' });
      }
      try {
        if (occurrence_id) {
          await supabase.from('occurrence_interests').delete().eq('occurrence_id', occurrence_id).in('user_id', user_ids);
        } else {
          await supabase.from('occurrence_interests').delete().in('user_id', user_ids);
          await supabase.from('users').delete().in('id', user_ids);
        }
        return res.status(200).json({ success: true, message: `Successfully deleted ${user_ids.length} guest(s).` });
      } catch (err) {
        return res.status(500).json({ error: 'Failed to delete guests', details: err.message });
      }
    }

    if (action === 'reject') {
      const { user_ids } = req.body;
      if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
        return res.status(400).json({ error: 'No user IDs provided for rejection.' });
      }
      try {
        // ALWAYS update status across ALL occurrences where this user has expressed interest so rejection propagates everywhere
        await supabase.from('occurrence_interests')
          .update({ status: 'rejected' })
          .in('user_id', user_ids);

        const { data: usersToReject } = await supabase.from('users').select('id, instagram_handle').in('id', user_ids);
        if (usersToReject && usersToReject.length > 0) {
          for (const u of usersToReject) {
            const cleanHandle = (u.instagram_handle || '').replace(/^\[Tag:\s*.*?\]\s*/i, '');
            const newHandle = `[Tag: rejected] ${cleanHandle}`.trim();
            await supabase.from('users').update({ instagram_handle: newHandle }).eq('id', u.id);
          }
        }

        return res.status(200).json({ success: true, message: `Marked ${user_ids.length} guest(s) as rejected globally across active and community lists.` });
      } catch (err) {
        return res.status(500).json({ error: 'Failed to mark rejected', details: err.message });
      }
    }

    if (action === 'upload' || users) {
      if (!Array.isArray(users) || users.length === 0) {
        return res.status(400).json({ error: 'No users provided.' });
      }

      try {
        let insertedCount = 0;
        let errorCount = 0;

        for (let i = 0; i < users.length; i += 50) {
          const batch = users.slice(i, i + 50).map((u, idx) => {
            const rawPhone = u.phone?.trim();
            const safePhone = (!rawPhone || rawPhone === 'N/A' || rawPhone === '')
              ? `na_${Date.now()}_${i}_${idx}_${Math.random().toString(36).substring(2, 6)}`
              : rawPhone;
            return {
              name: u.name?.trim() || 'Community Member',
              email: u.email?.trim()?.toLowerCase(),
              phone: safePhone,
              instagram_handle: u.tag ? `[Tag: ${u.tag.trim()}] ${u.instagram?.trim() || u.instagram_handle?.trim() || ''}`.trim() : (u.instagram?.trim() || u.instagram_handle?.trim() || null)
            };
          }).filter(u => u.email && u.email.includes('@'));

          if (batch.length === 0) continue;

          const { error: insertErr } = await supabase.from('users').upsert(batch, { onConflict: 'email' });
          if (insertErr) {
            console.error('Batch upsert error:', insertErr.message);
            errorCount += batch.length;
          } else {
            insertedCount += batch.length;
          }
        }

        return res.status(200).json({ success: true, message: `Imported/Updated ${insertedCount} guests successfully. (${errorCount} failed)` });
      } catch (err) {
        return res.status(500).json({ error: 'CSV Upload Failed', details: err.message });
      }
    }

    if (action === 'blast') {
      const { occurrence_id, custom_subject, custom_message, poster_url } = req.body;
      if (!occurrence_id) return res.status(400).json({ error: 'Occurrence ID required for blast.' });

      try {
        const { data: occ } = await supabase.from('occurrences').select('*').eq('id', occurrence_id).maybeSingle();
        if (!occ) throw new Error('Occurrence not found');

        const { data: dbUsers, error: usersError } = await supabase.from('users').select('id, email, name, instagram_handle');
        if (usersError) throw usersError;

        const { data: rejectedInterests } = await supabase.from('occurrence_interests').select('user_id').eq('status', 'rejected');
        const rejectedSet = new Set((rejectedInterests || []).map(i => i.user_id));

        const eligibleUsers = (dbUsers || []).filter(user => {
          if (!user.email || !user.email.includes('@')) return false;
          if (rejectedSet.has(user.id)) return false;
          if ((user.instagram_handle || '').match(/^\[Tag:\s*rejected\]/i)) return false;
          return true;
        });

        if (eligibleUsers.length === 0) {
          return res.status(400).json({ error: 'No eligible community members found to send email (all members may be rejected or missing valid emails).' });
        }

        const formattedMessage = custom_message
          ? custom_message.replace(/\n/g, '<br/>')
          : `We are delighted to announce our upcoming gathering: <strong style="color: #e86321;">${occ.title}</strong>.<br/><br/>As a cherished member of our community waitlist, you receive this secret announcement before the doors open to the world. A table filled with warm candlelight, shared laughter, and culinary storytelling awaits.`;

        const posterHtml = poster_url
          ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
               <tr>
                 <td align="center">
                   <img src="${poster_url}" alt="${occ.title}" style="width: 100%; max-width: 580px; height: auto; border-radius: 8px; display: block; margin: 0 auto; border: 0;" />
                 </td>
               </tr>
             </table>`
          : '';

        const dietaryInfoHtml = occ.dietary_type && occ.dietary_type !== 'non_veg'
          ? `<div style="background-color: rgba(232,99,33,0.1); border: 1px solid rgba(232,99,33,0.3); padding: 10px 15px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
               <strong style="color: #e86321; font-family: 'The Seasons', Georgia, serif; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
                 Dietary Course: ${occ.dietary_type === 'veg' ? '🌱 100% Vegetarian Course' : 'Chef\'s Custom Tasting / Both'}
               </strong>
             </div>`
          : `<div style="background-color: rgba(44,43,41,0.05); border: 1px solid rgba(44,43,41,0.15); padding: 10px 15px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
               <strong style="color: #2c2b29; font-family: 'The Seasons', Georgia, serif; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
                 Dietary Course: 🥩 Non-Vegetarian Curated Course
               </strong>
             </div>`;

        const interestLink = `${DOMAIN}/dinner`;

        const msgs = eligibleUsers.map(user => ({
          to: user.email,
          from: process.env.SENDGRID_FROM_EMAIL || 'hyndavio@vantammayilu.com',
          subject: custom_subject || `Announcing: ${occ.title}`,
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
                <div style="margin: 32px 0; text-align: center;">
                  <a href="${interestLink}" style="background-color: #e86321; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 16px; font-family: 'Hibernate', sans-serif; letter-spacing: 1px; text-transform: uppercase;">Express Interest Now</a>
                </div>
                <p style="font-size: 14px; color: #666; font-style: italic; text-align: center; font-family: 'Hibernate', 'The Seasons', Georgia, serif;">Only guests who express interest will be curated for the active guest list.</p>
                <div style="margin-top: 36px; border-top: 1px solid rgba(44,43,41,0.1); text-align: center; padding-top: 20px;">
                  <p style="font-style: italic; font-size: 16px; margin-bottom: 4px; color: #555; font-family: 'The Seasons', Georgia, serif;">Warmly,</p>
                  <p style="font-family: 'Apricot', 'Caveat', cursive, Georgia; font-size: 26px; color: #e86321; margin: 0;">Hyndavi & Artee</p>
                </div>
              </div>
            </body>
            </html>
          `
        }));

        if (process.env.SENDGRID_API_KEY) {
          try {
            for (let i = 0; i < msgs.length; i += 50) {
              const batch = msgs.slice(i, i + 50);
              const sendPromises = batch.map(msg => sgMail.send(msg));
              const results = await Promise.allSettled(sendPromises);
              const failures = results.filter(r => r.status === 'rejected');
              if (failures.length > 0) {
                console.error(`SendGrid batch had ${failures.length} failure(s):`, failures[0].reason);
              }
            }
          } catch (emailErr) {
            console.error('SendGrid Blast Error:', emailErr);
            const sendgridDetails = emailErr?.response?.body?.errors?.map(e => e.message).join('; ') || emailErr?.message || String(emailErr);
            return res.status(500).json({ error: `SendGrid Error: ${sendgridDetails}`, details: sendgridDetails });
          }
        } else {
          console.log(`[DEV] Simulated Community Blast sent to ${msgs.length} recipients.`);
          return res.status(200).json({ success: true, message: `Announcement broadcast simulated for ${msgs.length} members (NOTE: SENDGRID_API_KEY is missing in environment variables).` });
        }

        return res.status(200).json({ success: true, message: `Announcement broadcast sent to ${msgs.length} community members.` });
      } catch (error) {
        console.error('Error sending community blast:', error);
        const errDetails = error?.response?.body?.errors?.map(e => e.message).join('; ') || error?.message || String(error);
        return res.status(500).json({ error: errDetails || 'Internal Server Error', details: errDetails });
      }
    }

    return res.status(400).json({ error: 'Invalid action parameter.' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
