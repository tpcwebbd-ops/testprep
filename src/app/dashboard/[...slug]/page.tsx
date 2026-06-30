/*
|-----------------------------------------
| setting up Dynamic DB Preview Page
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useMemo, Suspense } from 'react';
import { useParams } from 'next/navigation';

import { PreviewPageContent } from './PreviewPageContent';

function DynamicDbPageContent() {
  const params = useParams<{ slug?: string[] }>();

  const pathTitle = useMemo(() => {
    const slugParts = Array.isArray(params.slug) ? params.slug : [];
    const suffix = slugParts.filter(Boolean).join('/');
    return suffix ? `/dashboard/${suffix}` : '/dashboard';
  }, [params.slug]);

  return <PreviewPageContent pathTitleOverride={pathTitle} notFoundTitle="Database Not Found" />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-transparent text-white">Loading...</div>}>
      <DynamicDbPageContent />
    </Suspense>
  );
}
