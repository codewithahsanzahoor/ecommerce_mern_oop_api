import { config } from "../config/config";
import nodeMailer from "nodemailer";

function sendEmail(email: string, subject: string, message: string) {
	const transporter = nodeMailer.createTransport({
		host: `${config.SMPT_HOST}`,
		port: Number(config.SMPT_PORT),
		service: `${config.SMPT_SERVICE}`,
		auth: {
			user: `${config.SMPT_EMAIL}`,
			pass: `${config.SMPT_PASSWORD}`,
		},
	});

	const mailOptions = {
		from: `${config.SMPT_EMAIL}`,
		to: email,
		subject: subject,
		text: message,
	};

	transporter.sendMail(mailOptions, function (error: any, info: any) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
}

export default sendEmail;
