import mongoose, { Schema } from 'mongoose'

const enrollmentSchema = new Schema({
    "student_email  ": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "batch_id": { type: String, },
    "enrollment_date": { type: Date, default: Date.now },
    "enrollment_time": { type: String },
    "is_complete": { type: String, enum: ['Pending', 'Completed', 'Failed', 'Rejected'] },
    "payment_id": { type: String, }
}, { timestamps: true })

export default mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema)
 
