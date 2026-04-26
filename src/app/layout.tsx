/*
|-----------------------------------------
| setting up Layout for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { Suspense } from 'react';
import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import { GoogleTagManager } from '@next/third-parties/google';

import { ReduxProvider } from '@/redux/provider';

import PWAPopup from '@/components/common/PWAPopUp';
import FooterServer from '@/components/common/FooterServer';
import MenuComponentWithSession from '@/components/common/MenuWithSession';
import GtmRouteChange from '@/components/gtm-route-change';

import './globals.css';

export const metadata: Metadata = {
  title: 'TestPrep Center',
  description: 'Excel with TestPrep',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192x192.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body className="antialiased font-sans bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white min-h-screen flex flex-col">
        <ReduxProvider>
          <MenuComponentWithSession />
          <main className=" animate-in fade-in duration-500">{children}</main>
          <FooterServer />
          <PWAPopup />
        </ReduxProvider>
        <Suspense fallback={null}>
          <GtmRouteChange />
        </Suspense>
        <Toaster position="top-right" richColors closeButton theme="light" />
        <ToastContainer style={{ top: '80px', zIndex: 9999 }} toastClassName="backdrop-blur-md bg-white/90 shadow-xl border border-slate-100 rounded-xl" />
      </body>
    </html>
  );
}
