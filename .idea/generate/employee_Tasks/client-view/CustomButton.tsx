'use client'

import Link from 'next/link'

const CustomLInk = (i: { name: string; url: string }) => {
    return (
        <Link
            href={i.url}
            className="w-full hover:bg-slate-400 bg-slate-300 block p-1 border-1 border-slate-400 "
        >
            {i.name}
        </Link>
    )
}
export default CustomLInk

