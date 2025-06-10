// const mailer = require('nodemailer');
import mailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config({ path: "../../Deployment/ConfigurationManager/envs/dev.env" });


const transporter = mailer.createTransport({
    host: "localhost",
    secure: false,
    auth: {
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASSWORD
    }
})

export default transporter;