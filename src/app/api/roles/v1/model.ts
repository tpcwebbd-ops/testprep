import mongoose, { Schema } from 'mongoose'

const roleSchema = new Schema({
    "name": { type: String },
    "email": {
          type: String,
          match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        },
    "role": [{ type: String }]
}, { timestamps: true })

export default mongoose.models.Role || mongoose.model('Role', roleSchema)
