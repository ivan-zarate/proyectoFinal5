const dotenv = require("dotenv");

const envFile = process.env.NODE_ENV === 'dev' ? ".env.development" : ".env.production";

dotenv.config({
    path: envFile
});
const options = {
    MONGO_URL: process.env.MONGO_URL,
    MONGO_SESSION: process.env.MONGO_SESSION || "http://mongo/",
    CLAVE_SECRETA: process.env.CLAVE_SECRETA,
    MODE: process.env.MODE,
    NODEMAILER_EMAIL:process.env.NODEMAILER_EMAIL,
    NODEMAILER_PASSWORD:process.env.NODEMAILER_PASSWORD,
    ACCOUNT_ID:process.env.ACCOUNT_ID,
    ACCOUNT_TOKEN:process.env.ACCOUNT_TOKEN,
    TWILLIO_WAP:process.env.TWILLIO_WAP,
    TWILIOADMIN_WAP:process.env.TWILIOADMIN_WAP,
    ADMIN_USER:process.env.ADMIN_USER,
    ADMIN_PASS:process.env.ADMIN_PASS,
}

module.exports = { options };