import mongoose, { Schema } from 'mongoose'

const website_SettingSchema = new Schema({
    "Name": { type: String, },
    "logourl": { type: String, trim: true },
    "description": { type: String, trim: true },
    "short description": { type: String, trim: true },
    "mobileNumber": {
                    type: String
                },
    "address": { type: String, trim: true },
    "menu": { type: String, },
    "footer": { type: String, }
}, { timestamps: true })

export default mongoose.models.Website_Setting || mongoose.model('Website_Setting', website_SettingSchema)
 
