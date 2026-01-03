const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // For development, you can use Gmail or other SMTP services
  // For production, consider using services like SendGrid, Mailgun, or AWS SES
  
  // Using Gmail as default (you'll need to set up App Password)
  // For other services, update the configuration accordingly
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
    },
    // For other SMTP services, use:
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    // secure: process.env.SMTP_SECURE === 'true',
  });
};

/**
 * Send tournament reminder email to team captain
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.captainName - Captain's name
 * @param {String} options.tournamentName - Tournament name
 * @param {String} options.sport - Sport name
 * @param {Date} options.startDate - Tournament start date
 * @param {String} options.venue - Tournament venue
 * @param {Number} options.daysBefore - Days before tournament
 */
const sendTournamentReminderEmail = async ({
  to,
  captainName,
  tournamentName,
  sport,
  startDate,
  venue,
  daysBefore
}) => {
  try {
    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email service not configured. Skipping email notification.');
      return { success: false, message: 'Email service not configured' };
    }

    const transporter = createTransporter();

    const formattedDate = new Date(startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const subject = daysBefore === 1
      ? `🚨 Tournament Starting Tomorrow: ${tournamentName}`
      : `📅 Tournament Reminder: ${tournamentName} in ${daysBefore} Days`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .info-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
          }
          .info-item {
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .info-item:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: bold;
            color: #667eea;
            display: inline-block;
            width: 120px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${daysBefore === 1 ? '🚨 Tournament Tomorrow!' : '📅 Tournament Reminder'}</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${captainName}</strong>,</p>
          
          <p>${daysBefore === 1 
            ? 'This is a reminder that your tournament is starting <strong>tomorrow</strong>! Make sure you and your team are ready.'
            : `This is a friendly reminder that your tournament is starting in <strong>${daysBefore} days</strong>. Start preparing!`
          }</p>
          
          <div class="info-box">
            <div class="info-item">
              <span class="info-label">Tournament:</span>
              <span>${tournamentName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Sport:</span>
              <span>${sport}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Start Date:</span>
              <span>${formattedDate}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Venue:</span>
              <span>${venue}</span>
            </div>
          </div>
          
          <p>${daysBefore === 1 
            ? 'Good luck with your tournament! We wish you and your team all the best.'
            : 'Please ensure all team members are aware and prepared for the tournament.'
          }</p>
          
          <p>Best regards,<br><strong>Sportify Campus Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated notification from Sportify Campus.</p>
          <p>If you have any questions, please contact the tournament organizers.</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Sportify Campus" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
      // Plain text version for email clients that don't support HTML
      text: `
Hello ${captainName},

${daysBefore === 1 
  ? 'This is a reminder that your tournament is starting TOMORROW!'
  : `This is a reminder that your tournament is starting in ${daysBefore} days.`
}

Tournament Details:
- Tournament: ${tournamentName}
- Sport: ${sport}
- Start Date: ${formattedDate}
- Venue: ${venue}

${daysBefore === 1 
  ? 'Good luck with your tournament!'
  : 'Please ensure all team members are aware and prepared.'
}

Best regards,
Sportify Campus Team
      `.trim()
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendTournamentReminderEmail
};

