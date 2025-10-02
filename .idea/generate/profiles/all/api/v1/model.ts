import mongoose, { Schema } from 'mongoose'

const profileSchema = new Schema({
    "user_id": { type: String, },
    "address": { type: String, },
    "bio": { type: String, trim: true },
    "social_links": { type: String, }
}, { timestamps: true })

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema)
 
