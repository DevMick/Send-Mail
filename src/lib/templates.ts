export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  badge: "indigo" | "green" | "amber" | "red" | "sky";
  icon: string;
  subjectTemplate: string;
  variables: Record<string, string>;
  html: string;
  text: string;
}

export const templates: EmailTemplate[] = [
  {
    id: "payment-confirmation",
    name: "Confirmation de paiement",
    description: "Confirmation de paiement par virement SEPA à authentifier",
    category: "Finance",
    badge: "amber",
    icon: "💰",
    subjectTemplate: "Confirmation de paiement à authentifier",
    variables: { PayerName: "", BeneficiaryName: "", Amount: "", AccountNumber: "", CompanyName: "Vinted Pro" },
    text: "Bonjour,\n\nVotre confirmation de paiement est en pièce jointe au format PDF. Veuillez consulter le document pour tous les détails de la transaction.\n\nPour accepter le paiement de votre acheteur, merci de confirmer et authentifier le paiement en attente.\n\nCordialement,\nL'équipe {{CompanyName}}",
    html: `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);">
<tr><td style="padding:32px 40px;">
<p style="color:#333;font-size:16px;line-height:1.6;margin:0 0 24px;font-weight:600;">Bonjour,</p>
<p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 28px;">Votre confirmation de paiement est en pièce jointe au format <strong>PDF</strong>. Veuillez consulter le document pour tous les détails de la transaction.</p>
<p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 28px;">Pour accepter le paiement de votre acheteur, merci de confirmer et authentifier le paiement en attente.</p>
<div style="text-align:center;margin:32px 0;">
<a href="https://www.equipe-securisevinted-pro.com/" style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 40px;border-radius:4px;font-size:14px;font-weight:600;display:inline-block;">Confirmer le paiement</a>
</div>
</td></tr>
<tr><td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #e0e0e0;">
<p style="color:#999;font-size:12px;margin:0 0 12px;line-height:1.5;">
Cordialement,<br>
L'équipe {{CompanyName}}
</p>
<p style="color:#bbb;font-size:10px;margin:0;border-top:1px solid #e0e0e0;padding-top:12px;">
© 2026 {{CompanyName}}. Tous droits réservés.
</p>
</td></tr></table></td></tr></table>
</body></html>`,
  },
];

export function getTemplate(id: string) {
  return templates.find((t) => t.id === id) ?? null;
}

export function applyVariables(template: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, v),
    template
  );
}
