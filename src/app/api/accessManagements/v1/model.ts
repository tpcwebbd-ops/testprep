import mongoose, { Schema } from 'mongoose'

const accessManagementSchema = new Schema({
    "user_name": { type: String },
    "user_email": {
          type: String,
          match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        },
    "assign_role": [{ type: String }]
}, { timestamps: true })

export default mongoose.models.AccessManagement || mongoose.model('AccessManagement', accessManagementSchema)
