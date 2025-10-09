import mongoose, { Schema } from 'mongoose';

const dockingSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Docking || mongoose.model('Docking', dockingSchema);

export interface IDocking_s {
  name: string;
}
