"use server";

// dependecies, types and imports
import nodemailer from "nodemailer";
import { env } from "~/env";
import { TemplateVerificationEmail } from "./templates/email-verification";
import { TemplateRecoverAccount } from "./templates/email-recover-account";

// types
export type nodemailerProps = {
  from: string;
  to: string;
  subject: string;
  text: string;
};

export type HelpInputData = {
  client_id?: string;
  client_full_name?: string;
  client_email?: string;
  subject: string;
  other_title?: string;
  message: string;
};

export type verificationInputData = {
  client_full_name?: string;
  client_email?: string;
  subject: string;
  verification_code: number;
  expiration_time: string;
};

export type changePasswordTokenInputData = {
  client_full_name?: string;
  client_email?: string;
  subject: string;
  change_password_token: string;
  expiration_time: string;
};

// declare transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  auth: {
    user: env.NODEMAILER_EMAIL_USER,
    pass: env.NODEMAILER_EMAIL_PASSWORD,
  },
});

// send verification account email
export async function SendVerificationEmail(
  token: string,
  to: string
): Promise<void> {
  try {
    // validate inputs
    if (!token) {
      throw new Error("Token missing");
    }

    // load the email template
    const template = TemplateVerificationEmail({
      verification_url: `${env.APP_ORIGIN}/signin?verify-token=${token}`,
      expiration_time: 24, // hours
    });

    // define mail options
    const mailOptions = {
      from: `"UltimaTio - No Reply" <${env.NODEMAILER_EMAIL_USER}>`,
      to,
      subject: "Confirm Your Account",
      html: template,
    };

    // send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // handle error
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Ha ocurrido un error desconocido");
    }
  }
}

export async function RecoverPasswordEmail(
  token: string,
  to: string
): Promise<void> {
  try {
    // validate inputs
    if (!token) {
      throw new Error("Token missing");
    }

    // load the email template
    const template = TemplateRecoverAccount({
      recover_url: `${env.APP_ORIGIN}/recover?recover-token=${token}`,
      expiration_time: 24, // hours
    });

    // define mail options
    const mailOptions = {
      from: `"UltimaTio - No Reply" <${env.NODEMAILER_EMAIL_USER}>`,
      to,
      subject: "Recover Account",
      html: template,
    };

    // send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // handle error
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Ha ocurrido un error desconocido");
    }
  }
}
