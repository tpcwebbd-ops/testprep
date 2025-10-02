import mongoose, { Schema } from 'mongoose'

const courseSchema = new Schema({
    "title": { type: String, },
    "description": { type: String, trim: true },
    "duration_months": { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    "total_lectures": { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    "is_published": { type: String, enum: ['Published', 'private', 'suspended'] }
}, { timestamps: true })

export default mongoose.models.Course || mongoose.model('Course', courseSchema)
 
