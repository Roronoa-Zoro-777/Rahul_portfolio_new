import { ChartBar, FileText, Database, BookmarkSimple, Gear } from "@phosphor-icons/react";
import Link from "next/link";

export type Tab = "overview" | "reports" | "data" | "bookmarks" | "settings";

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="flex h-full w-20 flex-col items-center border-r border-white/10 bg-[#050505] py-6">
      <Link href="/projects" className="mb-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all">
        <span className="font-mono text-xs font-bold">BK</span>
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-6">
        <NavItem icon={<ChartBar size={24} weight={activeTab === "overview" ? "fill" : "regular"} />} isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")} title="Overview" />
        <NavItem icon={<FileText size={24} weight={activeTab === "reports" ? "fill" : "regular"} />} isActive={activeTab === "reports"} onClick={() => setActiveTab("reports")} title="Reports" />
        <NavItem icon={<Database size={24} weight={activeTab === "data" ? "fill" : "regular"} />} isActive={activeTab === "data"} onClick={() => setActiveTab("data")} title="Data Sources" />
        <NavItem icon={<BookmarkSimple size={24} weight={activeTab === "bookmarks" ? "fill" : "regular"} />} isActive={activeTab === "bookmarks"} onClick={() => setActiveTab("bookmarks")} title="Bookmarks" />
      </nav>

      <div className="mt-auto">
        <NavItem icon={<Gear size={24} weight={activeTab === "settings" ? "fill" : "regular"} />} isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")} title="Settings" />
      </div>
    </aside>
  );
}

function NavItem({ icon, isActive = false, onClick, title }: { icon: React.ReactNode; isActive?: boolean; onClick: () => void; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={isActive}
      className={`relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
        isActive
          ? "bg-red-500/10 text-red-500"
          : "text-zinc-500 hover:bg-white/5 hover:text-white"
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-red-500" />
      )}
      {icon}
    </button>
  );
}
