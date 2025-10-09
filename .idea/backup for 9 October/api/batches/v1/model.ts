import mongoose, { Schema } from 'mongoose'

const batchSchema = new Schema({
    "batch_title": { type: String, },
    "course_id": { type: String, },
    "start_date": { type: Date, default: Date.now },
    "end_date": { type: Date, default: Date.now },
    "status": { type: String, enum: ['upcoming', 'ongoing', 'completed'] },
    "instructors_user_id": { type: String, },
    "instructors_name": { type: String, },
    "enroll_students": { type: String, }
}, { timestamps: true })

export default mongoose.models.Batch || mongoose.model('Batch', batchSchema)
 
