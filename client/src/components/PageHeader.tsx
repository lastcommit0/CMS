


export default function PageHeader({ title, right }: { title: string, right: React.ReactNode }) {

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
            <h1 className="text-[18px] font-semibold text-[#243874]">{title}</h1>
            {right}
        </div>
    )
}