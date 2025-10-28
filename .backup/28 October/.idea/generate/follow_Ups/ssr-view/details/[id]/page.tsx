import { notFound } from 'next/navigation'
import HomeButton from './HomeButton'

// Dynamically generated interface based on the schema
interface IFollow_Up {
    "lead_id": string;
    "followed_by_id": string;
    "follow_up_date": Date | string;
    "follow_up_time": string;
    "response_note": string;
    _id: string;
}

interface ApiResponse {
    data: IFollow_Up;
    message: string;
    status: number;
}

const DataDetails = ({ data }: { data: IFollow_Up }) => {
    return (
        <div className="w-full flex flex-col md:p-4 p-1 gap-4">
            <h1 className="text-2xl font-bold">Follow_Up Details</h1>
            <div className="border border-slate-400 rounded-md overflow-hidden">
                <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">lead_id:</strong> {data?.["lead_id"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">followed_by_id:</strong> {data?.["followed_by_id"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">follow_up_date:</strong> {data?.["follow_up_date"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">follow_up_time:</strong> {data?.["follow_up_time"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">response_note:</strong> {data?.["response_note"]?.toString()}
            </div>
            </div>
            <HomeButton />
        </div>
    )
}

const getDataById = async (id: string): Promise<ApiResponse> => {
    const backendUrl = `http://localhost:3000/generate/follow_Ups/all/api/v1?id=${id}`

    try {
        const res = await fetch(backendUrl, { next: { revalidate: 3600 } }) // 1 hour cache
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        const responseData: ApiResponse = await res.json()
        if (!responseData || !responseData.data) {
             notFound()
        }
        return responseData
    } catch (error) {
        console.error('Failed to fetch Follow_Up:', error)
        notFound();
    }
}

async function getData(id: string) {
    const data = await getDataById(id)
    if (!data) notFound()
    return data
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id } = params
    const data = await getData(id)

    return {
        title: data?.data?.["lead_id"]?.toString() || 'Follow_Up',
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params
    const data = await getData(id)
    return (
        <div className="py-12 flex flex-col w-full">
            <DataDetails data={data.data} />
        </div>
    )
}
