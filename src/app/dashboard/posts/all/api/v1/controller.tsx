import { withDB } from '@/app/api/utils/db'

import Post from './model'

interface IResponse {
    data: unknown
    message: string
    status: number
}

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
    data,
    message,
    status,
})

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

// GET all Posts with pagination
export async function getPosts(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const url = new URL(req.url)
        const page = parseInt(url.searchParams.get('page') || '1', 10)
        const limit = parseInt(url.searchParams.get('limit') || '10', 10)
        const skip = (page - 1) * limit

        const searchQuery = url.searchParams.get('q')

        let searchFilter = {}

        // Apply search filter only if a search query is provided
        if (searchQuery) {
            searchFilter = {
                $or: [
                        { 'title': { $regex: searchQuery, $options: 'i' } },
                        { 'books': { $regex: searchQuery, $options: 'i' } }
                ],
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
            .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && r.value)
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
