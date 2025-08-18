import Link from 'next/link'

const HomeButton = () => {
    return (
        <Link
            href="/dashboard/posts/all"
            className="w-full hover:bg-slate-400 bg-slate-300 p-1 border-1 border-slate-400 "
        >
            Back to Home
        </Link>
    )
}
export default HomeButton


