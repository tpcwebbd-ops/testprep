/*
|-----------------------------------------
| setting up SiteNavLayoutClickV4 for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { sidebarDataHome } from './sidebar-data';
import Link from 'next/link';

export default function SiteNavLayoutClickV4({ children = null as React.ReactNode }) {
  const [openCategories, setOpenCategories] = useState<{ [key: string | number]: boolean }>({});

  const toggleCategory = (id: string | number) => {
    setOpenCategories(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allSidebarData = sidebarDataHome;

  return (
    <div className="flex">
      <div className="w-64 bg-slate-800 text-white h-screen overflow-y-auto pb-8">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>
        <nav className="mt-2">
          {allSidebarData.map(category => (
            <div key={category.id} className="mb-1">
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-slate-700 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-blue-400">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="transform transition-transform duration-200 ease-in-out">
                  {openCategories[category.id] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openCategories[category.id] ? `max-h-${category.content.length * 12} opacity-100` : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pl-12 py-1">
                  {category.content.map(item => (
                    <Link
                      key={item.id}
                      href={item.link || ''}
                      className="flex items-center py-2 px-4 hover:bg-slate-700 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      <span className="text-xs text-gray-400 mr-2">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-6 bg-slate-100">
        {children ? (
          children
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
            <p className="text-gray-600">Select a menu item from the sidebar to navigate.</p>
          </div>
        )}
      </div>
    </div>
  );
}
