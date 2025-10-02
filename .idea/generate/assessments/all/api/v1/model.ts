import mongoose, { Schema } from 'mongoose'

const assessmentSchema = new Schema({
    "batch_id": { type: String, },
    "lecture_id": { type: String, },
    "course_id": { type: String, },
    "title": { type: String, },
    "description": { type: String, trim: true },
    "start_time": { type: String },
    "end_time": { type: String },
    "start_date": { type: Date, default: Date.now },
    "end_date": { type: Date, default: Date.now },
    "total_marks": { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    "marks_obtained": { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    "assessment_sheet": { type: String, trim: true },
    "assesment_checked_by": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "assesment_create_by": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "assessment_type": { type: String, enum: ['Assignment', 'Task', 'Mock Test'] }
}, { timestamps: true })

export default mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema)
 
