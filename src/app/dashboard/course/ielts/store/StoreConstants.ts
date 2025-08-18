import { ICourses } from '../api/v1/model';

export const baseICoursesPerPage = 2;
export const queryParams = { q: '', page: 1, limit: baseICoursesPerPage };
export const pageLimitArr: number[] = [baseICoursesPerPage, 10, 50, 100, 200];
export const select_5_000___: string = 'select_5_000___';
export const coursesSelectorArr = [select_5_000___, 'admin', 'moderator'];
export type ISelect_6_000___ = 'select_5_000___' | 'admin' | 'moderator';
export const defaultCoursesData: ICourses = {
  _id: '',
  name: '',
  pdf: '',
  wordFile: '',
  videoLink: '',
  description: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const baseICourses: ICourses = {
  ...defaultCoursesData,
};
