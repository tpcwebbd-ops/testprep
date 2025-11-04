export interface IDashboardAsidebarData {
  id: number | string;
  title: string;
  path: string;
  dashboardType: 'parsonal' | 'admin';
  access?: boolean;
}

export const dashboardAsidebarData: IDashboardAsidebarData[] = [
  { id: 1, title: 'Profile', path: '/dashboard/profile', dashboardType: 'parsonal', access: true },

  { id: 2, title: 'Web Message', path: '/dashboard/web-message', dashboardType: 'parsonal', access: true },
  { id: 3, title: 'Web Message', path: '/dashboard/admin/web-message', dashboardType: 'admin', access: true },

  { id: 4, title: 'Questions', path: '/dashboard/questions', dashboardType: 'parsonal', access: true },
  { id: 5, title: 'Questions', path: '/dashboard/admin/questions', dashboardType: 'admin', access: true },

  { id: 6, title: 'Course', path: '/dashboard/course', dashboardType: 'parsonal', access: true },
  { id: 7, title: 'Course', path: '/dashboard/admin/course', dashboardType: 'admin', access: true },

  { id: 8, title: 'Lecture', path: '/dashboard/lecture', dashboardType: 'parsonal', access: true },
  { id: 9, title: 'Lecture', path: '/dashboard/admin/lecture', dashboardType: 'admin', access: true },

  { id: 10, title: 'Assignment', path: '/dashboard/assignment', dashboardType: 'parsonal', access: true },
  { id: 11, title: 'Assignment', path: '/dashboard/admin/assignment', dashboardType: 'admin', access: true },

  { id: 12, title: 'Test', path: '/dashboard/test', dashboardType: 'parsonal', access: true },
  { id: 13, title: 'Test', path: '/dashboard/admin/test', dashboardType: 'admin', access: true },

  { id: 14, title: 'Mock Text', path: '/dashboard/mock-text', dashboardType: 'parsonal', access: true },
  { id: 15, title: 'Mock Text', path: '/dashboard/admin/mock-text', dashboardType: 'admin', access: true },

  { id: 16, title: 'Payment', path: '/dashboard/payment', dashboardType: 'parsonal', access: true },
  { id: 17, title: 'Payment', path: '/dashboard/admin/payment', dashboardType: 'admin', access: true },

  { id: 18, title: 'Bookmarks', path: '/dashboard/bookmarks', dashboardType: 'parsonal', access: true },
  { id: 19, title: 'Bookmarks', path: '/dashboard/admin/bookmarks', dashboardType: 'admin', access: true },

  { id: 20, title: 'My Class', path: '/dashboard/my-class', dashboardType: 'parsonal', access: true },
  { id: 21, title: 'My Class', path: '/dashboard/admin/my-class', dashboardType: 'admin', access: true },

  { id: 22, title: 'My Course', path: '/dashboard/my-course', dashboardType: 'parsonal', access: true },
  { id: 23, title: 'My Course', path: '/dashboard/admin/my-course', dashboardType: 'admin', access: true },

  { id: 24, title: 'Attendance', path: '/dashboard/attendance', dashboardType: 'parsonal', access: true },
  { id: 25, title: 'Attendance', path: '/dashboard/admin/attendance', dashboardType: 'admin', access: true },

  { id: 26, title: 'Support', path: '/dashboard/support', dashboardType: 'parsonal', access: true },
  { id: 27, title: 'Support', path: '/dashboard/admin/support', dashboardType: 'admin', access: true },

  { id: 28, title: 'AbsentStudents', path: '/dashboard/absent-students', dashboardType: 'parsonal', access: true },
  { id: 29, title: 'AbsentStudents', path: '/dashboard/admin/absent-students', dashboardType: 'admin', access: true },

  { id: 30, title: 'Review', path: '/dashboard/review', dashboardType: 'parsonal', access: true },
  { id: 31, title: 'Review', path: '/dashboard/admin/review', dashboardType: 'admin', access: true },

  { id: 32, title: 'Mock Test', path: '/dashboard/mock-test', dashboardType: 'parsonal', access: true },
  { id: 33, title: 'Mock Test', path: '/dashboard/admin/mock-test', dashboardType: 'admin', access: true },

  { id: 34, title: 'Reword', path: '/dashboard/reword', dashboardType: 'parsonal', access: true },
  { id: 35, title: 'Reword', path: '/dashboard/admin/reword', dashboardType: 'admin', access: true },

  { id: 36, title: 'Target And Goal', path: '/dashboard/target-and-goal', dashboardType: 'parsonal', access: true },
  { id: 37, title: 'Target And Goal', path: '/dashboard/admin/target-and-goal', dashboardType: 'admin', access: true },

  { id: 38, title: 'Work Summery', path: '/dashboard/work-summery', dashboardType: 'parsonal', access: true },
  { id: 39, title: 'Work Summery', path: '/dashboard/admin/work-summery', dashboardType: 'admin', access: true },

  { id: 40, title: 'Access', path: '/dashboard/admin/access', dashboardType: 'admin', access: true },
  { id: 41, title: 'Finance', path: '/dashboard/admin/finance', dashboardType: 'admin', access: true },
  { id: 42, title: 'Batch And Progress', path: '/dashboard/admin/batch-and-progress', dashboardType: 'admin', access: true },
  { id: 43, title: 'Employee Progress', path: '/dashboard/admin/employee-progress', dashboardType: 'admin', access: true },
  { id: 44, title: 'Course Content', path: '/dashboard/admin/course-content', dashboardType: 'admin', access: true },

  { id: 45, title: 'Media', path: '/dashboard/media', dashboardType: 'parsonal', access: true },
  { id: 46, title: 'Media', path: '/dashboard/admin/media', dashboardType: 'admin', access: true },

  { id: 47, title: 'Content Planner', path: '/dashboard/admin/content-planner', dashboardType: 'admin', access: true },
  { id: 48, title: 'Site Setting', path: '/dashboard/admin/site-setting', dashboardType: 'admin', access: true },
  { id: 49, title: 'Audience Modifier', path: '/dashboard/admin/audience-modifier', dashboardType: 'admin', access: true },
];
