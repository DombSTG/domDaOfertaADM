import { SidebarNav } from "@/src/components/SidebarNav";
import { BottomNav } from "@/src/components/BottomNav";
import { MobileAddButton } from "@/src/components/MobileAddButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full bg-white text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[220px] shrink-0 border-r border-gray-100 flex-col bg-[#FAFAFA]">
        {/* App header */}
        <div className="flex items-center gap-2.5 px-4 h-[44px] border-b border-gray-100">
          <div className="h-5 w-5 rounded-[5px] bg-violet-600 flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold leading-none">D</span>
          </div>
          <span className="text-[13px] font-semibold text-gray-900 truncate">Dom da Oferta</span>
        </div>

        {/* Nav */}
        <SidebarNav />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-14 md:pb-0">
        {children}
      </div>

      <BottomNav />
      <MobileAddButton />
    </div>
  );
}
