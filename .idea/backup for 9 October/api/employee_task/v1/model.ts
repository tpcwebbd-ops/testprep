import mongoose, { Schema } from 'mongoose'

const employee_TaskSchema = new Schema({
    "title": { type: String, },
    "description": { type: String, trim: true },
    "assigned_to_id": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "assigned_by_id": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "start_time": { type: String },
    "end_time": { type: String },
    "start_date": { type: Date, default: Date.now },
    "end_date": { type: Date, default: Date.now },
    "status": { type: String, enum: ['To Do', 'In Progress', 'Done'] },
    "checked_by_id": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                }
}, { timestamps: true })

export default mongoose.models.Employee_Task || mongoose.model('Employee_Task', employee_TaskSchema)
 
