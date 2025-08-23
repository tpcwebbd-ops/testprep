import { IUsers_access } from '../api/v1/model';

export const baseIUsers_accessPerPage = 2;
export const queryParams = { q: '', page: 1, limit: baseIUsers_accessPerPage };
export const pageLimitArr: number[] = [baseIUsers_accessPerPage, 10, 50, 100, 200];
export const select_5_000___: string = 'user';
export const users_2_000___SelectorArr = [select_5_000___, 'admin', 'moderator', 'student', 'mentor', 'instructor'];
export type ISelect_6_000___ = 'select_5_000___' | 'admin' | 'moderator' | 'student' | 'mentor' | 'instructor';

export const defaultUsers_1_000___Data: IUsers_access = {
  _id: '',
  email: '',
  role: [select_5_000___],
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const baseIUsers_access: IUsers_access = {
  ...defaultUsers_1_000___Data,
};
