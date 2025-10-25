'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Dynamically generated type for the data state
type Data = {
    _id: string; // Assuming an ID field from the database
    "title"?: string;
    "email"?: string;
    "password"?: string;
    "passcode"?: string;
    "area"?: string;
    "sub-area"?: string[];
    "products-images"?: string[];
    "personal-image"?: string;
    "description"?: string;
    "age"?: number;
    "amount"?: number;
    "isActive"?: boolean;
    "start-date"?: Date | string;
    "start-time"?: string;
    "schedule-date"?: { start: Date | string; end: Date | string };
    "schedule-time"?: { start: string; end: string };
    "favorite-color"?: string;
    "number"?: string;
    "profile"?: string;
    "test"?: string;
    "info"?: string;
    "shift"?: string;
    "policy"?: boolean;
    "hobbies"?: string[];
    "ideas"?: string[];
    "students"?: Array<{ Name: string; Class: string; Roll: string }>;
    "complexValue"?: {
        "id"?: string;
        "title"?: string;
        "parent"?: {
            "id"?: string;
            "title"?: string;
            "child"?: {
                "id"?: string;
                "title"?: string;
                "child"?: string;
                "note"?: string
            };
            "note"?: string
        };
        "note"?: string
    }
}

const Page = () => {
    const [data, setData] = useState<Data | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const pathname = usePathname()

    // This logic is brittle and assumes a fixed URL structure.
    // Consider using Next.js dynamic route parameters for more robust ID extraction.
    const id = pathname.split('/').pop()

    useEffect(() => {
        if (!id) {
            setLoading(false)
            setError("No ID found in the URL.")
            return
        }

        const fetchData = async () => {
            setLoading(true)
            setError(null)
            
            // It's best practice to use environment variables for API URLs.
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const url = `${baseUrl}/generate/posts/all/api/v1?id=${id}`;
            
            try {
                // Using a generic token from env for auth example.
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
                if (responseData && responseData.data) {
                    setData(responseData.data)
                } else {
                    throw new Error("No data found in the response.");
                }

            } catch (err) {
                setError((err as Error).message || 'An unknown error occurred.')
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
    }, [id])

    if (loading) {
        return <div className="text-center p-8">Loading Post details...</div>
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>
    }
    
    if (!data) {
        return <div className="text-center p-8">No data available for this Post.</div>
    }

    return (
        <div className="w-full flex flex-col md:p-4 p-1 gap-4">
            <h1 className="text-2xl font-bold">Post Details</h1>
            <div className="border border-slate-300 rounded-md overflow-hidden dark:border-slate-600">
                <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">title:</strong> {data?.["title"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">email:</strong> {data?.["email"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">password:</strong> {data?.["password"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">passcode:</strong> {data?.["passcode"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">area:</strong> {data?.["area"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">sub area:</strong> {(data?.["sub-area"] as string[])?.join(', ')}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">products images:</strong> {(data?.["products-images"] as string[])?.join(', ')}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">personal image:</strong> {data?.["personal-image"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">description:</strong> {data?.["description"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">age:</strong> {data?.["age"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">amount:</strong> {data?.["amount"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">isActive:</strong> {data?.["isActive"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">start date:</strong> {data?.["start-date"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">start time:</strong> {data?.["start-time"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">schedule date:</strong> {data?.["schedule-date"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">schedule time:</strong> {data?.["schedule-time"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">favorite color:</strong> {data?.["favorite-color"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">number:</strong> {data?.["number"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">profile:</strong> {data?.["profile"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">test:</strong> {data?.["test"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">info:</strong> {data?.["info"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">shift:</strong> {data?.["shift"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">policy:</strong> {data?.["policy"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">hobbies:</strong> {(data?.["hobbies"] as string[])?.join(', ')}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">ideas:</strong> {(data?.["ideas"] as string[])?.join(', ')}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">students:</strong> <pre className="text-sm bg-slate-200 dark:bg-slate-900 p-2 rounded-md whitespace-pre-wrap">{JSON.stringify(data?.["students"], null, 2)}</pre>
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">complexValue:</strong> <pre className="text-sm bg-slate-200 dark:bg-slate-900 p-2 rounded-md whitespace-pre-wrap">{JSON.stringify(data?.["complexValue"], null, 2)}</pre>
            </div>
            </div>
            <Link
                href="/dashboard/posts"
                className="w-full text-center hover:bg-slate-400 bg-slate-300 p-2 border border-slate-400 rounded-md dark:bg-slate-600 dark:hover:bg-slate-500"
            >
                Back to List
            </Link>
        </div>
    )
}
export default Page
