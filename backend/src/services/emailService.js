const nodemailer = require("nodemailer");

/**
 * Create SMTP transporter
 * Configure these in .env (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email
 * @param {Object} options - { email, subject, message, html }
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `Sands Ornaments <${process.env.SMTP_FROM || "noreply@sands.com"}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error("[Email] Sending failed:", err.message);
    // Don't throw for emails in dev to avoid breaking flows if SMTP is missing
    return null;
  }
};

module.exports = { sendEmail };
