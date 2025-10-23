import mongoose, { Schema, Document, Types } from 'mongoose';

interface IChildData {
  name: string;
  path?: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
}

// Make _id required to satisfy mongoose's Document type
export interface IAboutItem extends Document {
  _id: Types.ObjectId;
  name: string;
  path?: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
  childData?: IChildData[];
}

const childSchema = new Schema<IChildData>(
  {
    name: { type: String, required: true },
    path: { type: String },
    icon: String,
    image: String,
    svg: String,
    description: String,
  },
  { _id: false }, // disable _id on subdocuments if you don't want them
);

const aboutSchema = new Schema<IAboutItem>(
  {
    name: { type: String, required: true },
    path: String,
    icon: String,
    image: String,
    svg: String,
    description: String,
    childData: [childSchema],
  },
  { timestamps: true },
);

// export model (collection name 'about')
export default (mongoose.models.About as mongoose.Model<IAboutItem>) || mongoose.model<IAboutItem>('About', aboutSchema, 'about');
