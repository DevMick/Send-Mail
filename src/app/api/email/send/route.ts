import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, cc, bcc, subject, html, text, senderName, replyTo } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, message: "Les champs to, subject et html sont requis." },
        { status: 400 }
      );
    }

    await sendEmail({
      to,
      cc,
      bcc,
      subject,
      html,
      text,
      senderName,
      replyTo,
      paymentDetails: {
        payerName: body.payerName,
        beneficiaryName: body.beneficiaryName,
        amount: body.amount,
        accountNumber: body.accountNumber,
        companyName: body.companyName || "Vinted Pro",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Email envoyé avec succès à ${to}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[sendEmail]", message);
    return NextResponse.json(
      { success: false, message: "Échec de l'envoi.", error: message },
      { status: 500 }
    );
  }
}
