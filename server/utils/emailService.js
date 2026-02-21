const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // For development, you can use Mailtrap or a similar service
    // For Gmail, you'd need to use App Passwords
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

const sendBudgetAlert = async (userEmail, budgetData, type) => {
    let subject, html;

    const { category, limit, spent, percent } = budgetData;

    if (type === '70%') {
        subject = `⚠️ Budget Warning: ${category} (${percent}% Used)`;
        html = `
            <h2>Budget Warning</h2>
            <p>You have used <strong>${percent}%</strong> of your budget for <strong>${category}</strong>.</p>
            <p>Budget Limit: $${limit}</p>
            <p>Amount Spent: $${spent}</p>
            <p>Be careful with your spending!</p>
        `;
    } else if (type === '90%') {
        subject = `🚨 Critical Budget Alert: ${category} (${percent}% Used)`;
        html = `
            <h2>Critical Budget Alert</h2>
            <p>You have used <strong>${percent}%</strong> of your budget for <strong>${category}</strong>.</p>
            <p>Budget Limit: $${limit}</p>
            <p>Amount Spent: $${spent}</p>
            <p>You are very close to exceeding your budget!</p>
        `;
    } else if (type === '100%') {
        subject = `⛔ Budget Exceeded: ${category}`;
        html = `
            <h2>Budget Exceeded</h2>
            <p>You have <strong>EXCEEDED</strong> your budget for <strong>${category}</strong>.</p>
            <p>Budget Limit: $${limit}</p>
            <p>Amount Spent: $${spent}</p>
            <p>Please review your expenses immediately.</p>
        `;
    }

    await sendEmail({
        email: userEmail,
        subject,
        html
    });
};

module.exports = {
    sendEmail,
    sendBudgetAlert
};
