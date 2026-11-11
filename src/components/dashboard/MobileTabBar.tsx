import { ChartBar, FileText, Database, BookmarkSimple, Gear } from "@phosphor-icons/react";
import type { Tab } from "./Sidebar";

interface MobileTabBarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const tabs: { key: Tab; label: string; Icon: typeof ChartBar }[] = [
  { key: "overview", label: "Overview", Icon: ChartBar },
  { key: "reports", label: "Reports", Icon: FileText },
  { key: "data", label: "Data", Icon: Database },
  { key: "bookmarks", label: "Saved", Icon: BookmarkSimple },
  { key: "settings", label: "Settings", Icon: Gear },
];

export function MobileTabBar({ activeTab, setActiveTab }: MobileTabBarProps) {
  return (
    <nav className="flex lg:hidden items-center justify-around border-t border-white/10 bg-[#050505]/95 backdrop-blur-xl px-2 py-2 shrink-0">
      {tabs.map(({ key, label, Icon }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all text-[10px] font-mono uppercase tracking-wider ${
              isActive
                ? "text-red-500"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            <Icon size={20} weight={isActive ? "fill" : "regular"} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
