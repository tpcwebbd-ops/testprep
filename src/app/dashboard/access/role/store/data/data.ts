export interface IERoles {
  user: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  website_setting: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  role_permission: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  access_management: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  course: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  review: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  lecture: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  batch: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  q_and_a: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  content_resource: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  assessment: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  payment: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  submissions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  enrollment: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  marketing_lead: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  profile: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  message: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  media: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  follow_up: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  attendance: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  company_goal: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  support_ticket: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  post: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  reward: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  'employee_task ': {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}
export const defaulERoles = {
  user: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  website_setting: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  role_permission: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  access_management: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  course: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  review: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  lecture: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  batch: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  q_and_a: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  content_resource: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  assessment: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  payment: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  submissions: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  enrollment: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  marketing_lead: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  profile: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  message: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  media: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  follow_up: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  attendance: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  company_goal: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  support_ticket: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  post: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  reward: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  'employee_task ': {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
};

export interface IDashboardAccessData {
  id: number | string;
  title: string;
  path: string;
  dashboardType: 'parsonal' | 'admin';
  access?: boolean;
}

export const dashboardAccessData: IDashboardAccessData[] = [
  { id: 1, title: 'Profile', path: '/dashboard/profile', dashboardType: 'parsonal', access: true },

  { id: 2, title: 'Web Message', path: '/dashboard/web-message', dashboardType: 'parsonal', access: true },
  { id: 3, title: 'Web Message', path: '/dashboard/admin/web-message', dashboardType: 'admin', access: false },

  { id: 4, title: 'Questions', path: '/dashboard/questions', dashboardType: 'parsonal', access: true },
  { id: 5, title: 'Questions', path: '/dashboard/admin/questions', dashboardType: 'admin', access: false },

  { id: 6, title: 'Course', path: '/dashboard/course', dashboardType: 'parsonal', access: true },
  { id: 7, title: 'Course', path: '/dashboard/admin/course', dashboardType: 'admin', access: false },

  { id: 8, title: 'Lecture', path: '/dashboard/lecture', dashboardType: 'parsonal', access: true },
  { id: 9, title: 'Lecture', path: '/dashboard/admin/lecture', dashboardType: 'admin', access: false },

  { id: 10, title: 'Assignment', path: '/dashboard/assignment', dashboardType: 'parsonal', access: true },
  { id: 11, title: 'Assignment', path: '/dashboard/admin/assignment', dashboardType: 'admin', access: false },

  { id: 12, title: 'Test', path: '/dashboard/test', dashboardType: 'parsonal', access: true },
  { id: 13, title: 'Test', path: '/dashboard/admin/test', dashboardType: 'admin', access: false },

  { id: 14, title: 'Mock Text', path: '/dashboard/mock-text', dashboardType: 'parsonal', access: true },
  { id: 15, title: 'Mock Text', path: '/dashboard/admin/mock-text', dashboardType: 'admin', access: false },

  { id: 16, title: 'Payment', path: '/dashboard/payment', dashboardType: 'parsonal', access: true },
  { id: 17, title: 'Payment', path: '/dashboard/admin/payment', dashboardType: 'admin', access: false },

  { id: 18, title: 'Bookmarks', path: '/dashboard/bookmarks', dashboardType: 'parsonal', access: true },
  { id: 19, title: 'Bookmarks', path: '/dashboard/admin/bookmarks', dashboardType: 'admin', access: false },

  { id: 20, title: 'My Class', path: '/dashboard/my-class', dashboardType: 'parsonal', access: true },
  { id: 21, title: 'My Class', path: '/dashboard/admin/my-class', dashboardType: 'admin', access: false },

  { id: 22, title: 'My Course', path: '/dashboard/my-course', dashboardType: 'parsonal', access: true },
  { id: 23, title: 'My Course', path: '/dashboard/admin/my-course', dashboardType: 'admin', access: false },

  { id: 24, title: 'Attendance', path: '/dashboard/attendance', dashboardType: 'parsonal', access: true },
  { id: 25, title: 'Attendance', path: '/dashboard/admin/attendance', dashboardType: 'admin', access: false },

  { id: 26, title: 'Support', path: '/dashboard/support', dashboardType: 'parsonal', access: true },
  { id: 27, title: 'Support', path: '/dashboard/admin/support', dashboardType: 'admin', access: false },

  { id: 28, title: 'AbsentStudents', path: '/dashboard/absent-students', dashboardType: 'parsonal', access: true },
  { id: 29, title: 'AbsentStudents', path: '/dashboard/admin/absent-students', dashboardType: 'admin', access: false },

  { id: 30, title: 'Review', path: '/dashboard/review', dashboardType: 'parsonal', access: true },
  { id: 31, title: 'Review', path: '/dashboard/admin/review', dashboardType: 'admin', access: false },

  { id: 32, title: 'Mock Test', path: '/dashboard/mock-test', dashboardType: 'parsonal', access: true },
  { id: 33, title: 'Mock Test', path: '/dashboard/admin/mock-test', dashboardType: 'admin', access: false },

  { id: 34, title: 'Reword', path: '/dashboard/reword', dashboardType: 'parsonal', access: true },
  { id: 35, title: 'Reword', path: '/dashboard/admin/reword', dashboardType: 'admin', access: false },

  { id: 36, title: 'Target And Goal', path: '/dashboard/target-and-goal', dashboardType: 'parsonal', access: true },
  { id: 37, title: 'Target And Goal', path: '/dashboard/admin/target-and-goal', dashboardType: 'admin', access: false },

  { id: 38, title: 'Work Summery', path: '/dashboard/work-summery', dashboardType: 'parsonal', access: true },
  { id: 39, title: 'Work Summery', path: '/dashboard/admin/work-summery', dashboardType: 'admin', access: false },

  { id: 40, title: 'Access', path: '/dashboard/admin/access', dashboardType: 'admin', access: false },
  { id: 41, title: 'Finance', path: '/dashboard/admin/finance', dashboardType: 'admin', access: false },
  { id: 42, title: 'Batch And Progress', path: '/dashboard/admin/batch-and-progress', dashboardType: 'admin', access: false },
  { id: 43, title: 'Employee Progress', path: '/dashboard/admin/employee-progress', dashboardType: 'admin', access: false },
  { id: 44, title: 'Course Content', path: '/dashboard/admin/course-content', dashboardType: 'admin', access: false },

  { id: 45, title: 'Media', path: '/dashboard/media', dashboardType: 'parsonal', access: true },
  { id: 46, title: 'Media', path: '/dashboard/admin/media', dashboardType: 'admin', access: false },

  { id: 47, title: 'Content Planner', path: '/dashboard/admin/content-planner', dashboardType: 'admin', access: false },
  { id: 48, title: 'Site Setting', path: '/dashboard/admin/site-setting', dashboardType: 'admin', access: false },
  { id: 49, title: 'Audience Modifier', path: '/dashboard/admin/audience-modifier', dashboardType: 'admin', access: false },
];

export interface IRoles {
  name: string;
  email: string;
  note: string;
  description: string;
  role: IERoles;
  dashboard_access: IDashboardAccessData[];
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export const defaultRoles = {
  name: '',
  email: '',
  role: defaulERoles,
  dashboard_access: dashboardAccessData,
  note: '',
  description: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
