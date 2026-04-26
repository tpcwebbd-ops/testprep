'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';

export default function GtmRouteChange() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const query = searchParams.toString();
    const page = query ? `${pathname}?${query}` : pathname;
    sendGTMEvent({
      event: 'virtual_page_view',
      page_path: pathname,
      page_query: query,
      page_location: window.location.href,
      page_title: document.title,
      page,
    });
  }, [pathname, searchParams]);

  return null;
}
