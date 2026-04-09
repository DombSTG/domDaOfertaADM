import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SidebarNav } from "@/src/components/SidebarNav";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dom da Oferta ADM",
  description: "Painel de aprovação de ofertas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="flex h-full bg-white text-gray-900 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[220px] shrink-0 border-r border-gray-100 flex flex-col bg-[#FAFAFA]">
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
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </div>

        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
