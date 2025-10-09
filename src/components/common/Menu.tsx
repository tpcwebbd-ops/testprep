'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const MenuComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuData = [
    { id: 1, name: 'About', path: '/about' },
    { id: 2, name: 'Login', path: '/login' },
    { id: 3, name: 'SignUp', path: '/registration' },
    { id: 4, name: 'Dashboard', path: '/dashboard' },
    { id: 5, name: 'F Pass', path: '/forget-password' },
    { id: 6, name: 'Verify', path: '/verify' },
  ];
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4">
        {/* Wrapper */}
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link href="/" className="text-xl font-bold text-gray-900">
            TestPrep Center (TPC)
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {menuData.map(item => (
              <Link key={item.id} href={item.path} className="text-gray-700 hover:text-blue-600 transition-colors">
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700 focus:outline-none" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
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
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-white shadow-lg border-t border-gray-200"
          >
            <div className="flex flex-col p-4 space-y-3">
              {menuData.map(item => (
                <Link key={item.id} href={item.path} onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600 transition-colors">
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

export default MenuComponent;
