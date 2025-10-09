'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Settings, MessageCircle, ChevronDown, ChevronRight, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Example Sidebar Data
const dashboardSidebarData = [
  { id: 1, name: 'Account', path: '/dashboard/account', icon: <MailCheck size={18} /> },
  { id: 2, name: 'User', path: '/dashboard/user', icon: <MailCheck size={18} /> },
  { id: 3, name: 'Session', path: '/dashboard/session', icon: <MailCheck size={18} /> },
  {
    id: 4,
    name: 'Verification',
    path: '/dashboard/verification',
    icon: <MailCheck size={18} />,
  },
  {
    id: 5,
    name: 'Site Setting',
    path: '/dashboard/site-setting',
    icon: <MailCheck size={18} />,
    childData: [
      { id: 51, name: 'Publish', path: '/dashboard/site-setting/publish', icon: <MailCheck size={16} /> },
      { id: 52, name: 'About', path: '/dashboard/site-setting/about', icon: <MailCheck size={16} /> },
      { id: 53, name: 'Service', path: '/dashboard/site-setting/service', icon: <MailCheck size={16} /> },
      { id: 54, name: 'Contact', path: '/dashboard/site-setting/contact', icon: <MailCheck size={16} /> },
      { id: 55, name: 'FAQ', path: '/dashboard/site-setting/Frequently-ask-question', icon: <MailCheck size={16} /> },
      { id: 56, name: 'Menu', path: '/dashboard/site-setting/menu', icon: <MailCheck size={16} /> },
      { id: 57, name: 'Privacy & Policy', path: '/dashboard/site-setting/privacy-and-policy', icon: <MailCheck size={16} /> },
      { id: 58, name: 'Terms & Condition', path: '/dashboard/site-setting/terms-and-condition', icon: <MailCheck size={16} /> },
      { id: 59, name: 'Footer', path: '/dashboard/site-setting/footer', icon: <MailCheck size={16} /> },
    ],
  },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const pathname = usePathname();

  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 flex relative">
      {/* ===== Desktop Sidebar ===== */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden md:flex flex-col w-64 backdrop-blur-xl bg-white/10 border-r border-white/20 text-white p-4 space-y-4"
          >
            <button onClick={() => setIsSidebarOpen(false)} className="self-end text-white hover:text-gray-300">
              <X size={20} />
            </button>

            <nav className="flex flex-col space-y-2 overflow-y-auto">
              {dashboardSidebarData.map(item => (
                <div key={item.id}>
                  <button
                    onClick={() => item.childData && toggleExpand(item.id)}
                    className={`w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-white/20 transition ${
                      pathname === item.path ? 'bg-white/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <Link href={item.path}>{item.name}</Link>
                    </div>
                    {item.childData && <span>{expandedItem === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>}
                  </button>

                  {/* Accordion */}
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
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ===== Sidebar Toggle Button (Desktop) ===== */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="hidden md:block absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
        >
          <Menu size={20} />
        </button>
      )}

      {/* ===== Main Content ===== */}
      <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-1 p-6 md:p-10 text-white">
        {children}
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

      {/* ===== Mobile Sidebar Overlay ===== */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex"
          >
            <motion.aside
              initial={{ x: -200 }}
              animate={{ x: 0 }}
              exit={{ x: -200 }}
              transition={{ duration: 0.4 }}
              className="w-64 bg-white/10 backdrop-blur-xl text-white p-4 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X size={22} />
                </button>
              </div>

              <nav className="flex flex-col space-y-2">
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
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
