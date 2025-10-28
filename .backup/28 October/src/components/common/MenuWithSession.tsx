'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

const MenuComponentWithSession = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();

  const logInMenuData = [
    { id: 1, name: 'About', path: '/about' },
    { id: 2, name: 'Course', path: '/course' },
    { id: 3, name: 'Contact', path: '/contact' },
    { id: 4, name: 'Service', path: '/service' },
    { id: 5, name: 'Dashboard', path: '/dashboard' },
  ];

  const notLogInMenuData = [
    { id: 1, name: 'About', path: '/about' },
    { id: 2, name: 'Course', path: '/course' },
    { id: 3, name: 'Contact', path: '/contact' },
    { id: 4, name: 'Service', path: '/service' },
    { id: 5, name: 'Login', path: '/login' },
  ];

  const menuData = session?.data?.session ? logInMenuData : notLogInMenuData;

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-[100]
        bg-gradient-to-r from-blue-950/60 via-sky-900/40 to-blue-950/60
        backdrop-blur-xl border-b border-sky-400/30
        shadow-[0_4px_30px_rgba(56,189,248,0.15)]
      "
    >
      <div className="container mx-auto px-4">
        {/* Wrapper */}
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="text-lg md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-300 to-sky-200 drop-shadow-lg hover:opacity-90 transition-opacity"
          >
            TestPrep Centre
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {menuData.map(item => (
              <Link
                key={item.id}
                href={item.path}
                className="
                  relative text-sky-100 font-medium tracking-wide transition-all duration-300
                  hover:text-sky-300
                  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px]
                  after:bg-gradient-to-r after:from-sky-400 after:to-blue-500 after:transition-all after:duration-300
                  hover:after:w-full
                "
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-sky-100 hover:text-sky-300 transition-colors focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="
              md:hidden 
              bg-gradient-to-b from-blue-950/80 via-sky-900/70 to-blue-950/80 
              backdrop-blur-xl border-t border-sky-400/20
              shadow-lg shadow-sky-800/20
            "
          >
            <div className="flex flex-col p-5 space-y-4">
              {menuData.map(item => (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="
                    text-sky-100 text-base font-medium tracking-wide
                    hover:text-sky-300 hover:translate-x-1 transition-all duration-300
                  "
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MenuComponentWithSession;
