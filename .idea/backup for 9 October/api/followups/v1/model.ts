import mongoose, { Schema } from 'mongoose'

const follow_UpSchema = new Schema({
    "lead_id": { type: String, },
    "followed_by_id": { type: String, },
    "follow_up_date": { type: Date, default: Date.now },
    "follow_up_time": { type: String },
    "response_note": { type: String, trim: true }
}, { timestamps: true })

export default mongoose.models.Follow_Up || mongoose.model('Follow_Up', follow_UpSchema)
 
