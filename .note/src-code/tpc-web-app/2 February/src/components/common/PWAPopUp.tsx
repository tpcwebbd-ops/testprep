'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Clock, Smartphone, Zap, ShieldCheck } from 'lucide-react';

interface ButtonConfig {
  text: string;
  bgColor: string;
  textColor: string;
  size: 'small' | 'medium' | 'large';
  animation: 'none' | 'pulse' | 'bounce' | 'ping';
}

interface ConfigState {
  isEnabled: boolean;
  title: string;
  description: string;
  installBtn: ButtonConfig;
  laterBtn: ButtonConfig;
}

// Default configuration used if API is not found
const defaultConfig: ConfigState = {
  isEnabled: true,
  title: 'Install Application',
  description: 'Add to your home screen for the best experience, offline access, and lightning fast navigation.',
  installBtn: { text: 'Install Now', bgColor: '#4F46E5', textColor: '#FFFFFF', size: 'medium', animation: 'none' },
  laterBtn: { text: 'Maybe Later', bgColor: 'transparent', textColor: '#9CA3AF', size: 'medium', animation: 'none' },
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PWAPopUp() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [config, setConfig] = useState<ConfigState>(defaultConfig);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  // 1. Initialize & Fetch Configuration
  useEffect(() => {
    setIsMounted(true);

    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/pwa-pop-up');
        if (res.ok) {
          const data = await res.json();
          // If data exists, use it; otherwise fallback to default
          if (data && !data.error) {
            setConfig(data);
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.warn('PWA Config fetch failed, using default settings.');
      } finally {
        // Mark config as loaded regardless of success/failure
        setIsConfigLoaded(true);
      }
    };

    fetchConfig();
  }, []);

  // 2. Capture the PWA Install Event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // 3. Determine Visibility based on Logic
  useEffect(() => {
    // Wait for config and mount
    if (!isConfigLoaded || !isMounted) return;

    // If admin disabled it, do not show
    if (!config.isEnabled) return;

    // Only show if the browser fired the install event (app is installable)
    if (!deferredPrompt) return;

    // Check "Maybe Later" timer
    const nextShowTime = localStorage.getItem('pwa_popup_next_show');
    const now = new Date().getTime();

    // Show if no timer exists OR if current time is past the timer
    if (!nextShowTime || now > parseInt(nextShowTime, 10)) {
      setIsVisible(true);
    }
  }, [isConfigLoaded, isMounted, deferredPrompt, config.isEnabled]);

  // Handler: Install Button
  // Logic: Installs app. On success, it will not pop up again (browser stops firing event).
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  // Handler: Cross Button
  // Logic: Close now. Re-appears on next render (no localStorage set).
  const handleCross = () => {
    setIsVisible(false);
  };

  // Handler: Maybe Later
  // Logic: Close now. Re-appears after 24 hours.
  const handleMaybeLater = () => {
    const nextShow = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 Hours
    localStorage.setItem('pwa_popup_next_show', nextShow.toString());
    setIsVisible(false);
  };

  // Helper for dynamic styles
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'px-3 py-2 text-xs';
      case 'large':
        return 'px-6 py-4 text-lg';
      default:
        return 'px-4 py-3 text-sm';
    }
  };

  const getAnimClass = (anim: string) => {
    switch (anim) {
      case 'pulse':
        return 'animate-pulse';
      case 'bounce':
        return 'animate-bounce';
      case 'ping':
        return 'animate-ping';
      default:
        return '';
    }
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleCross}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md"
          >
            <div className="relative overflow-hidden bg-[#0F0F11] border border-white/10 shadow-2xl rounded-3xl p-6 md:p-8 isolate">
              {/* Cross Button (Top Right) */}
              <div className="absolute top-0 right-0 p-4 z-20">
                <button
                  onClick={handleCross}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Background Effects */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none -z-10" />
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -z-10" />

              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="relative mb-6 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative w-20 h-20 rounded-2xl bg-[#0F0F11] flex items-center justify-center border border-white/10 shadow-xl">
                    <Smartphone className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-[#0F0F11] p-1.5 rounded-lg border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                  </div>
                </div>

                {/* Content from API or Default */}
                <h3 className="text-2xl font-bold text-white mb-2">{config.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-[280px]">{config.description}</p>

                {/* Buttons */}
                <div className="w-full space-y-3">
                  {/* 1. Install Button */}
                  <button
                    onClick={handleInstall}
                    style={{ backgroundColor: config.installBtn.bgColor, color: config.installBtn.textColor }}
                    className={`w-full relative overflow-hidden rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-transform active:scale-[0.98] group flex items-center justify-center gap-2 ${getSizeClasses(config.installBtn.size)} ${getAnimClass(config.installBtn.animation)}`}
                  >
                    <Download className="w-4 h-4" />
                    {config.installBtn.text}
                    {config.installBtn.animation === 'none' && <Zap className="w-3 h-3 fill-current hidden group-hover:block animate-bounce" />}
                  </button>

                  {/* 2. Maybe Later Button */}
                  <button
                    onClick={handleMaybeLater}
                    style={{ backgroundColor: config.laterBtn.bgColor, color: config.laterBtn.textColor }}
                    className={`w-full rounded-xl font-semibold border border-white/5 hover:border-white/10 transition-all duration-200 flex items-center justify-center gap-2 ${getSizeClasses(config.laterBtn.size)} ${getAnimClass(config.laterBtn.animation)}`}
                  >
                    <Clock className="w-4 h-4" />
                    {config.laterBtn.text}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
