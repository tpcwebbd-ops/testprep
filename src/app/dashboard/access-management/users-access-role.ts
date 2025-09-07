export type accessPathByUsersType = {
  role: string;
  accessPathName: string[];
}[];

export const accessDataByUsers = [
  {
    role: 'admin',
    accessSidebarName: ['Users', 'Access Management', 'Course', 'Web Messages', 'Finance', 'Site Setting', 'Media', 'My Course', 'My Profile', 'Batch'],
  },
  { role: 'moderator', accessSidebarName: ['Users', 'Course', 'Web Messages', 'Site Setting', 'Media', 'My Profile'] },
  { role: 'instructor', accessSidebarName: ['Users', 'Course', 'Web Messages', 'Media', 'My Profile'] },
  { role: 'mentor', accessSidebarName: ['Users', 'Course', 'My Profile'] },
  { role: 'student', accessSidebarName: ['My Course', 'My Profile'] },
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
const myProfilePath = 'my-profile';
const batchPath = 'batch';

export const accessPathByUsers: accessPathByUsersType = [
  {
    role: 'admin',
    accessPathName: [
      dashboard,
      usersPath,
      accessManagementPath,
      coursePath,
      webMessagesPath,
      financePath,
      siteSettingPath,
      mediaPath,
      myCoursePath,
      myProfilePath,
      batchPath,
    ],
  },
  { role: 'moderator', accessPathName: [batchPath, dashboard, usersPath, coursePath, webMessagesPath, siteSettingPath, mediaPath, myProfilePath] },
  { role: 'instructor', accessPathName: [batchPath, dashboard, usersPath, coursePath, webMessagesPath, mediaPath, myProfilePath] },
  { role: 'mentor', accessPathName: [batchPath, dashboard, usersPath, coursePath, myProfilePath] },
  { role: 'student', accessPathName: [dashboard, myCoursePath, myProfilePath] },
];
