import mongoose, { Schema } from 'mongoose'

const reviewSchema = new Schema({
    "course_id": { type: String, },
    "user_id": { type: String, },
    "rating": { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    "review_text": { type: String, trim: true },
    "created_at": { type: String }
}, { timestamps: true })

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)
 
