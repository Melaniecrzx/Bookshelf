import { useState } from "react";
import { SettingsSidebar, type SectionId } from "../components/settings/SettingsSidebar";
import { SettingsMobileTabs } from "../components/settings/SettingsMobileTabs";
import { AppearanceSection } from "../components/settings/AppearanceSection";
import { ReadingSection } from "../components/settings/ReadingSection";
import { DangerSection } from "../components/settings/DangerSection";

const sectionMeta: Record<SectionId, { title: string; subtitle: string }> = {
  appearance: { title: "Appearance", subtitle: "Customize how Bookshelf looks and feels." },
  reading:    { title: "Reading",    subtitle: "Adjust typography for a comfortable reading experience." },
  danger:     { title: "Danger Zone", subtitle: "Irreversible actions — proceed with caution." },
};

export function AppearancePage() {
  const [section, setSection] = useState<SectionId>("appearance");
  const meta = sectionMeta[section];

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-6xl mx-auto">
      <h1 className="font-serif text-3xl font-bold text-ink-900 mb-8">Settings</h1>
      <div className="flex gap-10">
        <SettingsSidebar active={section} onChange={setSection} />
        <div className="flex-1 min-w-0">
          <SettingsMobileTabs active={section} onChange={setSection} />
          <div className="mb-6">
            <h2 className={`font-serif text-2xl font-bold ${section === "danger" ? "text-red-600" : "text-ink-900"}`}>
              {meta.title}
            </h2>
            <p className="font-sans text-sm text-ink-400 mt-1">{meta.subtitle}</p>
          </div>
          {section === "appearance" && <AppearanceSection />}
          {section === "reading"    && <ReadingSection />}
          {section === "danger"     && <DangerSection />}
        </div>
      </div>
    </div>
  );
}
