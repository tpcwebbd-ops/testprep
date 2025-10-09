import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema({
    "sender_mobilenumber": {
                    type: String
                },
    "sender_Name": { type: String, },
    "message_content": { type: String, trim: true },
    "sent_time": { type: String },
    "sent_date": { type: Date, default: Date.now },
    "is_read": { type: String, enum: ['Read', 'Unread', 'Solved', 'Rejected'] },
    "replayBy": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "replayTime": { type: String },
    "replayDate": { type: Date, default: Date.now },
    "isAddTomarkeking": { type: String, enum: ['Pending', 'Yes', 'No'] }
}, { timestamps: true })

export default mongoose.models.Message || mongoose.model('Message', messageSchema)
 
