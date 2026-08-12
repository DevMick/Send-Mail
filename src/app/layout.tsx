import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SendMail — Notification de Paiement",
  description: "Plateforme d'envoi de confirmations de paiement SEPA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
