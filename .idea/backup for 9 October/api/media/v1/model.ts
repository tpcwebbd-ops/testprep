import mongoose, { Schema } from 'mongoose'

const mediaSchema = new Schema({
    "uploader_email": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "file_name": { type: String, },
    "file_url": { type: String, trim: true },
    "file_type": { type: String, enum: ['image', 'video', 'pdf', 'doc'] },
    "status": { type: String, enum: ['active', 'inactive', 'trash'] }
}, { timestamps: true })

export default mongoose.models.Media || mongoose.model('Media', mediaSchema)
 
