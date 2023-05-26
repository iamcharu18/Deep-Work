const ContactForm = require("../models/contact");
const nodemailer = require('nodemailer');
require('dotenv').config();

// utils.js
const sendMailAndInsertData = async (name, email, phone, subject, category) => {
    // Insert data into the database
    try {
        const now = new Date();
        const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const date = istTime.toISOString().slice(0, 10);
        const time = istTime.toISOString().slice(11, 19);

        await ContactForm.create({
            name,
            email,
            mobile: phone,
            category: category,
            date,
            time
        });


        // Send mail using nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            },
        });

        const mailOptions = {
            from: "contact@deepworkco.in",
            to: "contact@deepworkco.in",
            subject: subject,
            html: `<h2>Page : ${subject}</h2><p>Name : ${name}</p><p>Email : ${email}</p><p>Mobile : ${phone}</p><p>Category : ${category}</p>`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(error);
        throw new Error("Failed to send mail and insert data");
    }
};

module.exports = { sendMailAndInsertData };