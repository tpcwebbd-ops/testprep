export type accessPathByUsersType = {
  role: string;
  accessPathName: string[];
}[];

export const accessDataByUsers = [
  { role: 'admin', accessSidebarName: ['Users', 'Access Management', 'Course', 'Web Messages', 'Finance', 'Site Setting', 'Media', 'My Course'] },
  { role: 'moderator', accessSidebarName: ['Users', 'Course', 'Web Messages', 'Site Setting', 'Media'] },
  { role: 'instructor', accessSidebarName: ['Users', 'Course', 'Web Messages', 'Media'] },
  { role: 'mentor', accessSidebarName: ['Users', 'Course'] },
  { role: 'student', accessSidebarName: ['My Course'] },
];

const dashboard = 'dashboard';
const usersPath = 'users';
const accessManagementPath = 'access-management';
const coursePath = 'course';
const webMessagesPath = 'web-messages';
const financePath = 'finance';
const siteSettingPath = 'site-setting';
const mediaPath = 'media';
const myCoursePath = 'my-course';

export const accessPathByUsers: accessPathByUsersType = [
  {
    role: 'admin',
    accessPathName: [dashboard, usersPath, accessManagementPath, coursePath, webMessagesPath, financePath, siteSettingPath, mediaPath, myCoursePath],
  },
  { role: 'moderator', accessPathName: [dashboard, usersPath, coursePath, webMessagesPath, siteSettingPath, mediaPath] },
  { role: 'instructor', accessPathName: [dashboard, usersPath, coursePath, webMessagesPath, mediaPath] },
  { role: 'mentor', accessPathName: [dashboard, usersPath, coursePath] },
  { role: 'student', accessPathName: [dashboard, myCoursePath] },
];
