export interface ISessions {
  expiresAt: Date;
  token: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
}

export const defaultSessions = {
  expiresAt: new Date(),
  token: '',
  ipAddress: '',
  userAgent: '',
  userId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
