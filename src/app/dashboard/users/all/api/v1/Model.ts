/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const gAuthUsersSchema = new Schema(
  {
    name: { type: String, required: true },
    userRole: [{ type: String, required: false }],
    imageUrl: { type: String, required: false },
    isBlocked: { type: Boolean, required: false },
    blockedBy: { type: String, required: false },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    passCode: { type: String, required: false },
    userUID: { type: String, required: false },
  },
  { timestamps: true },
);

export default mongoose.models.GAuthUser || mongoose.model('GAuthUser', gAuthUsersSchema);

export interface IGAuthUsers {
  name: string;
  userRole: string[];
  imageUrl: string;
  isBlocked: boolean;
  blockedBy: string;
  email: string;
  passCode: string;
  userUID: string;
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}
