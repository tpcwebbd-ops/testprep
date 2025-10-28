'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Dynamically generated type for the data state
type Data = {
    "student_id"?: string;
    "assigned_to_id "?: string;
    "title"?: string;
    "description"?: string;
    "created_at"?: string;
    "closed_at"?: string;
    "status"?: string
}

const Page = () => {
    const [data, setData] = useState<Data | null>(null)
    const pathname = usePathname()
    const id = pathname.split('/')[5]

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const token = process.env.NEXT_PUBLIC_Token
                if (!token) {
                    console.error(
                        'Authentication token not found. Unable to fetch data.'
                    )
                    return
                }

                const url = `http://localhost:3000/dashboard/support_Ticket/all/api/v1?id=${id}`
                
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })

                    const responseData = await response.json()
                    setData(responseData?.data)
                } catch (error) {
                    console.error('Failed to fetch data:', error)
                }
            }
            fetchData()
        }
    }, [id])
    
    return (
        <div className="w-full flex flex-col md:p-4 p-1 gap-4">
            <div className="border border-slate-400 rounded-md overflow-hidden">
                <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">student_id:</strong> {data?.["student_id"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">assigned_to_id :</strong> {data?.["assigned_to_id "]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">title:</strong> {data?.["title"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">description:</strong> {data?.["description"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">created_at:</strong> {data?.["created_at"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">closed_at:</strong> {data?.["closed_at"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">status:</strong> {data?.["status"]?.toString()}
            </div>
            </div>
            <Link
                href="/dashboard/support_Tickets"
                className="w-full text-center hover:bg-slate-400 bg-slate-300 p-2 border border-slate-400 rounded-md"
            >
                Back to List
            </Link>
        </div>
    )
}
export default Page
