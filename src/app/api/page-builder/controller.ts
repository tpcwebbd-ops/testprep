import { withDB } from '@/app/api/utils/db';
import { FilterQuery } from 'mongoose';
import Section from './model';
import { formatResponse, IResponse } from '@/app/api/utils/utils';

export async function createSection(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const sectionData = await req.json();
      const newSection = await Section.create({
        ...sectionData,
      });
      return formatResponse(newSection, 'Section created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function getSectionById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Section ID is required', 400);

    const section = await Section.findById(id);
    if (!section) return formatResponse(null, 'Section not found', 404);

    return formatResponse(section, 'Section fetched successfully', 200);
  });
}

export async function getSections(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');

    let searchFilter: FilterQuery<unknown> = {};

    if (searchQuery) {
      if (searchQuery.startsWith('createdAt:range:')) {
        const datePart = searchQuery.split(':')[2];
        const [startDateString, endDateString] = datePart.split('_');

        if (startDateString && endDateString) {
          const startDate = new Date(startDateString);
          const endDate = new Date(endDateString);
          endDate.setUTCHours(23, 59, 59, 999);

          searchFilter = {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          };
        }
      } else {
        const orConditions: FilterQuery<unknown>[] = [];

        const stringFields = [
          'title',
          'sectionUid',
          'content.title',
          'content.heading',
          'content.description',
          'content.featuredLabel',
          'content.buttonPrimary',
          'content.buttonSecondary',
          'content.studentCount',
          'content.enrollmentText',
          'content.subtitle',
          'content.additionalDescription',
          'content.ctaText',
          'content.highlights',
        ];

        stringFields.forEach(field => {
          orConditions.push({ [field]: { $regex: searchQuery, $options: 'i' } });
        });

        const booleanQuery = searchQuery.toLowerCase();
        if (booleanQuery === 'true' || booleanQuery === 'false') {
          orConditions.push({ isActive: booleanQuery === 'true' });
        }

        if (orConditions.length > 0) {
          searchFilter = { $or: orConditions };
        }
      }
    }

    const sections = await Section.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

    const totalSections = await Section.countDocuments(searchFilter);

    return formatResponse(
      {
        sections: sections || [],
        total: totalSections,
        page,
        limit,
      },
      'Sections fetched successfully',
      200,
    );
  });
}

export async function updateSection(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedSection = await Section.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedSection) return formatResponse(null, 'Section not found', 404);
      return formatResponse(updatedSection, 'Section updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function bulkUpdateSections(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }) =>
        Section.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }),
      ),
    );

    const successfulUpdates = results.filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value).map(r => r.value);

    const failedUpdates = results
      .map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i].id : null))
      .filter((id): id is string => id !== null);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

export async function deleteSection(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedSection = await Section.findByIdAndDelete(id);
    if (!deletedSection) return formatResponse(null, 'Section not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Section deleted successfully', 200);
  });
}

export async function bulkDeleteSections(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids }: { ids: string[] } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const doc = await Section.findById(id);
        if (doc) {
          const deletedDoc = await Section.findByIdAndDelete(id);
          if (deletedDoc) {
            deletedIds.push(id);
          }
        } else {
          invalidIds.push(id);
        }
      } catch {
        invalidIds.push(id);
      }
    }

    return formatResponse({ deleted: deletedIds.length, deletedIds, invalidIds }, 'Bulk delete operation completed', 200);
  });
}
