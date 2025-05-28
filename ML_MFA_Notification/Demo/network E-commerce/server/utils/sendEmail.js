const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Define email options
    const mailOptions = {
        from: `ShopEasy <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
