import mongoose, { Schema } from 'mongoose'

const roles_ManagementSchema = new Schema({
    "users_id": { type: String, },
    "role_ids": { type: String, }
}, { timestamps: true })

export default mongoose.models.Roles_Management || mongoose.model('Roles_Management', roles_ManagementSchema)
 
