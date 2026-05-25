import type { ReactNode } from "react";

interface SettingsSectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function SettingsSectionCard({
  title,
  subtitle,
  children,
}: SettingsSectionCardProps) {
  return (
    <section className="bg-sand-100 border border-sand-300 rounded-2xl p-6 flex flex-col gap-4">
      <div>
        <h3 className="font-sans text-sm font-semibold text-ink-700">{title}</h3>
        {subtitle && (
          <p className="font-sans text-xs text-ink-400 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}
