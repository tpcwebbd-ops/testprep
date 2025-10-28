import mongoose, { Schema } from 'mongoose'

const submissionSchema = new Schema({
    "assessment_id": { type: String, },
    "student_id ": { type: String, },
    "submission_time": { type: String },
    "submitted_content": { type: String, trim: true },
    "marks_obtained": { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    "feedback": { type: String, trim: true },
    "checked_by_mentor_id": { type: String, }
}, { timestamps: true })

export default mongoose.models.Submission || mongoose.model('Submission', submissionSchema)
 
