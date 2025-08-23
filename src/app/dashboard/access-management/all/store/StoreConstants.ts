import { IUsers_access } from '../api/v1/model';

export const baseIUsers_accessPerPage = 2;
export const queryParams = { q: '', page: 1, limit: baseIUsers_accessPerPage };
export const pageLimitArr: number[] = [baseIUsers_accessPerPage, 10, 50, 100, 200];
export const selectUserAccess: string = 'user';
export const usersAccessSelectorArr = [selectUserAccess, 'admin', 'moderator', 'student', 'mentor', 'instructor'];
export type ISelectUserAccess = 'selectUserAccess' | 'admin' | 'moderator' | 'student' | 'mentor' | 'instructor';

export const defaultUsersAccessData: IUsers_access = {
  _id: '',
  name: '',
  assignBy: '',

  email: '',
  role: selectUserAccess,
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const baseIUsers_access: IUsers_access = {
  ...defaultUsersAccessData,
};
