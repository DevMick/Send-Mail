import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SendMail — Notification de Paiement",
  description: "Plateforme d'envoi de confirmations de paiement SEPA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 min-h-screen overflow-x-hidden">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg sticky top-0 z-50 border-b border-blue-700">
          <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-md rounded-lg p-2.5 flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">SendMail</h1>
                <p className="text-xs text-blue-100 mt-0.5">Confirmations de paiement SEPA</p>
              </div>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
