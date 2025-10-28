import CustomLInk from './CustomButton'

const Page = async () => {
    const fetchData = async () => {
        const token = process.env.NEXT_PUBLIC_Token
        if (!token) {
            console.error(
                'Authentication token not found. Unable to fetch data.'
            )
            return
        }

        const url =
            'http://localhost:3000/generate/support_Tickets/all/api/v1?page=1&limit=4'

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const responseData = await response.json()
            return responseData.data?.support_Tickets
        } catch (error) {
            console.error('Failed to fetch data:', error)
            return []
        }
    }
    const data: { student_id: string; _id: string }[] = await fetchData()
    return (
        <main className="w-full flex flex-col gap-2 p-1 md:p-4">
            {data &&
                data.length > 0 &&
                data.map((i: { student_id: string; _id: string }, idx: number) => (
                    <div key={idx + i?.student_id}>
                        <CustomLInk
                            name={i.student_id}
                            url={`/generate/support_Tickets/ssr-view/details/${i._id}`}
                        />
                    </div>
                ))}
        </main>
    )
}
export default Page
