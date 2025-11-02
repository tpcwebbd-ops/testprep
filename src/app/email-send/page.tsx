'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function EmailSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700" />

      <Card
        className={`max-w-md w-full p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-700 relative ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-white/5 pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="relative">
            <div
              className={`absolute inset-0 bg-emerald-400/40 rounded-full blur-2xl transition-all duration-1000 ${
                mounted ? 'scale-150 opacity-100' : 'scale-50 opacity-0'
              }`}
            />
            <div
              className={`relative bg-gradient-to-br from-emerald-400 to-green-500 rounded-full p-6 shadow-[0_8px_32px_0_rgba(34,197,94,0.4)] border border-white/30 backdrop-blur-sm transition-all duration-700 delay-200 ${
                mounted ? 'scale-100 rotate-0' : 'scale-0 -rotate-180'
              }`}
            >
              <CheckCircle2 className={`w-16 h-16 text-white transition-all duration-500 delay-500 ${mounted ? 'scale-100' : 'scale-0'}`} />
            </div>
          </div>

          <div className={`space-y-2 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">Email Sent Successfully!</h1>
            <p className="text-white/90 text-lg drop-shadow">Your message has been delivered</p>
          </div>

          <div
            className={`flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-4 w-full shadow-lg transition-all duration-700 delay-500 ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
              <Mail className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white drop-shadow">Confirmation sent</p>
              <p className="text-xs text-white/80">Check your inbox for details</p>
            </div>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-3 w-full transition-all duration-700 delay-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl border border-white/20 backdrop-blur-sm transition-all duration-300"
            >
              <Link href="/">
                Return Home
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white hover:text-white transition-all duration-300"
            >
              <Link href="/contact">Send Another</Link>
            </Button>
          </div>

          <div className={`pt-4 transition-all duration-700 delay-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-xs text-white/70">We typically respond within 24 hours</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
