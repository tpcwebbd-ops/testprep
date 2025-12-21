import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    "title": { type: String },
    "email": {
          type: String,
          match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        },
    "author-email": {
          type: String,
          match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        },
    "password": { type: String, select: false },
    "passcode": { type: String, select: false },
    "area": { type: String, enum: ['Bangladesh', 'India', 'Pakistan', 'Canada'] },
    "sub-area": [{ type: String }],
    "products-images": [{ type: String }],
    "personal-image": { type: String },
    "description": { type: String, trim: true },
    "age": { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    "amount": { type: Number },
    "isActive": { type: Boolean, default: false },
    "start-date": { type: Date, default: Date.now },
    "start-time": { type: String },
    "schedule-date": { start: { type: Date }, end: { type: Date } },
    "schedule-time": { start: { type: String }, end: { type: String } },
    "favorite-color": { type: String, match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please fill a valid color hex code'] },
    "number": { type: String },
    "profile": { type: String, trim: true },
    "test": { type: String },
    "info": { type: String },
    "shift": [{ type: String }],
    "policy": { type: Boolean, default: false },
    "hobbies": [{ type: String }],
    "ideas": { type: [String], enum: ['O 1', 'O 2', 'O 3', 'O 4'] },
    "students": [
            {
                "Name": { type: String },
                "Class": { type: String },
                "Roll": { type: String }
            }
        ],
    "complexValue": {
        "id": { type: String },
        "title": { type: String },
        "parent": {
            "id": { type: String },
            "title": { type: String },
            "child": {
                "id": { type: String },
                "title": { type: String },
                "child": { type: String },
                "note": { type: String }
            },
            "note": { type: String }
        },
        "note": { type: String }
    }
}, { timestamps: true })

export default mongoose.models.Post || mongoose.model('Post', postSchema)
