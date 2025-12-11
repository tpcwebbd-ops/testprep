// 'use client';

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Home, Settings, ChevronDown, ChevronRight, ChevronLeft, LogOut } from 'lucide-react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { signOut, useSession } from '@/lib/auth-client';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Button } from '@/components/ui/button';
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
// import { Separator } from '@/components/ui/separator';
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
// import { useFetchSidebar } from '../no need permission/useFetchSidebar';
// import { IDefaultSidebarItem } from './default-items';

// const SidebarMenuButton = ({
//   item,
//   isCollapsed,
//   isExpanded,
//   onExpand,
//   pathname,
// }: {
//   item: IDefaultSidebarItem;
//   isCollapsed: boolean;
//   isExpanded: boolean;
//   onExpand: (id: number) => void;
//   pathname: string;
// }) => {
//   const isActive = pathname === item.path;

//   const buttonContent = (
//     <button
//       onClick={() => item.children && onExpand(item.id)}
//       className={`w-full bg-glass flex items-center justify-between px-3 py-2 rounded-lg transition ${isActive ? 'bg-white/20' : ''}`}
//     >
//       <div className="flex items-center gap-3 justify-start w-full">
//         <span className="text-white shrink-0">{item.icon}</span>
//         {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
//       </div>
//       {!isCollapsed && item.children && (
//         <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
//           <ChevronDown size={16} />
//         </motion.div>
//       )}
//     </button>
//   );

//   if (isCollapsed && item.children) {
//     return (
//       <Tooltip>
//         <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
//         <TooltipContent side="right" align="start" className="bg-white/20 border border-white/30 text-white shadow-xl p-2 max-w-xs">
//           <div className="flex flex-col gap-1">
//             {item.children.map(child => (
//               <Link
//                 key={child.id}
//                 href={child.path}
//                 className={`flex items-center gap-2 px-2 py-1 rounded text-xs whitespace-nowrap transition ${
//                   pathname === child.path ? 'bg-white/30 text-white' : 'text-white/80 hover:text-white hover:bg-white/20'
//                 }`}
//               >
//                 {child.icon}
//                 {child.name}
//               </Link>
//             ))}
//           </div>
//         </TooltipContent>
//       </Tooltip>
//     );
//   }

//   return buttonContent;
// };

// const SidebarChild = ({ child, pathname, onClick }: { child: IDefaultSidebarItem; pathname: string; onClick?: () => void }) => {
//   const isActive = pathname === child.path;

//   return (
//     <Link
//       href={child.path}
//       onClick={onClick}
//       className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
//         isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
//       }`}
//     >
//       {child.icon}
//       {child.name}
//     </Link>
//   );
// };

// const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [expandedItem, setExpandedItem] = useState<number | null>(null);
//   const [loadingLogout, setLoadingLogout] = useState(false);

//   const pathname = usePathname();
//   const router = useRouter();
//   const session = useSession();

//   useEffect(() => {
//     if (!session?.data?.session && !session?.isPending) {
//       router.push('/login');
//     }
//   }, [session, router]);

//   const toggleExpand = (id: number) => {
//     setExpandedItem(expandedItem === id ? null : id);
//   };

//   const handleLogout = async () => {
//     setLoadingLogout(true);
//     await signOut();
//   };

//   const user = session?.data?.user;
//   const email = session?.data?.user?.email || '';
//   const sidebarItems = useFetchSidebar(email);

//   return (
//     <div className="fixed flex max-h-[calc(100vh-65px)] w-full pt-[65px]">
//       <div className="fixed inset-0 bg-linear-to-br from-indigo-500 via-purple-500 to-blue-500 -z-10" />

//       {/* Desktop Sidebar */}
//       <motion.aside
//         animate={{ width: isCollapsed ? '80px' : '280px' }}
//         transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
//         className="hidden md:flex flex-col backdrop-blur-xl bg-white/10 border-r border-white/20 text-white p-4 relative h-screen overflow-visible"
//       >
//         <div className="absolute -right-4 top-6 z-10">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="rounded-full bg-white/20 min-w-1 hover:bg-white/30 text-white border-0"
//           >
//             {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
//           </Button>
//         </div>

//         <div className={`transition-all duration-300 mb-6 ${isCollapsed ? 'text-center' : ''}`}>
//           <h1 className="text-xl font-bold text-white">{isCollapsed ? 'DB' : 'Dashboard'}</h1>
//         </div>

//         <Separator className="bg-white/10 mb-4" />

//         <ScrollArea className="flex-1 overflow-visible">
//           <nav className="flex flex-col space-y-2 pr-3 overflow-visible">
//             {sidebarItems.map(item => (
//               <div key={item.id}>
//                 {item.children ? (
//                   <>
//                     <SidebarMenuButton
//                       item={item}
//                       isCollapsed={isCollapsed}
//                       isExpanded={expandedItem === item.id}
//                       onExpand={toggleExpand}
//                       pathname={pathname}
//                     />
//                     <AnimatePresence>
//                       {!isCollapsed && expandedItem === item.id && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: 'auto', opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           transition={{ duration: 0.2 }}
//                           className="ml-6 mt-1 flex flex-col space-y-1 overflow-hidden"
//                         >
//                           {item.children.map(child => (
//                             <SidebarChild key={child.id} child={child} pathname={pathname} />
//                           ))}
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </>
//                 ) : (
//                   <Link href={item.path} className="w-full">
//                     <SidebarMenuButton item={item} isCollapsed={isCollapsed} isExpanded={false} onExpand={() => {}} pathname={pathname} />
//                   </Link>
//                 )}
//               </div>
//             ))}
//           </nav>
//         </ScrollArea>

//         {user && (
//           <div className="absolute bottom-[60px] left-0 right-0 p-4 border-t border-white/20 bg-white/5">
//             <Separator className="bg-white/10" />
//             {isCollapsed ? (
//               <Button onClick={handleLogout} disabled={loadingLogout} variant="destructive" className="min-w-12 justify-center gap-2">
//                 <LogOut size={18} />
//               </Button>
//             ) : (
//               <Button onClick={handleLogout} disabled={loadingLogout} variant="destructive" className="w-full justify-center gap-2">
//                 <LogOut size={18} />
//                 {loadingLogout ? 'Logging out...' : 'Log out'}
//               </Button>
//             )}
//           </div>
//         )}
//       </motion.aside>

//       {/* Main Content */}
//       <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-1 md:pb-0 pb-20 text-white">
//         <ScrollArea className="w-full h-[calc(100vh-65px)]">
//           <div className="lg:p-10 p-4 pb-12">{children}</div>
//         </ScrollArea>
//       </motion.main>

//       {/* Mobile Bottom Navigation */}
//       <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/10 backdrop-blur-xl border-t border-white/20 flex justify-between items-center px-4 py-3 text-white z-40">
//         <Link href="/dashboard" className="flex items-center justify-center p-2 hover:bg-white/10 rounded-lg transition">
//           <Home size={24} />
//         </Link>

//         <div className="flex gap-3 items-center">
//           <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-10 w-10">
//             <span className="text-xl font-bold">B1</span>
//           </Button>
//           <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-10 w-10">
//             <span className="text-xl font-bold">B2</span>
//           </Button>
//         </div>

//         <Sheet>
//           <SheetTrigger asChild>
//             <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
//               <Settings size={24} />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="bg-white/10 backdrop-blur-xl border-white/20 text-white p-0 w-72 mt-[60px]">
//             <SheetHeader className="p-4 border-b border-white/20">
//               <SheetTitle className="text-white">Menu</SheetTitle>
//             </SheetHeader>
//             <ScrollArea className="h-[calc(100vh-80px)]">
//               <nav className="flex flex-col space-y-1 p-4">
//                 {sidebarItems.map(item => (
//                   <div key={item.id}>
//                     {item.children ? (
//                       <>
//                         <SidebarMenuButton item={item} isCollapsed={false} isExpanded={expandedItem === item.id} onExpand={toggleExpand} pathname={pathname} />
//                         <AnimatePresence>
//                           {expandedItem === item.id && (
//                             <motion.div
//                               initial={{ height: 0, opacity: 0 }}
//                               animate={{ height: 'auto', opacity: 1 }}
//                               exit={{ height: 0, opacity: 0 }}
//                               transition={{ duration: 0.2 }}
//                               className="ml-6 mt-1 flex flex-col space-y-1 overflow-hidden"
//                             >
//                               {item.children.map(child => (
//                                 <SheetTrigger asChild key={child.id}>
//                                   <SidebarChild child={child} pathname={pathname} />
//                                 </SheetTrigger>
//                               ))}
//                             </motion.div>
//                           )}
//                         </AnimatePresence>
//                       </>
//                     ) : (
//                       <SheetTrigger asChild>
//                         <Link href={item.path}>
//                           <SidebarMenuButton item={item} isCollapsed={false} isExpanded={false} onExpand={() => {}} pathname={pathname} />
//                         </Link>
//                       </SheetTrigger>
//                     )}
//                   </div>
//                 ))}
//               </nav>
//             </ScrollArea>
//             {user && (
//               <div className="absolute bottom-[60px] left-0 right-0 p-4 border-t border-white/20 bg-white/5">
//                 <Button onClick={handleLogout} disabled={loadingLogout} variant="destructive" className="w-full justify-center gap-2">
//                   <LogOut size={18} />
//                   {loadingLogout ? 'Logging out...' : 'Log out'}
//                 </Button>
//               </div>
//             )}
//           </SheetContent>
//         </Sheet>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
