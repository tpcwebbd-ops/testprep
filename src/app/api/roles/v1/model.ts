import mongoose, { Schema } from 'mongoose';

// Define the dashboard access schema structure
const dashboardAccessSchema = new Schema({
  list_id: { type: Number, required: true },
  title: { type: String, required: true },
  path: { type: String, required: true },
  dashboardType: { type: String, enum: ['parsonal', 'admin'], required: true },
  access: { type: Boolean, default: false },
});

const roleSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },

    role: {
      user: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      website_setting: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      role_permission: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      access_management: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      course: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      review: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      lecture: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      batch: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      q_and_a: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      content_resource: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      assessment: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      payment: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      submissions: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      enrollment: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      marketing_lead: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      profile: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      message: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      media: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      follow_up: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      attendance: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      company_goal: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      support_ticket: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      post: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      reward: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
      employee_task: { create: Boolean, read: Boolean, update: Boolean, delete: Boolean },
    },

    dashboard_access: {
      type: [dashboardAccessSchema],
      default: () => [
        { list_id: 1, title: 'Profile', path: '/dashboard/profile', dashboardType: 'parsonal', access: true },
        { list_id: 2, title: 'Web Message', path: '/dashboard/web-message', dashboardType: 'parsonal', access: true },
        { list_id: 3, title: 'Web Message', path: '/dashboard/admin/web-message', dashboardType: 'admin', access: true },
        { list_id: 4, title: 'Questions', path: '/dashboard/questions', dashboardType: 'parsonal', access: true },
        { list_id: 5, title: 'Questions', path: '/dashboard/admin/questions', dashboardType: 'admin', access: true },
        { list_id: 6, title: 'Course', path: '/dashboard/course', dashboardType: 'parsonal', access: true },
        { list_id: 7, title: 'Course', path: '/dashboard/admin/course', dashboardType: 'admin', access: true },
        { list_id: 8, title: 'Lecture', path: '/dashboard/lecture', dashboardType: 'parsonal', access: true },
        { list_id: 9, title: 'Lecture', path: '/dashboard/admin/lecture', dashboardType: 'admin', access: true },
        { list_id: 16, title: 'Payment', path: '/dashboard/payment', dashboardType: 'parsonal', access: true },
        { list_id: 17, title: 'Payment', path: '/dashboard/admin/payment', dashboardType: 'admin', access: true },
        { list_id: 30, title: 'Review', path: '/dashboard/review', dashboardType: 'parsonal', access: true },
        { list_id: 31, title: 'Review', path: '/dashboard/admin/review', dashboardType: 'admin', access: true },
        { list_id: 34, title: 'Reword', path: '/dashboard/reword', dashboardType: 'parsonal', access: true },
        { list_id: 35, title: 'Reword', path: '/dashboard/admin/reword', dashboardType: 'admin', access: true },
        { list_id: 24, title: 'Attendance', path: '/dashboard/attendance', dashboardType: 'parsonal', access: true },
        { list_id: 25, title: 'Attendance', path: '/dashboard/admin/attendance', dashboardType: 'admin', access: true },
        { list_id: 45, title: 'Media', path: '/dashboard/media', dashboardType: 'parsonal', access: true },
        { list_id: 46, title: 'Media', path: '/dashboard/admin/media', dashboardType: 'admin', access: true },
        { list_id: 26, title: 'Support', path: '/dashboard/support', dashboardType: 'parsonal', access: true },
        { list_id: 27, title: 'Support', path: '/dashboard/admin/support', dashboardType: 'admin', access: true },
        { list_id: 40, title: 'Access', path: '/dashboard/admin/access', dashboardType: 'admin', access: true },
        { list_id: 41, title: 'Finance', path: '/dashboard/admin/finance', dashboardType: 'admin', access: true },
        { list_id: 47, title: 'Content Planner', path: '/dashboard/admin/content-planner', dashboardType: 'admin', access: true },
        { list_id: 48, title: 'Site Setting', path: '/dashboard/admin/site-setting', dashboardType: 'admin', access: true },
        { list_id: 49, title: 'Audience Modifier', path: '/dashboard/admin/audience-modifier', dashboardType: 'admin', access: true },
      ],
    },
  },
  { timestamps: true },
);

export default mongoose.models.Role || mongoose.model('Role', roleSchema);
