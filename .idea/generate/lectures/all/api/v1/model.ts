import mongoose, { Schema } from 'mongoose'

const lectureSchema = new Schema({
    "module_id": { type: String, },
    "title": { type: String, },
    "description": { type: String, trim: true },
    "lecture_date": { type: Date, default: Date.now },
    "order_index": { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } }
}, { timestamps: true })

export default mongoose.models.Lecture || mongoose.model('Lecture', lectureSchema)
 
