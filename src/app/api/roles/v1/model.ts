import mongoose, { Schema } from 'mongoose';

const roleSchema = new Schema(
  {
    name: { type: String },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    role: {
      user: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      website_setting: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      role_permission: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      access_management: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      course: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      review: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      lecture: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      batch: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      q_and_a: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      content_resource: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      assessment: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      payment: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      submissions: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      enrollment: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      marketing_lead: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      profile: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      message: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      media: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      follow_up: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      attendance: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      company_goal: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      support_ticket: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      post: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      reward: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      'employee_task ': {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
    },
  },
  { timestamps: true },
);

export default mongoose.models.Role || mongoose.model('Role', roleSchema);
