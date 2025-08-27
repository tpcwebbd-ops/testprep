import mongoose, { Schema, Document } from 'mongoose';
import { NavData } from './interface'; // Assuming interface.ts is in the same directory

const NavLinkSchema: Schema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
});

const ServiceLinkSchema: Schema = new Schema({
  title: { type: String, required: true },
  href: { type: String, required: true },
  description: { type: String, required: true },
});

const NavDataSchema: Schema = new Schema<NavData & Document>(
  {
    baseInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    about: {
      groupTitle: { type: String, required: true },
      fullName: { type: String, required: true },
      description: { type: String, required: true },
      links: [NavLinkSchema],
    },
    services: {
      groupTitle: { type: String, required: true },
      data: [ServiceLinkSchema],
    },
    othersLink: [NavLinkSchema],
  },
  { timestamps: true },
);

const Header = mongoose.models.Header || mongoose.model<NavData & Document>('Header', NavDataSchema);

export default Header;
