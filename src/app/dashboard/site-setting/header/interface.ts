export interface NavLink {
  id: number;
  title: string;
  url: string;
  description?: string;
}

export interface ServiceLink {
  title: string;
  href: string;
  description: string;
}

export interface NavData {
  _id?: string; // Added for MongoDB document ID
  baseInfo: {
    firstName: string;
    lastName: string;
  };
  about: {
    groupTitle: string;
    fullName: string;
    description: string;
    links: NavLink[];
  };
  services: {
    groupTitle: string;
    data: ServiceLink[];
  };
  othersLink: NavLink[];
}

// For update operations, we'll allow partial updates
export type UpdateNavData = Partial<NavData>;
