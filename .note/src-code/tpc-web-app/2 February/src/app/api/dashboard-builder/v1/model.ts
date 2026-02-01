import mongoose, { Schema } from 'mongoose';

const dashboardBuilderSchema = new Schema(
  {
    dashboardName: { type: String, required: true },
    dashboardPath: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    content: { type: Schema.Types.Mixed, default: {} },
    contentType: { type: Schema.Types.Mixed, default: {} },
    accessList: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true, timestamps: true },
);

export default mongoose.models.DashboardBuilder || mongoose.model('DashboardBuilder', dashboardBuilderSchema);
