const transporter = require('./../../config/emailConfig');

require('dotenv').config();

const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: `"Cloud Campus" <${process.env.EMAIL}>`, // Sender address loaded from environment variables
        to, // Recipient address
        subject, // Subject line
        html: htmlContent // HTML body content
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
