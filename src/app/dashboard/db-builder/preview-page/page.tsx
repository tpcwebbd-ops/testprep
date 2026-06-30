/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { Suspense } from 'react';

import { PreviewPageContent } from '../../[...slug]/PreviewPageContent';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-transparent text-white">Loading...</div>}>
      <PreviewPageContent />
    </Suspense>
  );
}
