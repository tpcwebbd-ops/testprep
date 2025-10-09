import mongoose, { Schema } from 'mongoose'

const q_and_ASchema = new Schema({
    "course_id": { type: String, },
    "lecture_id": { type: String, },
    "student_uid": { type: String, },
    "question_text": { type: String, trim: true },
    "question_time": { type: String },
    "answer_text": { type: String, trim: true },
    "answered_by_user_id": { type: String, },
    "answer_time": { type: String }
}, { timestamps: true })

export default mongoose.models.Q_and_A || mongoose.model('Q_and_A', q_and_ASchema)
 
