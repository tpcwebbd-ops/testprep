'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { Home, Shield, Layers, Sparkles, ChevronRight } from 'lucide-react';

const layoutMenu = [
  { id: 1, name: 'Home', path: '/page-builder', icon: Home },
  { id: 2, name: 'Admin', path: '/page-builder/admin', icon: Shield },
  { id: 3, name: 'All section', path: '/page-builder/all-section', icon: Layers },
];

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isOpen = isHovered || isPinned;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden py-[65px]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>

      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="h-full backdrop-blur-xl bg-white/5 border-r border-white/10 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className={`flex items-center space-x-3 group transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              <div className="relative">
                <Sparkles className="w-6 h-6 text-purple-400 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                PageBuilder
              </span>
            </div>

            {!isOpen && (
              <div className="relative mx-auto">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl"></div>
              </div>
            )}

            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-1.5 rounded-lg backdrop-blur-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/10 ${
                isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
              }`}
            >
              <ChevronRight className={`w-4 h-4 text-white transition-transform duration-300 ${isPinned ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {layoutMenu.map(item => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`relative flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden group ${
                    isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-x"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 via-pink-600/50 to-blue-600/50 blur-xl animate-pulse"></div>
                    </>
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  )}

                  <Icon className="w-5 h-5 relative z-10 flex-shrink-0" />

                  <span
                    className={`relative z-10 whitespace-nowrap transition-all duration-300 ${
                      isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'
                    }`}
                  >
                    {item.name}
                  </span>

                  {!isActive && (
                    <div className="absolute left-0 top-1/2 w-1 h-0 bg-gradient-to-b from-purple-400 to-pink-400 group-hover:h-full group-hover:top-0 transition-all duration-300 rounded-r-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 transition-all duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300 whitespace-nowrap">System Active</span>
            </div>
          </div>
        </div>
      </aside>

      <main className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>{children}</main>

      <style jsx global>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
