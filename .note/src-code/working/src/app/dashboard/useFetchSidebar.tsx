import { useEffect, useState, useCallback } from 'react';
import { defaultDashboardSidebarData, IDefaultSidebarItem } from './default-items';
import { useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';
import { useGetAccessManagementsQuery } from '@/redux/features/accessManagements/accessManagementsSlice';
import { useGetRolesQuery } from '@/redux/features/roles/rolesSlice';
import { iconMap } from '@/components/all-icons/all-icons';

type APISidebarItem = {
  _id?: string;
  sl_no?: number;
  name: string;
  path: string;
  iconName?: string;
  children?: APISidebarItem[];
};

export const useFetchSidebar = (email: string | null | undefined) => {
  const [sidebarData, setSidebarData] = useState<IDefaultSidebarItem[]>([]);

  // Queries
  const { data: allSidebarsQuery } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const { data: userAccessManagementQuery } = useGetAccessManagementsQuery({ user_email: email ?? '', page: 1, limit: 100 }, { skip: !email });
  const { data: allRolesQuery } = useGetRolesQuery({ page: 1, limit: 100 });

  // Convert API format to UI Sidebar format
  const convertAPISidebarItemsToIDefaultSidebarItems = useCallback(
    (arr: APISidebarItem[]): IDefaultSidebarItem[] =>
      arr.map(it => ({
        id: it.sl_no ?? 0,
        name: it.name,
        path: it.path,
        icon: iconMap[it.iconName || ''] ?? iconMap['settings'],
        children: it.children ? convertAPISidebarItemsToIDefaultSidebarItems(it.children) : undefined,
      })),
    [],
  );

  useEffect(() => {
    // 1. Session Check: If no email, allow Layout to handle redirect.
    // Just return defaults/empty to prevent crashes.
    if (!email) {
      setSidebarData(defaultDashboardSidebarData);
      return;
    }

    // Prepare Master List from API
    const apiSidebars = allSidebarsQuery?.data?.sidebars || [];
    const masterSidebarList = convertAPISidebarItemsToIDefaultSidebarItems(apiSidebars);

    // 2. Fetch User Roles
    const userRoles: string[] = userAccessManagementQuery?.data?.accessManagements?.[0]?.assign_role || [];

    // 3. If no role found, render default data
    if (!userRoles || userRoles.length === 0) {
      setSidebarData(defaultDashboardSidebarData);
      return;
    }

    // 4. Role exists: Calculate Access
    type RoleType = { name: string; dashboard_access_ui?: { name: string; path: string }[] };
    const rolesList: RoleType[] = allRolesQuery?.data?.roles || [];

    // Filter roles that match the user's assigned roles
    const matchedRoles: RoleType[] = rolesList.filter(role => userRoles.includes(role.name));

    // Create a Set of allowed paths/names for O(1) lookup
    const allowedUIItems = new Set<string>();
    matchedRoles.forEach(role => {
      role.dashboard_access_ui?.forEach(uiItem => {
        if (uiItem.name && uiItem.path) {
          allowedUIItems.add(`${uiItem.name}||${uiItem.path}`);
        }
      });
    });

    // If roles exist but have no UI permissions, fallback to default
    if (allowedUIItems.size === 0) {
      setSidebarData(defaultDashboardSidebarData);
      return;
    }

    // Recursive Filter Function
    const filterSidebarItems = (items: IDefaultSidebarItem[]): IDefaultSidebarItem[] => {
      return items.reduce((acc: IDefaultSidebarItem[], item) => {
        const itemKey = `${item.name}||${item.path}`;

        // Check if specific item is allowed
        let isItemAllowed = allowedUIItems.has(itemKey);

        // Check children recursively
        let filteredChildren: IDefaultSidebarItem[] | undefined;
        if (item.children && item.children.length > 0) {
          filteredChildren = filterSidebarItems(item.children);
          // If any child is allowed, the parent must be visible
          if (filteredChildren.length > 0) {
            isItemAllowed = true;
          }
        }

        if (isItemAllowed) {
          acc.push({ ...item, children: filteredChildren });
        }
        return acc;
      }, []);
    };

    // Filter the master list based on permissions
    const finalFilteredSidebar = filterSidebarItems(masterSidebarList);

    // Set data (or default if filter results in empty list)
    setSidebarData(finalFilteredSidebar.length > 0 ? finalFilteredSidebar : defaultDashboardSidebarData);
  }, [email, allSidebarsQuery, userAccessManagementQuery, allRolesQuery, convertAPISidebarItemsToIDefaultSidebarItems]);

  return [...sidebarData];
};
