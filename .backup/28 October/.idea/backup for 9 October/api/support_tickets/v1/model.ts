import mongoose, { Schema } from 'mongoose'

const support_TicketSchema = new Schema({
    "student_id": { type: String, },
    "assigned_to_id ": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "title": { type: String, },
    "description": { type: String, trim: true },
    "created_at": { type: String },
    "closed_at": { type: String },
    "status": { type: String, enum: ['Open', 'In Progress', 'Closed', 'Solved', 'Rejected'] }
}, { timestamps: true })

export default mongoose.models.Support_Ticket || mongoose.model('Support_Ticket', support_TicketSchema)
 
