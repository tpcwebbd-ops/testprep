export interface ISection {
  isActive: boolean;
  sectionUid: string;
  serialNo: number;
  data?: {
    _id: string;
  };
  _id: string;
}

export interface SubPage {
  _id: string;
  pageTitle: string;
  pagePath: string;
  content: ISection[];
  isActive: boolean;
}

export interface Page {
  _id: string;
  pageTitle: string;
  pagePath: string;
  content: ISection[];
  subPage: SubPage[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PageResponse {
  data: {
    pages: Page[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
  status: number;
}
