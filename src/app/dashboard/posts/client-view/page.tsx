'use client'

import { useEffect, useState } from 'react'

import CustomLInk from './CustomButton'

// Define a type for the data items for better type safety
type DataItem = {
    title: string;
    _id: string;
    [key: string]: any; // Allow other properties
};

const Page = () => {
    const [data, setData] = useState<DataItem[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const token = process.env.NEXT_PUBLIC_Token
            if (!token) {
                console.error(
                    'Authentication token not found. Unable to fetch data.'
                )
                return
            }
            const url =
                'http://localhost:3000/dashboard/post/all/api/v1?page=1&limit=4'

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const responseData = await response.json()
                // Use optional chaining for safer access
                setData(responseData?.data?.posts || [])
            } catch (error) {
                console.error('Failed to fetch data:', error)
                setData([]) // Ensure data is an array on error
            }
        }
        fetchData()
    }, [])

    return (
        <main className="w-full flex flex-col gap-2 p-1 md:p-4">
            {data?.map((item: DataItem, idx: number) => (
                <div key={idx + item?._id}>
                    <CustomLInk
                        name={item.title}
                        url={`/dashboard/post/client-view/details/${item._id}`}
                    />
                </div>
            ))}
        </main>
    )
}
export default Page
