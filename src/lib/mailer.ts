import nodemailer from "nodemailer";
import { generatePaymentPDF, PaymentDetails } from "./pdf-generator";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === "true", // SSL/TLS sur le port 465
  auth: {
    user: process.env.SMTP_USER || "docuprosuite@allianceconsultants.net",
    pass: process.env.SMTP_PASS || "DocuPro_Alliance@225",
  },
});

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
}

export async function sendEmail(opts: SendEmailOptions) {
  const from = `"${opts.senderName || "DocuPro Alliance"}" <${process.env.SMTP_USER || "docuprosuite@allianceconsultants.net"}>`;
  const domain = (process.env.SMTP_USER || "docuprosuite@allianceconsultants.net").split("@")[1];

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

  const info = await transporter.sendMail({
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
      "List-Unsubscribe": `<mailto:${process.env.SMTP_USER}?subject=Unsubscribe>`,
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
