import mongoose, { Schema } from 'mongoose';

const formSubmissionSchema = new Schema(
  {
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Add index for sorting by timestamp
formSubmissionSchema.index({ createdAt: -1 });

export default mongoose.models.FormSubmission || mongoose.model('FormSubmission', formSubmissionSchema);