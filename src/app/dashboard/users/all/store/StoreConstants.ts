import { IGAuthUsers } from '../api/v1/Model';

export const baseIGAuthUsersPerPage = 2;
export const queryParams = { q: '', page: 1, limit: baseIGAuthUsersPerPage };
export const pageLimitArr: number[] = [baseIGAuthUsersPerPage, 10, 50, 100, 200];
export const select = 'select';
export const gAuthUsersSelectorArr = ['select', 'admin', 'moderator'];
export type ISelect = 'select' | 'admin' | 'moderator';
export const defaultGAuthUsersData: IGAuthUsers = {
  _id: '',
  name: '',
  userRole: [],
  imageUrl: '',
  isBlocked: false,
  blockedBy: '',
  email: '',
  passCode: '',
  userUID: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const baseIGAuthUsers: IGAuthUsers = {
  ...defaultGAuthUsersData,
};
