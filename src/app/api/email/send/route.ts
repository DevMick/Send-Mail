import { NextRequest, NextResponse } from "next/server";

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyjQN2fosG8Hcoq4Gfch3V5oOkpXSxclgAhtEICZj9BYBFm60MwA3Q7g9c2kpyKODDD/exec";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, cc, bcc, subject, html, text, senderName, replyTo, paymentDetails } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, message: "Les champs to, subject et html sont requis." },
        { status: 400 }
      );
    }

    // Appeler le script Google Apps Script depuis le backend (pas de problème CORS)
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        cc,
        bcc,
        subject,
        html,
        text,
        senderName,
        replyTo,
        paymentDetails,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message, error: result.error },
        { status: 500 }
      );
    }

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
