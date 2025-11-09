'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Save, Check, X } from 'lucide-react';
import AdminSection1 from './all-section/section-1/Admin';
import ClientSection1 from './all-section/section-1/Client';
import AdminSection2 from './all-section/section-2/Admin';
import ClientSection2 from './all-section/section-2/Client';

interface SectionData {
  id: number;
  title: string;
  adminPath: React.ReactNode;
  clientPath: React.ReactNode;
  isActive: boolean;
  picture: string;
}

const initialSectionData: SectionData[] = [
  {
    id: 1,
    title: 'Section 1',
    adminPath: <AdminSection1 />,
    clientPath: <ClientSection1 />,
    isActive: true,
    picture: '/all-section/section-1.png',
  },
  {
    id: 2,
    title: 'Section 2',
    adminPath: <AdminSection2 />,
    clientPath: <ClientSection2 />,
    isActive: false,
    picture: '/all-section/section-2.png',
  },
];

const Page = () => {
  const [allSectionData, setAllSectionData] = useState<SectionData[]>(initialSectionData);
  const [selectedTab, setSelectedTab] = useState<'admin' | 'client'>('admin');
  const [activeSection, setActiveSection] = useState<number>(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleActive = (id: number) => {
    setAllSectionData(prev => prev.map(section => (section.id === id ? { ...section, isActive: !section.isActive } : section)));
  };

  const handleUpdate = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const currentSection = allSectionData.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ">
      <div className="flex">
        <aside className="fixed left-[288px] top-[65px] h-screen w-80 bg-white/10 backdrop-blur-xl border-r border-white/20 overflow-y-auto">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">All Sections</h2>
          </div>

          <nav className="p-4 space-y-3">
            {allSectionData.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                  activeSection === section.id ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-lg' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={section.picture} alt={section.title} fill className="object-cover" />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 ${
                        activeSection === section.id ? 'opacity-100' : 'opacity-0'
                      } transition-opacity duration-300`}
                    />
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className={`font-semibold transition-colors duration-300 ${activeSection === section.id ? 'text-white' : 'text-gray-300'}`}>
                      {section.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleActive(section.id);
                        }}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 ${
                          section.isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                            section.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`text-xs font-medium ${section.isActive ? 'text-purple-300' : 'text-gray-500'}`}>
                        {section.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        <main className="ml-80 flex-1">
          <div className="sticky top-[65px] z-30 bg-white/10 backdrop-blur-xl border-b border-white/20">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20">
                  {currentSection && <Image src={currentSection.picture} alt={currentSection.title} fill className="object-cover" />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{currentSection?.title}</h1>
                  <p className="text-gray-400 text-sm">Section Management Panel</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <button
                  onClick={() => setSelectedTab('admin')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    selectedTab === 'admin' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => setSelectedTab('client')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    selectedTab === 'client' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Client
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 px-0">
            <div className="rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
              {currentSection && (selectedTab === 'admin' ? currentSection.adminPath : currentSection.clientPath)}
            </div>
          </div>

          <div className="sticky bottom-0 p-6 bg-white/10 backdrop-blur-xl border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="text-gray-300">
                <p className="text-sm">
                  Active Sections: <span className="font-bold text-white">{allSectionData.filter(s => s.isActive).length}</span> / {allSectionData.length}
                </p>
              </div>

              <button
                onClick={handleUpdate}
                disabled={showSuccess}
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold overflow-hidden shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {showSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      Updated Successfully
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Changes
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>

          {showSuccess && (
            <div className="fixed top-6 right-6 z-50 animate-slide-in">
              <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl shadow-green-500/30">
                <Check className="w-6 h-6" />
                <span className="font-semibold">Changes saved successfully!</span>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Page;
