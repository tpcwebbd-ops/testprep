'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Home,
  Settings,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  FileText,
  Info,
  Wrench,
  Phone,
  HelpCircle,
  Menu,
  Lock,
  ScrollText,
  FileBadge,
  ShieldCheck,
  User,
  Users,
  GraduationCap,
  FolderKanban,
  FileSignature,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from '@/lib/auth-client';
import { ScrollArea } from '@/components/ui/scroll-area';

const dashboardSidebarData = [
  { id: 11, name: 'Profile', path: '/dashboard/profile', icon: <User size={18} /> },
  { id: 12, name: 'Account', path: '/dashboard/account', icon: <User size={18} /> },
  { id: 21, name: 'User', path: '/dashboard/user', icon: <Users size={18} /> },
  { id: 22, name: 'My-class', path: '/dashboard/my-class', icon: <GraduationCap size={18} /> },
  { id: 3, name: 'Session', path: '/dashboard/session', icon: <FileText size={18} /> },
  {
    id: 4,
    name: 'Verification',
    path: '/dashboard/verification',
    icon: <ShieldCheck size={18} />,
  },
  {
    id: 5,
    name: 'Site Setting',
    path: '/dashboard/site-setting',
    icon: <Settings size={18} />,
    childData: [
      { id: 51, name: 'Publish', path: '/dashboard/site-setting/publish', icon: <FileText size={16} /> },
      { id: 52, name: 'About', path: '/dashboard/site-setting/about', icon: <Info size={16} /> },
      { id: 53, name: 'Service', path: '/dashboard/site-setting/service', icon: <Wrench size={16} /> },
      { id: 54, name: 'Contact', path: '/dashboard/site-setting/contact', icon: <Phone size={16} /> },
      { id: 55, name: 'FAQ', path: '/dashboard/site-setting/Frequently-ask-question', icon: <HelpCircle size={16} /> },
      { id: 56, name: 'Menu', path: '/dashboard/site-setting/menu', icon: <Menu size={16} /> },
      { id: 57, name: 'Privacy & Policy', path: '/dashboard/site-setting/privacy-and-policy', icon: <Lock size={16} /> },
      { id: 58, name: 'Terms & Condition', path: '/dashboard/site-setting/terms-and-condition', icon: <ScrollText size={16} /> },
      { id: 59, name: 'Footer', path: '/dashboard/site-setting/footer', icon: <FileBadge size={16} /> },
    ],
  },
  {
    id: 6,
    name: 'Access',
    path: '/dashboard',
    icon: <ShieldCheck size={18} />,
    childData: [
      { id: 61, name: 'Access', path: '/dashboard/access/access', icon: <FolderKanban size={16} /> },
      { id: 62, name: 'Role', path: '/dashboard/access/role', icon: <FileSignature size={16} /> },
    ],
  },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  // Redirect if not logged in
  useEffect(() => {
    //  if (!session?.data?.session && !session?.isPending) {
    //    router.push('/login');
    //  }
  }, [session, router]);

  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    await signOut();
  };

  const user = session?.data?.user;

  return (
    <div className="fixed flex max-h-[calc(100vh-65px)] w-full pt-[65px]">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 -z-10" />

      {/* ===== Desktop Sidebar ===== */}
      <motion.aside
        animate={{ width: isCollapsed ? '80px' : '250px' }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex flex-col backdrop-blur-xl bg-white/10 border-r border-white/20 text-white p-3 space-y-4 relative"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white/20 hover:bg-white/30 p-1 rounded-full text-white transition"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Logo / Title */}
        <div className={`transition-all duration-300 ${isCollapsed ? 'text-center' : 'pl-2'}`}>
          <h1 className="text-lg font-bold">{isCollapsed ? 'DB' : 'Dashboard'}</h1>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 flex flex-col space-y-2 overflow-y-auto mt-4">
          {dashboardSidebarData.map(item => (
            <div key={item.id}>
              <button
                onClick={() => item.childData && toggleExpand(item.id)}
                className={`w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/20 transition ${
                  pathname === item.path ? 'bg-white/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {!isCollapsed && <Link href={item.path}>{item.name}</Link>}
                </div>
                {!isCollapsed && item.childData && <span>{expandedItem === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>}
              </button>

              {/* Accordion */}
              <AnimatePresence>
                {!isCollapsed && expandedItem === item.id && item.childData && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-6 mt-2 flex flex-col space-y-1"
                  >
                    {item.childData.map(child => (
                      <Link
                        key={child.id}
                        href={child.path}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/20 text-sm ${pathname === child.path ? 'bg-white/20' : ''}`}
                      >
                        {child.icon}
                        {child.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        {!isCollapsed && user && (
          <div className="mt-auto border-t border-white/20 pt-3">
            <button
              onClick={handleLogout}
              disabled={loadingLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition font-medium text-sm"
            >
              <LogOut size={18} />
              {loadingLogout ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        )}
      </motion.aside>

      {/* ===== Main Content ===== */}
      <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-1 lg:p-10 text-white">
        <ScrollArea className="w-full h-[calc(100vh-65px)] pb-12">{children}</ScrollArea>
      </motion.main>

      {/* ===== Mobile Bottom Navigation ===== */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/10 backdrop-blur-xl border-t border-white/20 flex justify-around items-center py-2 text-white">
        <Link href="/dashboard">
          <Home size={24} />
        </Link>
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
          <MessageCircle size={24} />
        </a>
        <button onClick={() => setMobileSidebarOpen(true)}>
          <Settings size={24} />
        </button>
      </div>

      {/* ===== Mobile Sidebar ===== */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex pt-14"
          >
            <motion.aside
              initial={{ x: -200 }}
              animate={{ x: 0 }}
              exit={{ x: -200 }}
              transition={{ duration: 0.4 }}
              className="w-64 bg-white/10 backdrop-blur-xl text-white p-4 overflow-y-auto flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X size={22} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col space-y-2">
                {dashboardSidebarData.map(item => (
                  <div key={item.id}>
                    <button
                      onClick={() => item.childData && toggleExpand(item.id)}
                      className="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-white/20 transition"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <Link href={item.path}>{item.name}</Link>
                      </div>
                      {item.childData && <span>{expandedItem === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>}
                    </button>

                    {/* Accordion (mobile) */}
                    <AnimatePresence>
                      {expandedItem === item.id && item.childData && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-6 mt-2 flex flex-col space-y-1"
                        >
                          {item.childData.map(child => (
                            <Link
                              key={child.id}
                              href={child.path}
                              onClick={() => setMobileSidebarOpen(false)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/20 text-sm ${
                                pathname === child.path ? 'bg-white/20' : ''
                              }`}
                            >
                              {child.icon}
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              {/* Logout button (mobile) */}
              {user && (
                <div className="border-t border-white/20 pt-3 mt-3">
                  <button
                    onClick={handleLogout}
                    disabled={loadingLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition font-medium text-sm"
                  >
                    <LogOut size={18} />
                    {loadingLogout ? 'Logging out...' : 'Log out'}
                  </button>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
