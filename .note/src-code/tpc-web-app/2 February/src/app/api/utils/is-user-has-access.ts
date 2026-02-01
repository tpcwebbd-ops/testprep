/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import connectDB from '@/app/api/utils/mongoose';
import AccessManagement from '../accessManagements/v1/model';
import Role from '../roles/v1/model';

interface IAccess {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface IRoles {
  user: IAccess;
  website_setting: IAccess;
  role_permission: IAccess;
  access_management: IAccess;
  course: IAccess;
  review: IAccess;
  lecture: IAccess;
  batch: IAccess;
  q_and_a: IAccess;
  content_resource: IAccess;
  assessment: IAccess;
  payment: IAccess;
  submissions: IAccess;
  enrollment: IAccess;
  marketing_lead: IAccess;
  profile: IAccess;
  message: IAccess;
  media: IAccess;
  follow_up: IAccess;
  attendance: IAccess;
  company_goal: IAccess;
  support_ticket: IAccess;
  post: IAccess;
  reward: IAccess;
  employee_task: IAccess;
}

export interface IWantAccess {
  db_name: keyof IRoles;
  access: 'create' | 'read' | 'update' | 'delete';
}

const getRoleByEmail = async (email: string): Promise<string[]> => {
  await connectDB();
  const accessManagement = await AccessManagement.findOne({ user_email: email });
  if (!accessManagement) return [];
  return accessManagement.assign_role;
};

const getRolesData = async (role: string): Promise<IRoles | null> => {
  await connectDB();
  const getRoles = await Role.findOne({ name: role });
  return getRoles?.role;
};

export const isUserHasAccess = async (arg: IWantAccess) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ data: null, message: 'Please provide a session', status: 430 }, { status: 430 });
  }

  const getUserRoles = await getRoleByEmail(email);

  if (getUserRoles.length === 0) {
    return NextResponse.json({ data: null, message: 'You do not have access', status: 435 }, { status: 435 });
  }

  for (const roleName of getUserRoles) {
    const rolesData = await getRolesData(roleName);
    // console.log('rolesData : ', rolesData);
    if (!rolesData) continue;

    const allowed = rolesData[arg.db_name as keyof IRoles][arg.access];
    if (allowed === true) {
      return null;
    }
  }

  return NextResponse.json({ data: null, message: 'You do not have access', status: 436 }, { status: 436 });
};
