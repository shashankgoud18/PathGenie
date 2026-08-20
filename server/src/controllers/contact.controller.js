import nodemailer from 'nodemailer';
import { query } from '../config/db.js';

/**
 * Creates a Nodemailer transport.
 * Uses SMTP credentials from env. Falls back gracefully if not configured.
 */
function createTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * POST /api/contact
 * Saves the message to DB and sends an email notification.
 */
export const submitContact = async (req, res, next) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({ error: 'firstName, email and message are required' });
    }

    // Always persist to DB regardless of email config
    await query(
      `INSERT INTO contact_messages (first_name, last_name, email, subject, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [firstName, lastName || '', email, subject || 'General', message]
    );

    // Attempt email notification (non-blocking)
    const transport = createTransport();
    if (transport) {
      const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;
      transport
        .sendMail({
          from: `"PathGenie Contact" <${process.env.SMTP_USER}>`,
          to,
          replyTo: email,
          subject: `[PathGenie Contact] ${subject || 'General'} — ${firstName} ${lastName || ''}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:auto">
              <h2 style="color:#8B5CF6">New Contact Form Submission</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${firstName} ${lastName || ''}</td></tr>
                <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:8px;font-weight:bold">Subject</td><td style="padding:8px">${subject || 'General'}</td></tr>
              </table>
              <div style="margin-top:16px;padding:16px;background:#f5f5f5;border-radius:8px;white-space:pre-wrap">${message}</div>
            </div>
          `,
        })
        .catch((err) => console.error('Contact email send error:', err.message));
    }

    return res.status(200).json({
      success: true,
      message: 'Your message has been received. We will get back to you within 24 hours.',
    });
  } catch (err) {
    next(err);
  }
};
