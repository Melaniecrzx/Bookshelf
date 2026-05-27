import { Construction } from "lucide-react";

interface PlaceholderSectionProps {
  title: string;
}

export function PlaceholderSection({ title }: PlaceholderSectionProps) {
  return (
    <div className="bg-sand-100 border border-sand-300 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 text-center">
      <div className="w-10 h-10 rounded-full bg-sand-200 flex items-center justify-center">
        <Construction size={18} strokeWidth={1.75} className="text-ink-400" />
      </div>
      <div>
        <p className="font-sans text-sm font-medium text-ink-700">{title} settings</p>
        <p className="font-sans text-xs text-ink-400 mt-1">Coming soon — this section is under construction.</p>
      </div>
    </div>
  );
}
