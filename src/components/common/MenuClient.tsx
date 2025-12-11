'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Info,
  FolderKanban,
  Phone,
  Settings,
  HelpCircle,
  Users,
  LayoutDashboard,
  LogIn,
  LucideIcon,
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import Image from 'next/image';

type BrandFontSize = 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
type BrandFontFamily = 'font-sans' | 'font-serif' | 'font-mono';

interface MenuItem {
  id: number;
  name: string;
  path: string;
  iconName?: string;
  imagePath?: string;
  isImagePublish?: boolean;
  isIconPublish?: boolean;
  _id?: string;
  children?: MenuItem[];
}

interface BrandConfiguration {
  brandName: string;
  logoUrl: string | null;
  textColor: string;
  fontSize: BrandFontSize;
  fontFamily: BrandFontFamily;
}

interface MenuClientProps {
  initialBrandConfig: BrandConfiguration;
  initialMenuItems: MenuItem[];
}

const IconMapper = ({ name, className }: { name?: string; className?: string }) => {
  const iconMap: { [key: string]: LucideIcon } = {
    Info,
    FolderKanban,
    Menu,
    Phone,
    Settings,
    HelpCircle,
    Users,
    LayoutDashboard,
  };

  const IconComponent = name ? iconMap[name] || HelpCircle : HelpCircle;
  return <IconComponent className={className} />;
};

const DesktopMenuItem = ({ item, isActive, depth = 0 }: { item: MenuItem; isActive: (path: string) => boolean; depth?: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const active = isActive(item.path);
  const isRoot = depth === 0;

  const showImage = item.imagePath && item.isImagePublish !== false;
  const showIcon = !isRoot && item.iconName && item.isIconPublish !== false;

  return (
    <div className="relative z-50" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Link
        href={item.path}
        className={`
          group flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 rounded-full
          ${
            active
              ? 'text-sky-200 bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,0.2)] border border-sky-500/30'
              : 'text-sky-100/80 hover:text-sky-50 hover:bg-sky-500/5 border border-transparent hover:border-sky-500/20'
          }
          ${!isRoot && 'justify-between w-full rounded-lg hover:bg-sky-500/10'}
        `}
      >
        <div className="flex items-center gap-3">
          {showImage ? (
            <div className={`relative overflow-hidden rounded border border-sky-500/20 flex-shrink-0 shadow-sm ${isRoot ? 'w-8 h-5' : 'w-10 h-6'}`}>
              <Image src={item.imagePath!} alt={item.name} fill className="object-cover" sizes="50px" />
            </div>
          ) : (
            showIcon && <IconMapper name={item.iconName} className="w-4 h-4 text-sky-400" />
          )}

          <span className="relative z-10">{item.name}</span>
        </div>

        {hasChildren &&
          (isRoot ? (
            <ChevronDown size={14} className={`text-sky-400 transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} />
          ) : (
            <ChevronRight size={14} className="text-sky-400/70" />
          ))}

        {active && isRoot && (
          <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
        )}
      </Link>

      <AnimatePresence>
        {isHovered && hasChildren && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'circOut' }}
            className={`
              absolute p-2 min-w-[240px]
              bg-[#0a1224]/95 backdrop-blur-2xl
              border border-sky-500/20
              rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]
              box-border
              ${isRoot ? 'top-full left-0 mt-2' : 'left-full top-0 ml-2'}
            `}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-1">
              {item.children?.map(child => (
                <DesktopMenuItem key={child._id || child.id} item={child} isActive={isActive} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileMenuItem = ({ item, pathname, onNavigate, level = 0 }: { item: MenuItem; pathname: string; onNavigate: () => void; level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.path;

  const renderVisual = () => {
    if (item.imagePath && item.isImagePublish !== false) {
      return (
        <div className="relative w-10 h-6 rounded overflow-hidden flex-shrink-0 border border-sky-500/20 shadow-sm">
          <Image src={item.imagePath} alt={item.name} fill className="object-cover" />
        </div>
      );
    }
    if (item.iconName && item.isIconPublish !== false) {
      return <IconMapper name={item.iconName} className="w-5 h-5 text-sky-400" />;
    }
    return null;
  };

  if (!hasChildren) {
    return (
      <Link href={item.path} onClick={onNavigate}>
        <motion.div
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-3 px-4 py-3.5 my-1 text-base font-medium rounded-xl transition-all border border-transparent ${
            isActive
              ? 'bg-sky-500/15 text-sky-100 border-sky-500/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]'
              : 'text-sky-200/70 hover:bg-sky-500/5 hover:text-sky-100'
          }`}
          style={{ paddingLeft: `${1 + level}rem` }}
        >
          {renderVisual()}
          {item.name}
        </motion.div>
      </Link>
    );
  }

  return (
    <div className="my-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-xl transition-all border border-transparent ${
          isOpen ? 'text-sky-100 bg-sky-950/50 border-sky-500/10' : 'text-sky-200/70 hover:bg-sky-500/5 hover:text-sky-100'
        }`}
        style={{ paddingLeft: `${1 + level}rem` }}
      >
        <div className="flex items-center gap-3">
          {renderVisual()}
          {item.name}
        </div>
        <ChevronDown size={18} className={`text-sky-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black/10 rounded-lg mx-1"
          >
            <div className="py-1 flex flex-col">
              {item.children?.map(child => (
                <MobileMenuItem key={child._id || child.id} item={child} pathname={pathname} onNavigate={onNavigate} level={level + 0.8} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuClient: React.FC<MenuClientProps> = ({ initialBrandConfig, initialMenuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [brandConfig, setBrandConfig] = useState<BrandConfiguration>(initialBrandConfig);
  const [menuItems] = useState<MenuItem[]>(initialMenuItems);

  const pathname = usePathname();
  const session = useSession();
  const isLoggedIn = !!session?.data?.session;

  useEffect(() => {
    const fetchBrandSettings = async () => {
      try {
        const response = await fetch('/api/brand-settings', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (data) setBrandConfig(data);
        }
      } catch (error) {
        console.error('Update fetch error', error);
      }
    };
    const handleUpdate = () => fetchBrandSettings();
    if (typeof window !== 'undefined') {
      window.addEventListener('brand-settings-updated', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('brand-settings-updated', handleUpdate);
      }
    };
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-gradient-to-r from-blue-950/80 via-sky-900/60 to-blue-950/80 backdrop-blur-xl border-b border-sky-400/20 shadow-[0_4px_30px_rgba(56,189,248,0.15)]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Link href="/" className="group relative flex items-center gap-3 z-50">
            {brandConfig.logoUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={brandConfig.logoUrl}
                className="relative h-10 w-auto lg:h-12"
              >
                <Image
                  src={brandConfig.logoUrl}
                  alt={brandConfig.brandName}
                  width={120}
                  height={60}
                  className="h-full w-auto object-contain drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                  priority
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                className="bg-gradient-to-tr from-sky-400 to-blue-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:scale-105 transition-transform"
              >
                <GraduationCap className="text-white w-6 h-6 lg:w-7 lg:h-7" />
              </motion.div>
            )}

            <div className="flex flex-col">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  ${brandConfig.fontSize} ${brandConfig.fontFamily}
                  font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-100 via-sky-300 to-sky-100 drop-shadow-sm
                `}
              >
                {brandConfig.brandName}
              </motion.span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map(item => (
              <DesktopMenuItem key={item._id || item.id} item={item} isActive={isActive} />
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="hidden lg:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] border border-sky-400/30 transition-all"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </motion.button>
              </Link>
            ) : (
              <Link href="/login" className="hidden lg:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-sky-200 bg-blue-950/50 backdrop-blur-md rounded-full border border-sky-400/40 hover:bg-sky-900/40 hover:text-sky-100 hover:border-sky-300 transition-all shadow-lg shadow-sky-900/20"
                >
                  <LogIn size={16} />
                  Login
                </motion.button>
              </Link>
            )}

            <div className="flex lg:hidden items-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-sky-200 hover:text-white transition-colors focus:outline-none rounded-full hover:bg-white/10"
                onClick={() => setIsOpen(!isOpen)}
              >
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                  {isOpen ? <X size={28} /> : <Menu size={28} />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="lg:hidden bg-gradient-to-b from-blue-950/95 via-[#0c1f3a]/95 to-blue-950/95 backdrop-blur-3xl border-t border-sky-400/20 shadow-2xl overflow-hidden absolute w-full left-0 top-16"
          >
            <div className="flex flex-col p-4 space-y-2 max-h-[85vh] overflow-y-auto custom-scrollbar">
              {menuItems.map(item => (
                <MobileMenuItem key={item._id || item.id} item={item} pathname={pathname} onNavigate={() => setIsOpen(false)} />
              ))}

              <div className="h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent my-6" />

              {isLoggedIn ? (
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center justify-center gap-3 px-4 py-3.5 text-base font-bold text-white bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl shadow-lg shadow-sky-500/20 active:scale-95 transition-all">
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </div>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center justify-center gap-3 px-4 py-3.5 text-base font-bold text-sky-200 border border-sky-500/30 bg-sky-900/20 rounded-xl active:scale-95 transition-all">
                    <LogIn className="w-5 h-5" />
                    Login
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MenuClient;
