export interface ICURD {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}
export interface IERoles {
  user: ICURD;
  website_setting: ICURD;
  role_permission: ICURD;
  access_management: ICURD;
  course: ICURD;
  review: ICURD;
  lecture: ICURD;
  batch: ICURD;
  q_and_a: ICURD;
  content_resource: ICURD;
  assessment: ICURD;
  payment: ICURD;
  submissions: ICURD;
  enrollment: ICURD;
  marketing_lead: ICURD;
  profile: ICURD;
  message: ICURD;
  media: ICURD;
  follow_up: ICURD;
  attendance: ICURD;
  company_goal: ICURD;
  support_ticket: ICURD;
  post: ICURD;
  reward: ICURD;
  employee_task: ICURD;
}
export const defaultCURD = {
  create: true,
  read: true,
  update: false,
  delete: false,
};

export const defaulERoles = {
  user: defaultCURD,
  website_setting: defaultCURD,
  role_permission: defaultCURD,
  access_management: defaultCURD,
  course: defaultCURD,
  review: defaultCURD,
  lecture: defaultCURD,
  batch: defaultCURD,
  q_and_a: defaultCURD,
  content_resource: defaultCURD,
  assessment: defaultCURD,
  payment: defaultCURD,
  submissions: defaultCURD,
  enrollment: defaultCURD,
  marketing_lead: defaultCURD,
  profile: defaultCURD,
  message: defaultCURD,
  media: defaultCURD,
  follow_up: defaultCURD,
  attendance: defaultCURD,
  company_goal: defaultCURD,
  support_ticket: defaultCURD,
  post: defaultCURD,
  reward: defaultCURD,
  employee_task: defaultCURD,
};
export interface IRoles {
  name: string;
  email: string;
  note: string;
  description: string;
  role: IERoles;
  dashboard_access_ui?: { name: string; path: string }[];
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export const defaultRoles = {
  name: '',
  email: '',
  role: defaulERoles,
  dashboard_access_ui: [],
  note: '',
  description: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
