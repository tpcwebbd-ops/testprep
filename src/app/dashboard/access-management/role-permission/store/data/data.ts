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
export interface IRoles {
  name: string;
  email: string;
  note: string;
  description: string;
  role: IERoles;
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export const defaultRoles = {
  name: '',
  email: '',
  role: defaulERoles,
  note: '',
  description: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
