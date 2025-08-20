import { IELTScourse } from '../api/v1/model';

export const baseICoursesPerPage = 2;
export const queryParams = { q: '', page: 1, limit: baseICoursesPerPage };
export const pageLimitArr: number[] = [baseICoursesPerPage, 10, 50, 100, 200];
export const selectCourseState: string = 'Pending';
export const coursesSelectorArr = [selectCourseState, 'Private', 'Public'];
export type ISelectCourseStatus = 'Pending' | 'Private' | 'Public';
export const defaultCoursesData: IELTScourse = {
  lectureTitle: '',
  lectureNo: 0,
  pdf: '',
  wordFile: '',
  videoLink: '',
  shortDescription: '',
  summery: '',
  details: '',
  note: '',
  classDuration: '',
  status: 'Pending',

  _id: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const baseICourses: IELTScourse = {
  ...defaultCoursesData,
};
