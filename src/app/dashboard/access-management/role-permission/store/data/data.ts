import { StringArrayData } from '../../components/others-field-type/types';

export interface IRoles {
  name: string;
  email: string;
  role: StringArrayData[];
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export const defaultRoles = {
  name: '',
  email: '',
  role: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
