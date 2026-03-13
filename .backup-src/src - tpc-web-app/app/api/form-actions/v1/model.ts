import mongoose, { Schema } from 'mongoose';

const FormActionsSchema = new Schema(
  {
    heading: { type: String, required: true },
    path: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export default mongoose.models.FormActions || mongoose.model('FormActions', FormActionsSchema);
