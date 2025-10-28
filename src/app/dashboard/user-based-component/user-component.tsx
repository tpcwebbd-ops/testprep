import { JSX } from 'react';

// Profile & Message
import ParsonalProfile from './all-components/profile/parsonalProfile';
import AdminProfile from './all-components/profile/adminProfile';

import ParsonalMessage from './all-components/message/parsonalMessage';
import AdminMessage from './all-components/message/adminMessage';

import ParsonalAssignment from './all-components/assignment/parsonalAssignment';
import AdminAssignment from './all-components/assignment/adminAssignment';

import ParsonalTest from './all-components/test/parsonalTest';
import AdminTest from './all-components/test/adminTest';

import ParsonalMockTest from './all-components/mock-test/parsonalMockTest';
import AdminMockTest from './all-components/mock-test/adminMockTest';

import ParsonalReview from './all-components/review/parsonalReview';
import AdminReview from './all-components/review/adminReview';

import ParsonalPayment from './all-components/payment/parsonalPayment';
import AdminPayment from './all-components/payment/adminPayment';

import ParsonalBookMark from './all-components/book-mark/parsonalBookMark';
import AdminBookMark from './all-components/book-mark/adminBookMark';

import ParsonalMyClass from './all-components/my-class/parsonalMyClass';
import AdminMyClass from './all-components/my-class/adminMyClass';

import ParsonalMyCourse from './all-components/my-course/parsonalMyCourse';
import AdminMyCourse from './all-components/my-course/adminMyCourse';

import ParsonalAttendance from './all-components/attendance/parsonalAttendance';
import AdminAttendance from './all-components/attendance/adminAttendance';

import ParsonalSupport from './all-components/support/parsonalSupport';
import AdminSupport from './all-components/support/adminSupport';

import ParsonalBatch from './all-components/batch/parsonalBatch';
import AdminBatch from './all-components/batch/adminBatch';

import ParsonalAbsentStudent from './all-components/absent-student/parsonalAbsentStudent';
import AdminAbsentStudent from './all-components/absent-student/adminAbsentStudent';

import ParsonalTaskAndReview from './all-components/task-and-review/parsonalTaskAndReview';
import AdminTaskAndReview from './all-components/task-and-review/adminTaskAndReview';

import ParsonalReward from './all-components/reward/parsonalReward';
import AdminReward from './all-components/reward/adminReward';

import ParsonalTargetAndGoal from './all-components/target-and-goal/parsonalTargetAndGoal';
import AdminTargetAndGoal from './all-components/target-and-goal/adminTargetAndGoal';

import ParsonalWorkSummary from './all-components/work-summary/parsonalWorkSummary';
import AdminWorkSummary from './all-components/work-summary/adminWorkSummary';

import ParsonalAccessManagement from './all-components/access-management/parsonalAccessManagement';
import AdminAccessManagement from './all-components/access-management/adminAccessManagement';

import ParsonalBatchAndProgress from './all-components/batch-and-progress/parsonalBatchAndProgress';
import AdminBatchAndProgress from './all-components/batch-and-progress/adminBatchAndProgress';

import ParsonalEmployeeProgress from './all-components/employee-progress/parsonalEmployeeProgress';
import AdminEmployeeProgress from './all-components/employee-progress/adminEmployeeProgress';

import ParsonalSummary from './all-components/summary/parsonalSummary';
import AdminSummary from './all-components/summary/adminSummary';

import ParsonalCourseContent from './all-components/course-content/parsonalCourseContent';
import AdminCourseContent from './all-components/course-content/adminCourseContent';

import ParsonalMedia from './all-components/media/parsonalMedia';
import AdminMedia from './all-components/media/adminMedia';

import ParsonalSiteSetting from './all-components/site-setting/parsonalSiteSetting';
import AdminSiteSetting from './all-components/site-setting/adminSiteSetting';

import ParsonalContentPlanner from './all-components/content-planner/parsonalContentPlanner';
import AdminContentPlanner from './all-components/content-planner/adminContentPlanner';

import ParsonalAudienceModifier from './all-components/audience-modifier/parsonalAudienceModifier';
import AdminAudienceModifier from './all-components/audience-modifier/adminAudienceModifier';
export interface IUserComponentMapping {
  id: number;
  name: string;
  component: JSX.Element | null;
}

export interface IUserComponentAndRole {
  id: number;
  name: string;
  path: string;
  userAndComponentLst: IUserComponentMapping[];
}

export const userComponentAndRole: IUserComponentAndRole[] = [
  {
    id: 1,
    name: 'Profile',
    path: '/profile',
    userAndComponentLst: [
      { id: 1, name: 'My Profile', component: <ParsonalProfile /> },
      { id: 2, name: 'Admin Profile', component: <AdminProfile /> },
    ],
  },
  {
    id: 2,
    name: 'Message',
    path: '/message',
    userAndComponentLst: [
      { id: 3, name: 'My Message', component: <ParsonalMessage /> },
      { id: 4, name: 'Admin Message', component: <AdminMessage /> },
    ],
  },
  {
    id: 3,
    name: 'Assignment',
    path: '/assignment',
    userAndComponentLst: [
      { id: 5, name: 'My Assignment', component: <ParsonalAssignment /> },
      { id: 6, name: 'Admin Assignment', component: <AdminAssignment /> },
    ],
  },
  {
    id: 4,
    name: 'Test',
    path: '/test',
    userAndComponentLst: [
      { id: 7, name: 'My Test', component: <ParsonalTest /> },
      { id: 8, name: 'Admin Test', component: <AdminTest /> },
    ],
  },
  {
    id: 5,
    name: 'Mock Test',
    path: '/mock-test',
    userAndComponentLst: [
      { id: 9, name: 'My Mock Test', component: <ParsonalMockTest /> },
      { id: 10, name: 'Admin Mock Test', component: <AdminMockTest /> },
    ],
  },
  {
    id: 6,
    name: 'Review',
    path: '/review',
    userAndComponentLst: [
      { id: 11, name: 'My Review', component: <ParsonalReview /> },
      { id: 12, name: 'Admin Review', component: <AdminReview /> },
    ],
  },
  {
    id: 7,
    name: 'Payment',
    path: '/payment',
    userAndComponentLst: [
      { id: 13, name: 'My Payment', component: <ParsonalPayment /> },
      { id: 14, name: 'Admin Payment', component: <AdminPayment /> },
    ],
  },
  {
    id: 8,
    name: 'Bookmark',
    path: '/book-mark',
    userAndComponentLst: [
      { id: 15, name: 'My Bookmark', component: <ParsonalBookMark /> },
      { id: 16, name: 'Admin Bookmark', component: <AdminBookMark /> },
    ],
  },
  {
    id: 9,
    name: 'My Class',
    path: '/my-class',
    userAndComponentLst: [
      { id: 17, name: 'My Class', component: <ParsonalMyClass /> },
      { id: 18, name: 'Admin Class', component: <AdminMyClass /> },
    ],
  },
  {
    id: 10,
    name: 'My Course',
    path: '/my-course',
    userAndComponentLst: [
      { id: 19, name: 'My Course', component: <ParsonalMyCourse /> },
      { id: 20, name: 'Admin Course', component: <AdminMyCourse /> },
    ],
  },
  {
    id: 11,
    name: 'Attendance',
    path: '/attendance',
    userAndComponentLst: [
      { id: 21, name: 'My Attendance', component: <ParsonalAttendance /> },
      { id: 22, name: 'Admin Attendance', component: <AdminAttendance /> },
    ],
  },
  {
    id: 12,
    name: 'Support',
    path: '/support',
    userAndComponentLst: [
      { id: 23, name: 'My Support', component: <ParsonalSupport /> },
      { id: 24, name: 'Admin Support', component: <AdminSupport /> },
    ],
  },
  {
    id: 13,
    name: 'Batch',
    path: '/batch',
    userAndComponentLst: [
      { id: 25, name: 'My Batch', component: <ParsonalBatch /> },
      { id: 26, name: 'Admin Batch', component: <AdminBatch /> },
    ],
  },
  {
    id: 14,
    name: 'Absent Student',
    path: '/absent-student',
    userAndComponentLst: [
      { id: 27, name: 'My Absent Student', component: <ParsonalAbsentStudent /> },
      { id: 28, name: 'Admin Absent Student', component: <AdminAbsentStudent /> },
    ],
  },
  {
    id: 15,
    name: 'Task and Review',
    path: '/task-and-review',
    userAndComponentLst: [
      { id: 29, name: 'My Task and Review', component: <ParsonalTaskAndReview /> },
      { id: 30, name: 'Admin Task and Review', component: <AdminTaskAndReview /> },
    ],
  },
  {
    id: 16,
    name: 'Reward',
    path: '/reward',
    userAndComponentLst: [
      { id: 31, name: 'My Reward', component: <ParsonalReward /> },
      { id: 32, name: 'Admin Reward', component: <AdminReward /> },
    ],
  },
  {
    id: 17,
    name: 'Target and Goal',
    path: '/target-and-goal',
    userAndComponentLst: [
      { id: 33, name: 'My Target and Goal', component: <ParsonalTargetAndGoal /> },
      { id: 34, name: 'Admin Target and Goal', component: <AdminTargetAndGoal /> },
    ],
  },
  {
    id: 18,
    name: 'Work Summary',
    path: '/work-summary',
    userAndComponentLst: [
      { id: 35, name: 'My Work Summary', component: <ParsonalWorkSummary /> },
      { id: 36, name: 'Admin Work Summary', component: <AdminWorkSummary /> },
    ],
  },
  {
    id: 19,
    name: 'Access Management',
    path: '/access-management',
    userAndComponentLst: [
      { id: 37, name: 'My Access Management', component: <ParsonalAccessManagement /> },
      { id: 38, name: 'Admin Access Management', component: <AdminAccessManagement /> },
    ],
  },
  {
    id: 20,
    name: 'My Batch & Progress',
    path: '/batch-and-progress',
    userAndComponentLst: [
      { id: 39, name: 'My Batch & Progress', component: <ParsonalBatchAndProgress /> },
      { id: 40, name: 'Admin Batch & Progress', component: <AdminBatchAndProgress /> },
    ],
  },
  {
    id: 21,
    name: 'Employee Progress',
    path: '/employee-progress',
    userAndComponentLst: [
      { id: 41, name: 'My Employee Progress', component: <ParsonalEmployeeProgress /> },
      { id: 42, name: 'Admin Employee Progress', component: <AdminEmployeeProgress /> },
    ],
  },
  {
    id: 22,
    name: 'Summary',
    path: '/summary',
    userAndComponentLst: [
      { id: 43, name: 'My Summary', component: <ParsonalSummary /> },
      { id: 44, name: 'Admin Summary', component: <AdminSummary /> },
    ],
  },
  {
    id: 23,
    name: 'Course Content',
    path: '/course-content',
    userAndComponentLst: [
      { id: 45, name: 'My Course Content', component: <ParsonalCourseContent /> },
      { id: 46, name: 'Admin Course Content', component: <AdminCourseContent /> },
    ],
  },
  {
    id: 24,
    name: 'Media',
    path: '/media',
    userAndComponentLst: [
      { id: 47, name: 'My Media', component: <ParsonalMedia /> },
      { id: 48, name: 'Admin Media', component: <AdminMedia /> },
    ],
  },
  {
    id: 25,
    name: 'Site Setting',
    path: '/site-setting',
    userAndComponentLst: [
      { id: 49, name: 'My Site Setting', component: <ParsonalSiteSetting /> },
      { id: 50, name: 'Admin Site Setting', component: <AdminSiteSetting /> },
    ],
  },
  {
    id: 26,
    name: 'Content Planner',
    path: '/content-planner',
    userAndComponentLst: [
      { id: 51, name: 'My Content Planner', component: <ParsonalContentPlanner /> },
      { id: 52, name: 'Admin Content Planner', component: <AdminContentPlanner /> },
    ],
  },
  {
    id: 27,
    name: 'Audience Modifier',
    path: '/audience-modifier',
    userAndComponentLst: [
      { id: 53, name: 'My Audience Modifier', component: <ParsonalAudienceModifier /> },
      { id: 54, name: 'Admin Audience Modifier', component: <AdminAudienceModifier /> },
    ],
  },
];
