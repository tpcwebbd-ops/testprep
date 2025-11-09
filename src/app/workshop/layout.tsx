'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight } from 'lucide-react';

const sidebarData = [
  { id: 1, title: 'Admin', path: '/workshop/admin' },
  { id: 2, title: 'All Section', path: '/workshop/section' },
  { id: 3, title: 'Client', path: '/workshop' },
];

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-[70px]">
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`fixed top-[65px] left-0 h-[calc(100vh-65px)] z-40 w-72 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">Workshop</h2>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarData.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`group relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                  isActive ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-lg shadow-purple-500/20' : 'hover:bg-white/10'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideIn 0.5s ease-out forwards',
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 transform origin-left transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />

                <span
                  className={`relative z-10 font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}
                >
                  {item.title}
                </span>

                <ChevronRight
                  className={`relative z-10 w-5 h-5 transition-all duration-300 ${
                    isActive ? 'text-white translate-x-1' : 'text-gray-400 group-hover:text-white group-hover:translate-x-1'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
            <p className="text-sm text-gray-300">Workshop Dashboard</p>
            <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
          </div>
        </div>
      </aside>

      <main className="lg:ml-72 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
