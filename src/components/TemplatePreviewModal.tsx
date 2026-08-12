"use client";
import Link from "next/link";
import { EmailTemplate } from "@/lib/templates";
import { useEffect } from "react";

interface Props {
  template: EmailTemplate;
  onClose: () => void;
}

export default function TemplatePreviewModal({ template, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-slate-900/70 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-slate-50">
          <span className="text-2xl">{template.icon}</span>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">{template.name}</h3>
            <p className="text-slate-500 text-xs">{template.description}</p>
          </div>
          <Link
            href={`/compose?template=${template.id}`}
            className="btn-primary text-sm py-2 mr-2"
          >
            ✏️ Utiliser
          </Link>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors text-xl">
            ×
          </button>
        </div>

        {/* Iframe preview */}
        <div className="flex-1 overflow-hidden">
          <iframe
            srcDoc={template.html}
            sandbox="allow-same-origin"
            className="w-full h-full border-0 min-h-[500px]"
            title={`Aperçu ${template.name}`}
          />
        </div>

        {/* Variables */}
        {template.variables && Object.keys(template.variables).length > 0 && (
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1">Variables :</span>
              {Object.keys(template.variables).map((v) => (
                <span key={v} className="bg-indigo-50 text-indigo-600 text-[11px] font-semibold px-2 py-0.5 rounded">
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
