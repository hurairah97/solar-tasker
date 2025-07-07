const nodemailer = require("nodemailer");
const RESPONSE = require("../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../logger");
const dotenv = require("dotenv");

dotenv.config();

module.exports = function sendUserCredentials(email, username, password,call, req, res) {
    try {
        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        // Create email options
        const create_mailOptions = {
            from: "support@solarcleaner.pk",
            to: email,
            subject: "Your Account Credentials",
            html: `
                <p>Dear <strong>${username}</strong>,</p>
                <p>Your account has been successfully created. Below are your login details:</p>
                <p><strong>Username:</strong> ${username}<br>
                   <strong>Password:</strong> ${password}</p>
                <p>Please use these credentials to log in to the system.</p>
                <p>If you have any questions or concerns, please contact your administrator.</p>
                <p>Best regards,<br>Admin Team</p>
            ` // HTML body of the email
        };

        const reset_mailOptions = {
            from: "support@solarcleaner.pk",
            to: email,
            subject: "Your Account Credentials",
            html: `
                <p>Dear <strong>${username}</strong>,</p> 
                <p>Your password has been successfully reset. Below are your updated login details:</p> 
                <p><strong>Username:</strong> ${username}<br> 
                    <strong>Password:</strong> ${password}</p> 
                    <p>Please use the password to log in to the system.</p> 
                    <p>If you encounter any issues or have any concerns, please contact your administrator.</p> 
                    <p>Best regards,<br>Admin Team</p>`
        }
        let mailOptions;
        if(call === "create"){
            mailOptions=create_mailOptions;
        }
        else{
            mailOptions=reset_mailOptions;
        }
        // Send the email
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                logWithOptionalBroadcast('error',"Error sending email:", err);
                return res.status(500).send(RESPONSE(false, "Error sending email", err));
            } else {
                logWithOptionalBroadcast('info',"Email sent successfully:", data.response);
                return res.status(200).send(RESPONSE(true, "Email sent successfully", {}));
            }
        });
    } catch (err) {
        logWithOptionalBroadcast('error',"Catch Error (Email Error):", err);
        return res.status(500).send(RESPONSE(false, "Unexpected error while sending email", err));
    }
};
