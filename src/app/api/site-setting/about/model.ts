import mongoose, { Schema, Document, Types } from 'mongoose';

interface IChildData {
  _id?: Types.ObjectId;
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
}

export interface IAboutItem extends Document {
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
  childData?: IChildData[];
}

const childSchema = new Schema<IChildData>(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    icon: String,
    image: String,
    svg: String,
    description: String,
  },
  { _id: true },
);

const aboutSchema = new Schema<IAboutItem>(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    icon: String,
    image: String,
    svg: String,
    description: String,
    childData: [childSchema],
  },
  { timestamps: true },
);

export default mongoose.models.About || mongoose.model<IAboutItem>('About', aboutSchema, 'about');
