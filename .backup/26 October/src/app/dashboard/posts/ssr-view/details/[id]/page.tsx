import { notFound } from 'next/navigation'
import HomeButton from './HomeButton'

// Dynamically generated interface based on the schema
interface IPost {
    "title": string;
    "email": string;
    "password": string;
    "passcode": string;
    "area": string;
    "sub-area": string[];
    "products-images": string[];
    "personal-image": string;
    "description": string;
    "age": number;
    "amount": number;
    "isActive": boolean;
    "start-date": Date | string;
    "start-time": string;
    "schedule-date": { start: Date | string; end: Date | string };
    "schedule-time": { start: string; end: string };
    "favorite-color": string;
    "number": string;
    "profile": string;
    "test": string;
    "info": string;
    "shift": string;
    "policy": boolean;
    "hobbies": string[];
    "ideas": string[];
    "students": Array<{ Name: string; Class: string; Roll: string }>;
    "complexValue": {
        "id": string;
        "title": string;
        "parent": {
            "id": string;
            "title": string;
            "child": {
                "id": string;
                "title": string;
                "child": string;
                "note": string
            };
            "note": string
        };
        "note": string
    };
    _id: string;
}

interface ApiResponse {
    data: IPost;
    message: string;
    status: number;
}

const DataDetails = ({ data }: { data: IPost }) => {
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
                <strong className="capitalize">sub area:</strong> {data?.["sub-area"]?.join(', ')}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">products images:</strong> {data?.["products-images"]?.join(', ')}
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
                <strong className="capitalize">hobbies:</strong> {data?.["hobbies"]?.join(', ')}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">ideas:</strong> {data?.["ideas"]?.join(', ')}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">students:</strong> <pre className="text-sm">{JSON.stringify(data?.["students"], null, 2)}</pre>
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">complexValue:</strong> <pre className="text-sm">{JSON.stringify(data?.["complexValue"], null, 2)}</pre>
            </div>
            </div>
            <HomeButton />
        </div>
    )
}

const getDataById = async (id: string): Promise<ApiResponse> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const backendUrl = `${baseUrl}/api/posts/v1?id=${id}`

    try {
        const res = await fetch(backendUrl, { next: { revalidate: 3600 } })
        if (!res.ok) {
            console.error('API fetch failed with status:', res.status);
            if (res.status === 404) {
                notFound();
            }
            throw new Error('Failed to fetch data');
        }
        const responseData: ApiResponse = await res.json()
        if (!responseData || !responseData.data) {
             notFound()
        }
        return responseData
    } catch (error) {
        console.error('Failed to fetch Post:', error)
        notFound();
    }
}

async function getData(id: string) {
    const data = await getDataById(id)
    if (!data) notFound()
    return data
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const data = await getData(id)

    return {
        title: data?.data?.["title"]?.toString() || 'Post',
    }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const data = await getData(id)
    return (
        <div className="py-12 flex flex-col w-full">
            <DataDetails data={data.data} />
        </div>
    )
}
