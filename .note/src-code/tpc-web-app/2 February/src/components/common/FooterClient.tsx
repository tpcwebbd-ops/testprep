'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { AllFooter } from '@/components/all-footer/all-footer-index/all-footer';

// --- Types ---
interface DisabledPath {
  path: string;
  isExcluded: boolean;
  _id?: string;
}

interface FooterData {
  templateKey: string;
  content: string;
}

interface FooterResponseItem {
  _id: string;
  name: string;
  isEnabled: boolean;
  disabledPaths: DisabledPath[];
  data?: FooterData;
}

interface FooterClientProps {
  initialFooter: FooterResponseItem | null;
}

const FooterClient: React.FC<FooterClientProps> = ({ initialFooter }) => {
  const pathname = usePathname();

  // 1. Hardcoded Dashboard Check
  // Always return null immediately for dashboard to avoid flashing
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  // 2. Check if no footer is configured/enabled
  if (!initialFooter || !initialFooter.data) {
    // Optional: You might want to return null here for production
    // to avoid showing an error to users if no footer is set.
    return (
      <div className="w-full py-12 bg-neutral-950 border-t border-neutral-800 flex items-center justify-center text-neutral-400">
        <div className="flex flex-col items-center gap-2">
          <AlertTriangle size={24} className="text-amber-500" />
          <p className="text-sm font-medium">Footer not configured</p>
        </div>
      </div>
    );
  }

  // 3. Dynamic Path Exclusion Check
  const isPathDisabled = initialFooter.disabledPaths?.some(rule => rule.isExcluded && rule.path === pathname);

  if (isPathDisabled) {
    return null;
  }

  // 4. Render the Specific Template
  const { templateKey, content } = initialFooter.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TemplateConfig = (AllFooter as any)[templateKey];

  if (!TemplateConfig || !TemplateConfig.query) {
    return (
      <div className="w-full py-12 bg-neutral-950 border-t border-neutral-800 flex items-center justify-center text-neutral-400">
        <p>
          Template <strong>{templateKey}</strong> not found.
        </p>
      </div>
    );
  }

  const QueryComponent = TemplateConfig.query;

  return <QueryComponent data={content} />;
};

export default FooterClient;
