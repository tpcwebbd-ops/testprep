loo at the example of posts
postsSlice.ts
```
// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const postsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/api/posts/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypePosts', id: 'LIST' }],
        }),
        getPostsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/api/posts/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypePosts', id: 'LIST' }],
        }),
        getPostsById: builder.query({
            query: (id) => `/api/posts/v1?id=${id}`,
        }),
        addPosts: builder.mutation({
            query: (newPost) => ({
                url: '/api/posts/v1',
                method: 'POST',
                body: newPost,
            }),
            invalidatesTags: [{ type: 'tagTypePosts' }],
        }),
        updatePosts: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/posts/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypePosts' }],
        }),
        deletePosts: builder.mutation({
            query: ({ id }) => ({
                url: `/api/posts/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypePosts' }],
        }),
        bulkUpdatePosts: builder.mutation({
            query: (bulkData) => ({
                url: `/api/posts/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypePosts' }],
        }),
        bulkDeletePosts: builder.mutation({
            query: (bulkData) => ({
                url: `/api/posts/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypePosts' }],
        }),
    }),
})

export const {
    useGetPostsQuery,
    useGetPostsSummaryQuery,
    useAddPostsMutation,
    useUpdatePostsMutation,
    useDeletePostsMutation,
    useBulkUpdatePostsMutation,
    useBulkDeletePostsMutation,
    useGetPostsByIdQuery,
} = postsApi

```

posts/route.ts
```
import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    bulkUpdatePosts,
    bulkDeletePosts,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Posts
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getPostById(req)
        : await getPosts(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Post
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createPost(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Post
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdatePosts(req)
        : await updatePost(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Post
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeletePosts(req)
        : await deletePost(req);

    return formatResponse(result.data, result.message, result.status);
}
```

posts/controller.ts
```
import { withDB } from '@/app/api/utils/db'
import { FilterQuery } from 'mongoose'

import Post from './model'

import { formatResponse, IResponse } from '@/app/api/utils/utils';

// CREATE Post
export async function createPost(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const postData = await req.json()
            const newPost = await Post.create({
                ...postData,
            })
            return formatResponse(
                newPost,
                'Post created successfully',
                201
            )
        } catch (error: unknown) {
            if ((error as { code?: number }).code === 11000) {
                const err = error as { keyValue?: Record<string, unknown> }
                return formatResponse(
                    null,
                    `Duplicate key error: ${JSON.stringify(err.keyValue)}`,
                    400
                )
            }
            throw error // Re-throw other errors to be handled by `withDB`
        }
    })
}

// GET single Post by ID
export async function getPostById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, 'Post ID is required', 400)

        const post = await Post.findById(id)
        if (!post)
            return formatResponse(null, 'Post not found', 404)

        return formatResponse(
            post,
            'Post fetched successfully',
            200
        )
    })
}

// GET all Posts with pagination and intelligent search
export async function getPosts(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const url = new URL(req.url)
        const page = parseInt(url.searchParams.get('page') || '1', 10)
        const limit = parseInt(url.searchParams.get('limit') || '10', 10)
        const skip = (page - 1) * limit
        const searchQuery = url.searchParams.get('q')

        let searchFilter: FilterQuery<unknown> = {}

        if (searchQuery) {
            // Check for date range filter format first
            if (searchQuery.startsWith('createdAt:range:')) {
                const datePart = searchQuery.split(':')[2];
                const [startDateString, endDateString] = datePart.split('_');

                if (startDateString && endDateString) {
                    const startDate = new Date(startDateString);
                    const endDate = new Date(endDateString);
                    // To ensure the range is inclusive, set the time to the end of the day
                    endDate.setUTCHours(23, 59, 59, 999);

                    searchFilter = {
                        createdAt: {
                            $gte: startDate, // Greater than or equal to the start date
                            $lte: endDate,   // Less than or equal to the end date
                        },
                    };
                }
            } else {
                // Fallback to original generic search logic
                const orConditions: FilterQuery<unknown>[] = []

                // Add regex search conditions for all string-like fields
                const stringFields = ["title","email","description","number","profile","test","complexValue.id","complexValue.title","complexValue.parent.id","complexValue.parent.title","complexValue.parent.child.id","complexValue.parent.child.title","complexValue.parent.child.child","complexValue.parent.child.note","complexValue.parent.note","complexValue.note"];
                stringFields.forEach(field => {
                    orConditions.push({ [field]: { $regex: searchQuery, $options: 'i' } });
                });

                // If the query is a valid number, add equality checks for all number fields
                const numericQuery = parseFloat(searchQuery);
                if (!isNaN(numericQuery)) {
                    const numberFields : string[]= ["age","amount"];
                    numberFields.forEach(field => {
                        orConditions.push({ [field]: numericQuery });
                    });
                }

                if (orConditions.length > 0) {
                    searchFilter = { $or: orConditions };
                }
            }
        }

        const posts = await Post.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalPosts =
            await Post.countDocuments(searchFilter)

        return formatResponse(
            {
                posts: posts || [],
                total: totalPosts,
                page,
                limit,
            },
            'Posts fetched successfully',
            200
        )
    })
}

// UPDATE single Post by ID
export async function updatePost(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedPost = await Post.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updatedPost)
                return formatResponse(null, 'Post not found', 404)
            return formatResponse(
                updatedPost,
                'Post updated successfully',
                200
            )
        } catch (error: unknown) {
            if ((error as { code?: number }).code === 11000) {
                const err = error as { keyValue?: Record<string, unknown> }
                return formatResponse(
                    null,
                    `Duplicate key error: ${JSON.stringify(err.keyValue)}`,
                    400
                )
            }
            throw error // Re-throw other errors to be handled by `withDB`
        }
    })
}

// BULK UPDATE Posts
export async function bulkUpdatePosts(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                Post.findByIdAndUpdate(id, updateData, {
                    new: true,
                    runValidators: true,
                })
            )
        )

        const successfulUpdates = results
            .filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value)
            .map((r) => r.value)
            
        const failedUpdates = results
            .map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i].id : null))
            .filter((id): id is string => id !== null)

        return formatResponse(
            { updated: successfulUpdates, failed: failedUpdates },
            'Bulk update completed',
            200
        )
    })
}

// DELETE single Post by ID
export async function deletePost(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedPost = await Post.findByIdAndDelete(id)
        if (!deletedPost)
            return formatResponse(
                null,
                'Post not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            'Post deleted successfully',
            200
        )
    })
}

// BULK DELETE Posts
export async function bulkDeletePosts(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await Post.findById(id)
                if (doc) {
                    const deletedDoc = await Post.findByIdAndDelete(id)
                    if (deletedDoc) {
                        deletedIds.push(id)
                    }
                } else {
                    invalidIds.push(id)
                }
            } catch {
                invalidIds.push(id)
            }
        }

        return formatResponse(
            { deleted: deletedIds.length, deletedIds, invalidIds },
            'Bulk delete operation completed',
            200
        )
    })
}

```

posts/model.ts
```
import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    "title": { type: String },
    "email": {
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

```

and look care fully 
here is example of page-builder

page-builder/route.ts
```
import { revalidatePath } from 'next/cache';
import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getSections, createSection, updateSection, deleteSection, getSectionById, bulkUpdateSections, bulkDeleteSections } from './controller';

import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getSectionById(req) : await getSections(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await createSection(req);

  if (result.status === 200 || result.status === 201) {
    revalidatePath('/page-builder');
  }

  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateSections(req) : await updateSection(req);

  if (result.status === 200) {
    revalidatePath('/page-builder');
  }

  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteSections(req) : await deleteSection(req);

  if (result.status === 200) {
    revalidatePath('/page-builder');
  }

  return formatResponse(result.data, result.message, result.status);
}

```

page-builder/controller.ts
```
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
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 409);
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

      if (!id) {
        return formatResponse(null, 'Section ID is required', 400);
      }

      const updatedSection = await Section.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedSection) return formatResponse(null, 'Section not found', 404);
      return formatResponse(updatedSection, 'Section updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function bulkUpdateSections(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json();

    if (!Array.isArray(updates) || updates.length === 0) {
      return formatResponse(null, 'Updates array is required and cannot be empty', 400);
    }

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

    const allFailed = successfulUpdates.length === 0 && failedUpdates.length > 0;
    const partialSuccess = successfulUpdates.length > 0 && failedUpdates.length > 0;

    if (allFailed) {
      return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'All bulk updates failed', 400);
    }

    if (partialSuccess) {
      return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update partially completed', 207);
    }

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed successfully', 200);
  });
}

export async function deleteSection(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();

    if (!id) {
      return formatResponse(null, 'Section ID is required', 400);
    }

    const deletedSection = await Section.findByIdAndDelete(id);
    if (!deletedSection) return formatResponse(null, 'Section not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Section deleted successfully', 200);
  });
}

export async function bulkDeleteSections(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids }: { ids: string[] } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return formatResponse(null, 'IDs array is required and cannot be empty', 400);
    }

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

    const allFailed = deletedIds.length === 0 && invalidIds.length > 0;
    const partialSuccess = deletedIds.length > 0 && invalidIds.length > 0;

    if (allFailed) {
      return formatResponse({ deleted: 0, deletedIds, invalidIds }, 'All bulk deletes failed', 400);
    }

    if (partialSuccess) {
      return formatResponse({ deleted: deletedIds.length, deletedIds, invalidIds }, 'Bulk delete partially completed', 207);
    }

    return formatResponse({ deleted: deletedIds.length, deletedIds, invalidIds }, 'Bulk delete completed successfully', 200);
  });
}

```

page-builder/model.ts
```
import mongoose, { Schema } from 'mongoose';

const sectionContentSchema = new Schema({
  sectionUid: { type: String },
  title: { type: String },
  image: { type: String },
  heading: { type: String },
  description: { type: String },
  featuredLabel: { type: String },
  buttonPrimary: { type: String },
  buttonSecondary: { type: String },
  studentCount: { type: String },
  enrollmentText: { type: String },
  secondaryImage: { type: String },
  subtitle: { type: String },
  additionalDescription: { type: String },
  ctaText: { type: String },
  highlights: [{ type: String }],
});

const pageBuilderSchema = new Schema(
  {
    title: { type: String, default: 'Main Page' },
    path: { type: String, default: '/' },
    content: [
      {
        id: { type: String },
        title: { type: String },
        sectionUid: { type: String },
        serialNumber: { type: Number },
        content: { type: sectionContentSchema },
        isActive: { type: Boolean, default: false },
        picture: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.PageBuilder || mongoose.model('PageBuilder', pageBuilderSchema);

```

Now your task is please generate pageBuilderSlice.ts 
