// import { useEffect, useState, useCallback } from 'react';
// import { defaultDashboardSidebarData, defaultDashboardSidebarFullData, getIconByIconName, IDefaultSidebarItem } from './default-items';
// import { useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';
// import { useGetAccessManagementsQuery } from '@/redux/features/accessManagements/accessManagementsSlice';
// import { useGetRolesQuery } from '@/redux/features/roles/rolesSlice';
// import { User2 } from 'lucide-react';

// type APISidebarItem = {
//   _id?: string;
//   sl_no?: number;
//   name: string;
//   path: string;
//   iconName?: string;
//   children?: APISidebarItem[];
// };

// export const useFetchSidebar = (email: string) => {
//   const [sidebarData, setSidebarData] = useState<IDefaultSidebarItem[]>([]);
//   const is_active_authorization = process.env.NEXT_PUBLIC_IS_ACTIVE_AUTHORIZATION;

//   const { data: allSidebarsQuery } = useGetSidebarsQuery({ page: 1, limit: 100 });
//   const { data: userAccessManagementQuery } = useGetAccessManagementsQuery({ user_email: email, page: 1, limit: 100 });
//   const { data: allRolesQuery } = useGetRolesQuery({ page: 1, limit: 100 });

//   const convertAPISidebarItemsToIDefaultSidebarItems = useCallback(
//     (arr: APISidebarItem[]): IDefaultSidebarItem[] =>
//       arr.map(it => ({
//         id: it.sl_no ?? 0,
//         name: it.name,
//         path: it.path,
//         icon: getIconByIconName(it.iconName || '') ?? getIconByIconName('settings'),
//         children: it.children ? convertAPISidebarItemsToIDefaultSidebarItems(it.children) : undefined,
//       })),
//     [],
//   );

//   useEffect(() => {

//         const apiSidebars = allSidebarsQuery?.data?.sidebars || [];
//         const mappedAPISidebars = convertAPISidebarItemsToIDefaultSidebarItems(apiSidebars);
//     if (is_active_authorization === 'false') {
//       setSidebarData([...defaultDashboardSidebarFullData]);
//       return;
//     }

//     if (!email) {
//       setSidebarData(defaultDashboardSidebarData);
//       return;
//     }

//     const userRoles: string[] = userAccessManagementQuery?.data?.accessManagements?.[0]?.assign_role || [];

//     if (!userRoles || userRoles.length === 0) {
//       setSidebarData(defaultDashboardSidebarData);
//       return;
//     }

//     type RoleType = { name: string; dashboard_access_ui?: { name: string; path: string }[] };
//     const rolesList: RoleType[] = allRolesQuery?.data?.roles || [];

//     const matchedRoles: RoleType[] = rolesList.filter(role => userRoles.includes(role.name));

//     const allowedUIItems = new Set<string>();
//     matchedRoles.forEach(role => {
//       role.dashboard_access_ui?.forEach(uiItem => {
//         if (uiItem.name && uiItem.path) {
//           allowedUIItems.add(`${uiItem.name}||${uiItem.path}`);
//         }
//       });
//     });

//     if (allowedUIItems.size === 0) {
//       setSidebarData(defaultDashboardSidebarData);
//       return;
//     }

//     const filterSidebarItems = (items: IDefaultSidebarItem[]): IDefaultSidebarItem[] => {
//       return items.reduce((acc: IDefaultSidebarItem[], item) => {
//         const itemKey = `${item.name}||${item.path}`;
//         let shouldIncludeParent = allowedUIItems.has(itemKey);

//         let filteredChildren: IDefaultSidebarItem[] | undefined;
//         if (item.children && item.children.length > 0) {
//           filteredChildren = filterSidebarItems(item.children);
//           if (filteredChildren.length > 0) {
//             shouldIncludeParent = true;
//           }
//         }

//         if (shouldIncludeParent) {
//           acc.push({ ...item, children: filteredChildren });
//         }
//         return acc;
//       }, []);
//     };

//     const baseSidebarToFilter = mappedAPISidebars.length > 0 ? mappedAPISidebars : defaultDashboardSidebarFullData;

//     const finalFilteredSidebar = filterSidebarItems(baseSidebarToFilter);

//     setSidebarData(finalFilteredSidebar.length > 0 ? finalFilteredSidebar : defaultDashboardSidebarData);
//   }, [email, is_active_authorization, allSidebarsQuery, userAccessManagementQuery, allRolesQuery, convertAPISidebarItemsToIDefaultSidebarItems]);

//   const allExtrasidebar: IDefaultSidebarItem[] = [
//     {
//       id: 1001,
//       name: 'Profile',
//       path: '/dashboard/profile',
//       icon: <User2 size={18} />,
//     },
//   ];
//   return [...sidebarData, ...allExtrasidebar];
// };
