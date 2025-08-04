import { IUsers_1_000___ } from '../api/v1/Model';

export const baseIUsers_1_000___PerPage = 2;
export const queryParams = { q: '', page: 1, limit: baseIUsers_1_000___PerPage };
export const pageLimitArr: number[] = [baseIUsers_1_000___PerPage, 10, 50, 100, 200];
export const select_5_000___: string = 'select_5_000___';
export const users_2_000___SelectorArr = [select_5_000___, 'admin', 'moderator'];
export type ISelect_6_000___ = 'select_5_000___' | 'admin' | 'moderator';
export const defaultUsers_1_000___Data: IUsers_1_000___ = {
  _id: '',
  name: '',
  email: '',
  passCode: '',
  alias: '',
  role: select_5_000___,
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const baseIUsers_1_000___: IUsers_1_000___ = {
  ...defaultUsers_1_000___Data,
};
