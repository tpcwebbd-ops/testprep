import { SpokenCourse } from '../api/v1/model';

export const baseICoursesPerPage = 2;
export const queryParams = { q: '', page: 1, limit: baseICoursesPerPage };
export const pageLimitArr: number[] = [baseICoursesPerPage, 10, 50, 100, 200];
export const selectSpokenStatus: string = 'Pending';
export const coursesSelectorArr = [selectSpokenStatus, 'Private', 'Public'];
export type ISelectSpokenStatus = 'Pending' | 'Private' | 'Public';
export const defaultCoursesData: SpokenCourse = {
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

export const baseICourses: SpokenCourse = {
  ...defaultCoursesData,
};
