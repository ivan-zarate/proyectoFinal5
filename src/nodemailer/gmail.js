const nodemailer = require("nodemailer");
const { options } = require("../config/options");

const adminEmail = options.NODEMAILER_EMAIL;
const adminPassword = options.NODEMAILER_PASSWORD;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: adminEmail,
        pass: adminPassword
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = { transporter, adminEmail }