import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    "author_id": { type: String, },
    "title": { type: String, },
    "content": { type: String, trim: true },
    "published_date": { type: Date, default: Date.now },
    "published_time": { type: String },
    "checked_by_user_id": { type: String, },
    "post_type": { type: String, enum: ['Blog', 'Notice', 'Social Media'] },
    "publish_media": { type: String, enum: ['Website', 'Facebook', 'YouTube'] },
    "status": { type: String, enum: ['Draft', 'Published', 'Archive', 'Schedule'] }
}, { timestamps: true })

export default mongoose.models.Post || mongoose.model('Post', postSchema)
 
