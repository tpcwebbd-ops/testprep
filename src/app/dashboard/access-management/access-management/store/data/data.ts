export interface IAccessManagements {
  user_name: string;
  user_email: string;
  assign_role: string[];
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export const defaultAccessManagements = {
  user_name: '',
  user_email: '',
  assign_role: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
