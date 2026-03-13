here is example of MenuClient.tsx 
```
'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  menuTextColor: string;
  menuFontSize: BrandFontSize;
  menuFontFamily: BrandFontFamily;
  menuBackgroundColor: string;
  backgroundTransparent: number;
  menuSticky: boolean;
}

interface MenuClientProps {
  initialBrandConfig: BrandConfiguration;
  initialMenuItems: MenuItem[];
}

const IconMapper = ({ name, className, color }: { name?: string; className?: string; color?: string }) => {
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
  return <IconComponent className={className} style={{ color }} />;
};

const hexToRgba = (hex: string, opacity: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
};

const DesktopMenuItem = ({ 
  item, 
  isActive, 
  depth = 0, 
  config 
}: { 
  item: MenuItem; 
  isActive: (path: string) => boolean; 
  depth?: number;
  config: BrandConfiguration;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const active = isActive(item.path);
  const isRoot = depth === 0;

  const showImage = item.imagePath && item.isImagePublish !== false;
  const showIcon = item.iconName && item.isIconPublish !== false;

  return (
    <div 
      className="relative z-50 h-full flex items-center" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={item.path}
        className={`
          group flex items-center gap-2 px-4 py-2 transition-all duration-300 rounded-xl
          ${config.menuFontSize} ${config.menuFontFamily}
          ${!isRoot && 'justify-between w-full rounded-lg h-auto'}
        `}
        style={{ 
          color: active ? config.textColor : config.menuTextColor,
          backgroundColor: isHovered ? hexToRgba(config.menuTextColor, 10) : 'transparent'
        }}
      >
        <div className="flex items-center gap-3">
          {showImage ? (
            <div className={`relative overflow-hidden rounded flex-shrink-0 ${isRoot ? 'w-8 h-5' : 'w-10 h-6'}`}>
              <Image src={item.imagePath!} alt={item.name} fill className="object-cover" sizes="50px" />
            </div>
          ) : (
            showIcon && <IconMapper name={item.iconName} className="w-4 h-4" color={active ? config.textColor : config.menuTextColor} />
          )}
          <span className="relative z-10 whitespace-nowrap">{item.name}</span>
        </div>

        {hasChildren && (
          isRoot ? (
            <ChevronDown size={14} style={{ color: config.menuTextColor }} className={`transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} />
          ) : (
            <ChevronRight size={14} style={{ color: config.menuTextColor }} />
          )
        )}
      </Link>

      <AnimatePresence>
        {isHovered && hasChildren && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute p-2 min-w-[220px] rounded-2xl shadow-2xl border"
            style={{ 
              backgroundColor: config.menuBackgroundColor,
              borderColor: hexToRgba(config.menuTextColor, 20),
              top: isRoot ? '100%' : '0',
              left: isRoot ? '0' : '100%',
              marginTop: isRoot ? '0.5rem' : '0',
              marginLeft: isRoot ? '0' : '0.5rem',
            }}
          >
            <div className="relative z-10 flex flex-col gap-1">
              {item.children?.map(child => (
                <DesktopMenuItem key={child._id || child.id} item={child} isActive={isActive} depth={depth + 1} config={config} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileMenuItem = ({ 
  item, 
  pathname, 
  onNavigate, 
  level = 0,
  config
}: { 
  item: MenuItem; 
  pathname: string; 
  onNavigate: () => void; 
  level?: number;
  config: BrandConfiguration;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.path;

  const renderVisual = () => {
    if (item.imagePath && item.isImagePublish !== false) {
      return (
        <div className="relative w-10 h-6 rounded overflow-hidden flex-shrink-0">
          <Image src={item.imagePath} alt={item.name} fill className="object-cover" />
        </div>
      );
    }
    if (item.iconName && item.isIconPublish !== false) {
      return <IconMapper name={item.iconName} className="w-5 h-5" color={isActive ? config.textColor : config.menuTextColor} />;
    }
    return null;
  };

  if (!hasChildren) {
    return (
      <Link href={item.path} onClick={onNavigate}>
        <motion.div
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-3 px-4 py-4 my-1 rounded-xl transition-all ${config.menuFontSize} ${config.menuFontFamily}`}
          style={{ 
            paddingLeft: `${1 + level}rem`,
            color: isActive ? config.textColor : config.menuTextColor,
            backgroundColor: isActive ? hexToRgba(config.textColor, 10) : 'transparent'
          }}
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
        className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all ${config.menuFontSize} ${config.menuFontFamily}`}
        style={{ 
          paddingLeft: `${1 + level}rem`,
          color: config.menuTextColor,
          backgroundColor: isOpen ? hexToRgba(config.menuTextColor, 5) : 'transparent'
        }}
      >
        <div className="flex items-center gap-3">
          {renderVisual()}
          {item.name}
        </div>
        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="py-1 flex flex-col">
              {item.children?.map(child => (
                <MobileMenuItem key={child._id || child.id} item={child} pathname={pathname} onNavigate={onNavigate} level={level + 0.5} config={config} />
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
          if (data) setBrandConfig(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Fetch error', error);
      }
    };

    const handleUpdate = () => fetchBrandSettings();
    if (typeof window !== 'undefined') {
      window.addEventListener('brand-settings-updated', handleUpdate);
      fetchBrandSettings();
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('brand-settings-updated', handleUpdate);
      }
    };
  }, []);

  const isActive = (path: string) => pathname === path;

  const navStyles = useMemo(() => ({
    backgroundColor: hexToRgba(brandConfig.menuBackgroundColor, brandConfig.backgroundTransparent),
    position: (brandConfig.menuSticky ? 'fixed' : 'relative') as 'fixed' | 'relative',
    backdropFilter: brandConfig.backgroundTransparent < 100 ? 'blur(16px)' : 'none',
    borderBottom: `1px solid ${hexToRgba(brandConfig.menuTextColor, 10)}`
  }), [brandConfig]);

  return (
    <nav style={navStyles} className="top-0 left-0 w-full z-[100] transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 z-50">
            {brandConfig.logoUrl ? (
              <div className="relative h-10 w-auto lg:h-12">
                <Image
                  src={brandConfig.logoUrl}
                  alt={brandConfig.brandName}
                  width={140}
                  height={50}
                  className="h-full w-auto object-contain"
                  priority
                />
              </div>
            ) : (
              <div 
                className="p-2 rounded-xl"
                style={{ backgroundColor: brandConfig.textColor }}
              >
                <GraduationCap style={{ color: brandConfig.menuBackgroundColor }} className="w-6 h-6 lg:w-7 lg:h-7" />
              </div>
            )}

            <span
              className={`${brandConfig.fontSize} ${brandConfig.fontFamily} font-bold tracking-tight`}
              style={{ color: brandConfig.textColor }}
            >
              {brandConfig.brandName}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 h-full">
            {menuItems.map(item => (
              <DesktopMenuItem key={item._id || item.id} item={item} isActive={isActive} config={brandConfig} />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                    style={{ 
                      backgroundColor: brandConfig.textColor,
                      color: brandConfig.menuBackgroundColor
                    }}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </motion.button>
                </Link>
              ) : (
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all"
                    style={{ 
                      borderColor: hexToRgba(brandConfig.menuTextColor, 30),
                      color: brandConfig.menuTextColor,
                      backgroundColor: hexToRgba(brandConfig.menuTextColor, 5)
                    }}
                  >
                    <LogIn size={16} />
                    Login
                  </motion.button>
                </Link>
              )}
            </div>

            <button
              className="lg:hidden p-2 rounded-lg"
              style={{ color: brandConfig.menuTextColor }}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t"
            style={{ 
              backgroundColor: brandConfig.menuBackgroundColor,
              borderColor: hexToRgba(brandConfig.menuTextColor, 10)
            }}
          >
            <div className="flex flex-col p-4 space-y-1">
              {menuItems.map(item => (
                <MobileMenuItem key={item._id || item.id} item={item} pathname={pathname} onNavigate={() => setIsOpen(false)} config={brandConfig} />
              ))}

              <div className="pt-6 pb-2">
                {isLoggedIn ? (
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <div 
                      className="flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-bold"
                      style={{ backgroundColor: brandConfig.textColor, color: brandConfig.menuBackgroundColor }}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </div>
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <div 
                      className="flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-bold border"
                      style={{ 
                        borderColor: hexToRgba(brandConfig.menuTextColor, 20),
                        color: brandConfig.menuTextColor
                      }}
                    >
                      <LogIn className="w-5 h-5" />
                      Login
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MenuClient;
```

here is my old nav style 
```
    <nav className="fixed top-0 left-0 w-full z-[100] bg-gradient-to-r from-blue-950/90 via-sky-900/80 to-blue-950/90 backdrop-blur-xl border-b border-sky-400/20 shadow-[0_4px_30px_rgba(56,189,248,0.15)]">
```

and here is new nav style 
```
    <nav style={navStyles} className="top-0 left-0 w-full z-[100]  transition-all duration-300">
```
here is example of navStyles = 
```
{
    "backgroundColor": "rgba(NaN, 186, NaN, 1)",
    "position": "fixed",
    "backdropFilter": "none",
    "borderBottom": "1px solid rgba(0, 108, 240, 0.15)",
    "boxShadow": "0 4px 30px rgba(NaN, 186, NaN, 0.2)"
}
```
here is example of brandConfig = 
```
{
    "_id": "69ab5e1be3426dff081ebe9e",
    "__v": 0,
    "brandName": "Branding",
    "createdAt": "2026-03-06T23:07:06.628Z",
    "fontFamily": "font-serif",
    "fontSize": "text-2xl",
    "logoUrl": "https://i.ibb.co/JRpgHXYq/blob.jpg",
    "menuBackgroundColor": "rgba(15, 23, 42, 0.8)",
    "menuFontFamily": "font-serif",
    "menuFontSize": "text-lg",
    "menuSticky": true,
    "menuTextColor": "#006cf0",
    "textColor": "#38bdf8",
    "updatedAt": "2026-03-13T20:00:06.195Z",
    "backgroundTransparent": 100
}
```

This div is not working well. backgroundColor and backgroundTransparent is not working. it always transparent. and fix this. 