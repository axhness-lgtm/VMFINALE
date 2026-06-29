import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.SENDGRID_FROM_EMAIL || 'hyndavio@vantammayilu.com', // sending test email to yourself
  from: process.env.SENDGRID_FROM_EMAIL || 'hyndavio@vantammayilu.com',
  subject: 'SendGrid Integration Test — Vantammayilu',
  text: 'Congratulations! Your SendGrid integration is successfully working.',
  html: '<h3>Congratulations! 🎉</h3><p>Your SendGrid integration is successfully working with your backend.</p>',
};

console.log('⏳ Sending test email to:', msg.to);

sgMail
  .send(msg)
  .then(() => {
    console.log('\n✅ Test email sent successfully!');
    console.log('👉 Now go back to your SendGrid browser tab — it should automatically detect the email within a few seconds!');
  })
  .catch((error) => {
    console.error('\n❌ Error sending test email:');
    if (error.response) {
      console.error(JSON.stringify(error.response.body, null, 2));
    } else {
      console.error(error);
    }
  });
