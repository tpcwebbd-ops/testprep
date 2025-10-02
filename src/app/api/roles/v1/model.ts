import mongoose, { Schema } from 'mongoose'

const roleSchema = new Schema({
    "role_name": { type: String, enum: ['MD', 'CTO', 'COO', 'CFO', 'Admin', 'Instructor', 'Moderator', 'Social media manager', 'Social media marketer', 'Mentor', 'Students', 'Users'] },
    "description": { type: String, trim: true },
    "assign_access": { type: String, }
}, { timestamps: true })

export default mongoose.models.Role || mongoose.model('Role', roleSchema)
 
