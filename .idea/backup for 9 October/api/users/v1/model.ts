import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
    "full_name": { type: String, },
    "uid": { type: String, },
    "email": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "password_hash": { type: String, },
    "phone_number": {
                    type: String
                },
    "profile_image_url": { type: String, trim: true },
    "sign_up_by": { type: String, enum: ['Google', 'Email'] },
    "status": { type: String, enum: ['active', 'inactive', 'suspended'] }
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', userSchema)
 
