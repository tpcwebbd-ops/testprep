import { PageResponse } from '@/types/page-builder';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/page-builder/v1';

export async function fetchAllPages(): Promise<PageResponse> {
  const res = await fetch(API_BASE_URL);

  if (!res.ok) {
    throw new Error('Failed to fetch pages');
  }

  return res.json();
}

export function findPageByPath(pages: PageResponse['data']['pages'], pathSegments: string[]) {
  const fullPath = '/' + pathSegments.join('/');

  for (const page of pages) {
    if (page.pagePath === fullPath && page.isActive) {
      return { type: 'page' as const, data: page };
    }

    for (const subPage of page.subPage) {
      const subPageFullPath = page.pagePath === '/' ? subPage.pagePath : `${page.pagePath}${subPage.pagePath}`;

      if (subPageFullPath === fullPath && subPage.isActive) {
        return { type: 'subpage' as const, data: subPage, parent: page };
      }
    }
  }

  return null;
}
