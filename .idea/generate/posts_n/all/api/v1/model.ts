import mongoose, { Schema } from 'mongoose'

const post_nSchema = new Schema({
    "title": { type: String, },
    "description": { type: String, trim: true },
    "set_by_user_id": { type: String, },
    "start_date": { type: Date, default: Date.now },
    "end_date": { type: Date, default: Date.now },
    "status": { type: String, enum: ['Think', 'Planning', 'Active', 'Completed', 'Failed'] },
    "notes": { type: String, trim: true },
    "checked_by_user_id": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                }
}, { timestamps: true })

export default mongoose.models.Post_n || mongoose.model('Post_n', post_nSchema)
 
