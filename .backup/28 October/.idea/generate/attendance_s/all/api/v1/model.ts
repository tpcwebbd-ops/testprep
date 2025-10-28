import mongoose, { Schema } from 'mongoose'

const attendanceSchema = new Schema({
    "user_id": { type: String, },
    "date": { type: Date, default: Date.now },
    "time": { type: String },
    "notes": { type: String, trim: true },
    "status": { type: String, enum: ['Present', 'Parmit_Leave', 'Absent'] }
}, { timestamps: true })

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema)
 
