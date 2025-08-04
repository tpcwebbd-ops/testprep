/*
|-----------------------------------------
| setting up SideNavData for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: tecmart-template, May, 2025
|-----------------------------------------
*/

import { IconType } from 'react-icons/lib';
import { MdOutlineManageAccounts } from 'react-icons/md';

type CustomButtonType = {
  id: number;
  parentTitle: string;

  icon?: null | IconType;
  children: { id: number; title: string; url: string; icon?: IconType | null }[];
};

const data: CustomButtonType[] = [
  {
    id: 1,
    parentTitle: 'Users',
    children: [{ id: 101, title: 'All Users', url: '/dashboard/users/all' }],
  },
  {
    id: 2,
    parentTitle: 'Shops',
    children: [
      { id: 201, title: 'All Shops', url: '/dashboard/shops/all' },
      { id: 203, title: 'Digital Shops', url: '/dashboard/shops/digital' },
      { id: 204, title: 'Physical Shops', url: '/dashboard/shops/physical' },
    ],
  },
  {
    id: 3,
    parentTitle: 'Products',
    children: [
      { id: 301, title: 'All Products', url: '/dashboard/products/all' },
      { id: 303, title: 'Digital Products', url: '/dashboard/products/digital' },
      { id: 304, title: 'Physical Products', url: '/dashboard/products/physical' },
    ],
  },
  {
    id: 4,
    parentTitle: 'Orders',
    children: [{ id: 401, title: 'All Orders', url: '/dashboard/orders/all' }],
  },
  {
    id: 5,
    parentTitle: 'Category',
    children: [{ id: 501, title: 'All Category', url: '/dashboard/category/all' }],
  },
  {
    id: 6,
    parentTitle: 'Pickup Points',
    children: [{ id: 601, title: 'All Pickup Points', url: '/dashboard/pickup-points/all' }],
  },
  {
    id: 7,
    parentTitle: 'Blogs',
    children: [{ id: 701, title: 'All Blogs', url: '/dashboard/blogs/all' }],
  },
  {
    id: 8,
    parentTitle: 'Files',
    children: [{ id: 801, title: 'All Files', url: '/dashboard/files/all' }],
  },
  {
    id: 9,
    parentTitle: 'Marketing',
    children: [{ id: 901, title: 'All Marketing', url: '/dashboard/marketing/all' }],
  },
  {
    id: 10,
    parentTitle: 'Support',
    children: [{ id: 1001, title: 'All Support', url: '/dashboard/support/all' }],
  },
  {
    id: 11,
    parentTitle: 'Coupon',
    children: [{ id: 1101, title: 'All Coupon', url: '/dashboard/coupon/all' }],
  },
  {
    id: 12,
    parentTitle: 'Reports',
    children: [{ id: 1201, title: 'All Reports', url: '/dashboard/reports/all' }],
  },
  {
    id: 13,
    parentTitle: 'Landing Page',
    children: [{ id: 1301, title: 'All Landing Page', url: '/dashboard/landing-page/all' }],
  },
  {
    id: 14,
    parentTitle: 'Banners',
    children: [{ id: 1401, title: 'All Banners', url: '/dashboard/banners/all' }],
  },
  {
    id: 15,
    parentTitle: 'Payments Gateway',
    children: [{ id: 1501, title: 'All Payments Gateway', url: '/dashboard/payments-gateway/all' }],
  },
  {
    id: 16,
    parentTitle: 'Site Setting',
    children: [{ id: 1601, title: 'All Site Setting', url: '/dashboard/site-setting/all' }],
  },
  {
    // Assuming this is the 17th item despite the numbering
    id: 17,
    parentTitle: 'Landing Products',
    children: [{ id: 1701, title: 'All Landing Products', url: '/dashboard/landing-products/all' }],
  },
];
export default data.map(curr => {
  const i = { ...curr };
  i.icon = MdOutlineManageAccounts;
  if (i.children.length > 0) {
    i.children = i.children.map(c => ({ ...c, icon: MdOutlineManageAccounts }));
  }
  return i;
});
