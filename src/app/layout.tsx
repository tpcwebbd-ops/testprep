import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '@/redux/provider';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'sonner';
import MenuComponentWithSession from '@/components/common/MenuWithSession';
import FooterServer from '@/components/common/FooterServer';
import PWAPopup from '@/components/common/PWAPopUp';

export const metadata: Metadata = {
  title: 'TestPrep Center',
  description: 'Achieve your desired IELTS band score',
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
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white min-h-screen flex flex-col">
        <ReduxProvider>
          <MenuComponentWithSession />
          <main className=" animate-in fade-in duration-500">{children}</main>
          <FooterServer />
          <PWAPopup />
        </ReduxProvider>
        <Toaster position="top-right" richColors closeButton theme="light" />
        <ToastContainer style={{ top: '80px', zIndex: 9999 }} toastClassName="backdrop-blur-md bg-white/90 shadow-xl border border-slate-100 rounded-xl" />
      </body>
    </html>
  );
}
