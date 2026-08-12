import Link from "next/link";

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 gap-4 sticky top-0 z-40">
      <div className="flex-1 font-semibold text-slate-800">{title}</div>
      <Link href="/compose" className="btn-primary">
        <span>+</span> Nouvel email
      </Link>
    </header>
  );
}
