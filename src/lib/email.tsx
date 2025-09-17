import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import ResetEmailTemplate from "@/components/emails/reset-email-template";

interface SendEmailProps {
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface sendResetPasswordEmailProps {
  username: string;
  userEmail: string;
  resetUrl: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, text, html }: SendEmailProps) {
  try {
    const info = await transporter.sendMail({
      from: `"Zynk Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent: %s", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendResetPasswordEmail({
  username,
  userEmail,
  resetUrl,
}: sendResetPasswordEmailProps) {
  const html = await render(
    <ResetEmailTemplate
      username={username}
      userEmail={userEmail}
      resetUrl={resetUrl}
    />,
  );

  return await sendEmail({
    to: userEmail,
    subject: "Reset your password",
    text: `Click here to reset your password: ${resetUrl}`,
    html,
  });
}
