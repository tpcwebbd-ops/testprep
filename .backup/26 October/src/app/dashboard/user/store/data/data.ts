export interface IUsers {
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export const defaultUsers = {
  name: '',
  email: '',
  emailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
