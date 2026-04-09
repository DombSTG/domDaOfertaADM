import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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
          <nav className="flex-1 py-3 px-2 space-y-[1px]">
            <p className="px-2 pb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Moderação
            </p>
            <a
              href="/"
              className="flex items-center gap-2 px-2 py-[5px] rounded-[6px] text-[13px] text-gray-700 bg-gray-100 font-medium"
            >
              <svg
                className="h-[15px] w-[15px] text-gray-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.1 13.177a2.25 2.25 0 0 0-.1.661Z"
                />
              </svg>
              Fila de Aprovação
            </a>
          </nav>
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
