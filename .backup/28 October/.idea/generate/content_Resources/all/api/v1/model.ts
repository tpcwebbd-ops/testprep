import mongoose, { Schema } from 'mongoose'

const content_ResourcSchema = new Schema({
    "lecture_id": { type: String, },
    "title": { type: String, },
    "url_or_content": { type: String, enum: ['url', 'content'] },
    "media_id": { type: String, trim: true },
    "content_type": { type: String, enum: ['video', 'pdf', 'text', 'description'] }
}, { timestamps: true })

export default mongoose.models.Content_Resourc || mongoose.model('Content_Resourc', content_ResourcSchema)
 
