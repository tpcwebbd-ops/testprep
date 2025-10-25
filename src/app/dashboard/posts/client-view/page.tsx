'use client'

import { useEffect, useState } from 'react'
import CustomLink from './CustomButton' // Renamed for clarity (component should be Link)

// A more specific type for the data items, ensuring type safety.
type DataItem = {
    _id: string;
    title: string;
    [key: string]: unknown; // Allow for other properties from the API
};

const Page = () => {
    const [data, setData] = useState<DataItem[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            
            try {
                // Best practice: Use environment variables for API endpoints.
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                const url = `${baseUrl}/generate/posts/all/api/v1?page=1&limit=10`;

                // Example using a token from environment variables for authorization.
                const token = process.env.NEXT_PUBLIC_Token
                if (!token) {
                    throw new Error("API token is not configured.");
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }

                const responseData = await response.json()
                // Safely access nested data to prevent runtime errors.
                setData(responseData?.data?.data || [])
            } catch (err) {
                setError((err as Error).message || 'An unknown error occurred.')
                setData([]) // Ensure data is an array on error.
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
    }, [])

    if (loading) {
        return <div className="text-center p-8">Loading Posts...</div>
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>
    }

    return (
        <main className="w-full flex flex-col gap-4 p-1 md:p-4">
            <h1 className="text-2xl font-bold">All Posts</h1>
            {data.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {data.map((item) => (
                        <div key={item._id}>
                            <CustomLink
                                name={item.title}
                                url={`/dashboard/posts/client-view/details/${item._id}`}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 bg-slate-100 dark:bg-slate-800 rounded-md">
                    No Posts found.
                </div>
            )}
        </main>
    )
}

export default Page
