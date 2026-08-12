"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { templates, EmailTemplate, applyVariables } from "@/lib/templates";

function ComposeForm() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Notification de paiement en attente");
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");
  const [senderName, setSenderName] = useState("Vinted Pro");
  const [replyTo, setReplyTo] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Variables du template
  const [payerName, setPayerName] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [companyName, setCompanyName] = useState("Vinted Pro");

  useEffect(() => {
    const paymentTemplate = templates.find((x) => x.id === "payment-confirmation");
    if (paymentTemplate) {
      setSubject("Notification de paiement en attente");
      setHtml(paymentTemplate.html);
      setText(paymentTemplate.text);
      setSenderName("Vinted Pro");
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !html || !payerName || !beneficiaryName || !amount || !accountNumber) return;
    setLoading(true);
    setStatus(null);
    try {
      const vars = {
        PayerName: payerName,
        BeneficiaryName: beneficiaryName,
        Amount: amount,
        AccountNumber: accountNumber,
        CompanyName: companyName,
      };
      const finalHtml = applyVariables(html, vars);
      const finalText = applyVariables(text, vars);

      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject,
          html: finalHtml,
          text: finalText,
          senderName,
          replyTo,
          payerName,
          beneficiaryName,
          amount,
          accountNumber,
          companyName,
        }),
      });
      const data = await res.json();
      setStatus({ type: data.success ? "success" : "error", msg: data.message + (data.error ? ` — ${data.error}` : "") });
      if (data.success) {
        setTo(""); setSubject("Notification de paiement en attente"); setHtml(""); setText("");
        setPayerName(""); setBeneficiaryName(""); setAmount(""); setAccountNumber(""); setCompanyName("Vinted Pro");
      }
    } catch {
      setStatus({ type: "error", msg: "Erreur réseau. Vérifiez votre connexion." });
    } finally {
      setLoading(false);
    }
  };

  const wrapTag = (tag: string) => {
    const el = document.getElementById("htmlEditor") as HTMLTextAreaElement;
    const start = el.selectionStart, end = el.selectionEnd;
    const sel = el.value.substring(start, end) || "Texte";
    setHtml(el.value.substring(0, start) + `<${tag}>${sel}</${tag}>` + el.value.substring(end));
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {/* Form */}
      <div className="w-full max-w-xl py-8 pt-16">
        <form onSubmit={handleSubmit} className="card bg-white shadow-lg">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
            <span className="text-2xl">💬</span>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Confirmation de Paiement</h2>
              <p className="text-xs text-slate-500 mt-0.5">Détails de la transaction</p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            {/* To */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Destinataire(s) *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="email@example.com, autre@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
              <p className="text-slate-400 text-xs mt-1">Séparez plusieurs adresses par une virgule</p>
            </div>

            {/* Données du paiement */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
              <h3 className="text-base font-bold text-indigo-900 mb-6 flex items-center gap-2">
                <span>💰</span> Informations de paiement
              </h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Transfert de (Nom du payeur) *</label>
                  <input className="form-input" placeholder="Ex: Chloe Michel" value={payerName} onChange={(e) => setPayerName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bénéficiaire *</label>
                  <input className="form-input" placeholder="Ex: Jason Sacchettino" value={beneficiaryName} onChange={(e) => setBeneficiaryName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Montant du virement €*</label>
                  <input className="form-input" placeholder="Ex: 72,10" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Numéro de compte IBAN *</label>
                  <input className="form-input" placeholder="Ex: BE69************9078" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 mt-4">Nom de l'entreprise</label>
                <input className="form-input" placeholder="Vinted Pro" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Objet *</label>
              <input className="form-input" placeholder="Objet de votre email..." value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>

            {/* Sender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nom de l&apos;expéditeur</label>
              <input className="form-input" placeholder="Vinted Pro" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
              <p className="text-slate-400 text-xs mt-1">Affiché dans la boîte de réception</p>
            </div>



            {/* Submit */}
            <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
              <button type="reset" onClick={() => { setTo(""); setSubject("Notification de paiement en attente"); setHtml(""); setText(""); setPayerName(""); setBeneficiaryName(""); setAmount(""); setAccountNumber(""); setCompanyName("Vinted Pro"); setStatus(null); }}
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                🔄 Réinitialiser
              </button>
              <button type="submit" disabled={loading} className="px-8 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "⏳ Envoi en cours…" : "📤 Envoyer le paiement"}
              </button>
            </div>
          </div>
        </form>

        {/* Status */}
        {status && (
          <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 ${
            status.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            <span className="text-xl flex-shrink-0">{status.type === "success" ? "✅" : "❌"}</span>
            <div>
              <strong>{status.type === "success" ? "Email envoyé !" : "Erreur d'envoi"}</strong>
              <p className="text-sm mt-0.5 opacity-80">{status.msg}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default function ComposePage() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="flex-1 overflow-auto p-8 pt-16">
        <Suspense fallback={<div className="text-slate-500 text-center py-8">Chargement...</div>}>
          <ComposeForm />
        </Suspense>
      </div>
    </div>
  );
}
