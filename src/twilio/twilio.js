const twilio = require("twilio");
const { options } = require("../config/options");

//credenciales
const accountId = options.ACCOUNT_ID;
const accountToken = options.ACCOUNT_TOKEN;

const twilioClient = twilio(accountId, accountToken);

const twilioWapp = options.TWILLIO_WAP;
const adminWapp = options.TWILIOADMIN_WAP;


module.exports = { twilioWapp, adminWapp, twilioClient };  