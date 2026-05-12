/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';

import Enrollment from './model';
import AccessManagement from '@/app/api/accessManagements/v1/model';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createEnrollment(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const enrollmentData = await req.json();
      const newEnrollment = await Enrollment.create(enrollmentData);
      if (enrollmentData.paymentStatus === 'completed' && enrollmentData.studentEmail) {
        const existing = await AccessManagement.findOne({ user_email: enrollmentData.studentEmail });
        if (!existing) {
          await AccessManagement.create({
            given_by_email: 'tpc_payment@gmail.com',
            user_name: enrollmentData.studentName,
            user_email: enrollmentData.studentEmail,
            assign_role: ['Student'],
          });
        }
      }
      return formatResponse(newEnrollment, 'Enrollment created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getEnrollmentById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);
    const enrollment = await Enrollment.findById(id);
    if (!enrollment) return formatResponse(null, 'Not found', 404);
    return formatResponse(enrollment, 'Fetched successfully', 200);
  });
}

export async function getEnrollments(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '1000');
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');
    let filter: FilterQuery<unknown> = {};

    if (searchQuery) {
      filter = {
        $or: [
          { studentName: { $regex: searchQuery, $options: 'i' } },
          { studentEmail: { $regex: searchQuery, $options: 'i' } },
          { couponCode: { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    const enrollments = await Enrollment.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Enrollment.countDocuments(filter);
    return formatResponse({ enrollments, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function getAllEnrollments(): Promise<IResponse> {
  return withDB(async () => {
    const page = 1;
    const limit = 1000;
    const skip = (page - 1) * limit;
    const filter: FilterQuery<unknown> = {};
    const enrollments = await Enrollment.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Enrollment.countDocuments(filter);
    return formatResponse({ enrollments, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateEnrollment(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);
      const updated = await Enrollment.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: false,
      });
      if (!updated) return formatResponse(null, 'Not found', 404);

      return formatResponse(updated, 'Updated successfully', 200);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function deleteEnrollment(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);
    const deleted = await Enrollment.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}
