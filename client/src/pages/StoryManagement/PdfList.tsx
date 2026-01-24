import SearchBox from "@/components/SearchBox"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import NewPaper from "./components/NewPaper";

const data = [
    {
        id: "1998498",
        image: "https://i.pravatar.cc/40?img=1",
        type: "E-Paper",
        title: "Noida Bank.",
        publishedDate: "03-Jan-2023 08:53am",
    },
    {
        id: "1568499",
        image: "https://i.pravatar.cc/40?img=2",
        type: "Magazine",
        title: "Noida Bank.",
        publishedDate: "03-Jan-2023 08:53am",
    },
    {
        id: "1935499",
        image: "https://i.pravatar.cc/40?img=3",
        type: "E-Paper",
        title: "Noida Bank.",
        publishedDate: "03-Jan-2023 08:53am",
    },
    {
        id: "198499",
        image: "https://i.pravatar.cc/40?img=4",
        type: "Magazine",
        title: "Noida Bank.",
        publishedDate: "03-Jan-2023 08:53am",
    },
    {
        id: "199849",
        image: "https://i.pravatar.cc/40?img=5",
        type: "E-Paper",
        title: "Noida Bank.",
        publishedDate: "03-Jan-2023 08:53am",
    },
    {
        id: "998499",
        image: "https://i.pravatar.cc/40?img=6",
        type: "Magazine",
        title: "Noida Bank.",
        publishedDate: "03-Jan-2023 08:53am",
    },
    {
        id: "199899",
        image: "https://i.pravatar.cc/40?img=7",
        type: "E-Paper",
        title: "Noida Bank.",
        publishedDate: "03-Jan-2023 08:53am",
    },
]

export default function PdfList() {
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleOpenModal = () => {
        console.log("open modal");
        setOpen(true);
    }

    const handleCloseModal = () => {
        setOpen(false);
    }

    return (
        <div>
            {!open && (
                <div>
            <header className="flex flex-row justify-between items-center pb-4 min-w-full px-8 py-4">
                <div className="text-[18px] text-[#243874] font-semibold">
                    E-Paper PDF List
                </div>
                <div className="flex flex-row gap-4">
                    <SearchBox value="" onChange={(v) => { }} placeholder="Search by Text or ID" />
                    <Button
                        onClick={() => handleOpenModal()}
                        className="bg-[#243874] text-white h-9 px-4 hover:bg-[#243874]/90 rounded-[4px]"
                    >
                        + New Paper
                    </Button>
                </div>
            </header>
            <div className="border-b"></div>
            <div className="bg-white rounded-lg m-4 pl-4">
                <div className="grid grid-cols-4 gap-4">
                    {data.map((item) => (
                        <div
                            key={`${item.id}`}
                            className="flex flex-col gap-2"
                        >
                            <PdfListItem image={item.image} type={item.type} />

                            <div>
                                <div className="font-medium">{item.title}</div>
                                <p className="text-sm text-gray-500">
                                    {item.publishedDate}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>
            )}
            {open && (
                <NewPaper onClose={handleCloseModal}/>
            )}
        </div>
    )
}


interface PdfListItemProps {
    image: string;
    type: string;
}

function PdfListItem({ image, type }: PdfListItemProps) {

    return (
        <div className="relative min-h-[306px] w-[235px] h-full">
            <img src={image || ""} alt="Preview" className="w-full h-full object-cover border-2 rounded-lg overflow-hidden" />
            <span
                className={`absolute bottom-0 left-0 text-white p-1 rounded-bl-lg rounded-tr-lg ${type === "Magazine" ? "bg-[#FBAD40]" : "bg-[#243874]"}`}
            >
                {type}
            </span>
        </div>

    )
}