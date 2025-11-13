'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState, useMemo } from 'react';
import { Home, Shield, Layers, Sparkles, ChevronRight, Plus, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useGetPageBuilderQuery, useAddPageBuilderMutation } from '@/redux/features/page-builder/pageBuilderSlice';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const defaultlayoutMenu = [
  { id: 1, name: 'Home', path: '/page-builder', icon: Home },
  { id: 2, name: 'Admin', path: '/page-builder/admin', icon: Shield },
  { id: 3, name: 'All section', path: '/page-builder/all-section', icon: Layers },
];

interface RootLayoutProps {
  children: ReactNode;
}

interface DynamicPage {
  id: string;
  name: string;
  path: string;
  icon: LucideIcon;
}

const iconOptions: string[] = [
  'Home',
  'Shield',
  'Layers',
  'Sparkles',
  'FileText',
  'Settings',
  'Users',
  'Package',
  'Globe',
  'Database',
  'Code',
  'Zap',
  'Target',
  'TrendingUp',
  'Activity',
];

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPage, setNewPage] = useState({
    name: '',
    path: '/',
    icon: 'Home',
  });

  const { data: getResponseData } = useGetPageBuilderQuery({ q: '', page: 1, limit: 100 });
  const [addPageBuilder, { isLoading: isAdding }] = useAddPageBuilderMutation();
  const parentData = getResponseData?.data?.sections;

  const dynamicLayout = useMemo(() => {
    if (!parentData || !Array.isArray(parentData)) return [];

    return parentData.map(page => ({
      id: page._id,
      name: page.title || 'Untitled Page',
      path: page.path || '/',
      icon: (Icons[page.iconName as keyof typeof Icons] || Icons.Home) as LucideIcon,
    }));
  }, [parentData]);

  const combinedMenu = useMemo(() => {
    return [...defaultlayoutMenu, ...dynamicLayout];
  }, [dynamicLayout]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleAddPage = async () => {
    if (!newPage.name || !newPage.path) return;

    try {
      await addPageBuilder({
        title: newPage.name,
        path: newPage.path,
        iconName: newPage.icon,
      }).unwrap();

      setNewPage({ name: '', path: '/', icon: 'Home' });
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to add page:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>

      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {isOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden"></div>}

      <aside className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}>
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
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {combinedMenu.map(item => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              const validPath = item.path || '/';

              return (
                <Link
                  key={item.id}
                  href={validPath}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setIsOpen(false);
                    }
                  }}
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

          <div className="p-4 border-t border-white/10 space-y-3">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Page
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-purple-500/30">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Page</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="pageName" className="text-gray-300">
                      Page Name
                    </Label>
                    <Input
                      id="pageName"
                      value={newPage.name}
                      onChange={e => setNewPage({ ...newPage, name: e.target.value })}
                      placeholder="e.g., Dashboard"
                      className="bg-slate-800 border-purple-500/30 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pagePath" className="text-gray-300">
                      Path
                    </Label>
                    <Input
                      id="pagePath"
                      value={newPage.path}
                      onChange={e => setNewPage({ ...newPage, path: e.target.value })}
                      placeholder="e.g., /dashboard"
                      className="bg-slate-800 border-purple-500/30 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pageIcon" className="text-gray-300">
                      Icon
                    </Label>
                    <Select value={newPage.icon} onValueChange={value => setNewPage({ ...newPage, icon: value })}>
                      <SelectTrigger className="bg-slate-800 border-purple-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-500/30">
                        {iconOptions.map(iconName => {
                          const IconComponent = Icons[iconName as keyof typeof Icons] as LucideIcon;
                          return (
                            <SelectItem key={iconName} value={iconName} className="text-white hover:bg-slate-700">
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                <span>{iconName}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleAddPage}
                    disabled={isAdding}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding ? 'Creating...' : 'Create Page'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </aside>

      <div
        onClick={toggleSidebar}
        className={`fixed top-[80px] z-[60] rounded-full bg-blue-500/50 border-slate-200/50 border-1 transition-all duration-300 cursor-pointer group ${isOpen ? 'left-[243px]' : 'left-[70px]'}`}
      >
        <ChevronRight className={`w-6 h-6 text-white drop-shadow-lg group-hover:scale-110 transition-all duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </div>

      <main className={`transition-all duration-300 min-h-screen pt-20 pb-10 ${isOpen ? 'ml-60' : 'ml-16'}`}>
        <div className="container mx-auto px-4">{children}</div>
      </main>

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
