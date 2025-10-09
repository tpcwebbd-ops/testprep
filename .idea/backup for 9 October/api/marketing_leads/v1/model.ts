import mongoose, { Schema } from 'mongoose'

const marketing_LeadSchema = new Schema({
    "full_name": { type: String, },
    "phone_number": {
                    type: String
                },
    "email": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "source_content": { type: String, enum: ['Whats Apps', 'Facebook', 'Manual collection'] },
    "collected_by": { type: String, },
    "notes": { type: String, trim: true }
}, { timestamps: true })

export default mongoose.models.Marketing_Lead || mongoose.model('Marketing_Lead', marketing_LeadSchema)
 
