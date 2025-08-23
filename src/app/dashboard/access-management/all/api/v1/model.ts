/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const user_accessSchema = new Schema(
  {
    role: [{ type: String, required: false }],
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
  },
  { timestamps: true },
);

export default mongoose.models.User_access || mongoose.model('User_access', user_accessSchema);

export interface IUsers_access {
  role?: string[];
  email: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
