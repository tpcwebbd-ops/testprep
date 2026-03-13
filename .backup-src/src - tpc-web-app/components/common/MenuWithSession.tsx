import React from 'react';
import { getBrandSettings } from '@/app/api/brand-settings/controller';
// Import the cached data function directly from your controller
import { getMenuData } from '@/app/api/menu-editor/controller';
import MenuClient from './MenuClient';
import connectDB from '@/app/api/utils/mongoose';

const MenuComponentWithSession = async () => {
  await connectDB();

  // 1. Fetch Brand Settings
  const rawSettings = await getBrandSettings();

  // 2. Fetch Menu Data (Server Side)
  // We call getMenuData directly. Since it uses unstable_cache,
  // Next.js will cache this result efficiently.
  const rawMenuData = await getMenuData('main-menu');

  // Extract items, default to empty array if null
  const menuItems = rawMenuData?.items || [];

  // 3. Serialize Data (Ensure plain JSON for Client Component)
  const brandSettings = JSON.parse(JSON.stringify(rawSettings));
  const serializedMenuItems = JSON.parse(JSON.stringify(menuItems));

  return <MenuClient initialBrandConfig={brandSettings} initialMenuItems={serializedMenuItems} />;
};

export default MenuComponentWithSession;
