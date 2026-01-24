import pdf from "../../../assets/icons/pdf.svg";
import image from "../../../assets/icons/image.svg";
import { cn } from "@/lib/utils";


export default function NewPaper({onClose}:{onClose:()=>void}) {

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen max-w-7xl shadow">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-[18px] text-[#243874] font-semibold">
          Add New E-Paper PDF
        </h2>

        <div className="flex gap-3">
          <button className="px-4 py-1.5 text-sm border rounded-md"
            onClick={()=>onClose()}
          >
            Cancel
          </button>
          <button className="px-4 py-1.5 text-sm border rounded-md bg-gray-100">
            Download PDF
          </button>
          <button className="px-4 py-1.5 text-sm rounded-md bg-[#243874] text-white">
            Submit
          </button>
        </div>
      </div>

      {/* PDF TYPE */}
      <div className="flex items-center gap-6 text-sm">
        <span className="font-medium text-gray-700">PDF Type</span>

        <label className="flex items-center gap-2">
          <input type="radio" name="type" defaultChecked />
          E-Paper
        </label>

        <label className="flex items-center gap-2">
          <input type="radio" name="type" />
          Magazine
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[450px_610px] gap-6">
        {/* COVER IMAGE (small) */}
        {/* COVER IMAGE */}
        <UploadBox
          title="Drag and drop Cover image, or"
          subtitle="Minimum 800px width recommended. Max 10MB each"
          browseText="Browse"
          icon="image"
          className="lg:h-[400px]"
        />

        {/* PDF UPLOAD */}
        <UploadBox
          title="Drag and drop PDF file here, or"
          subtitle="Max PDF file size is 10MB"
          browseText="Browse"
          icon="pdf"
          className="lg:h-[400px]"
        />

      </div>

      {/* IMAGE QUEUE SECTION */}
      <UploadBox
        title="Drag and drop images file here, or"
        subtitle="Minimum 800px width recommended. You can select multiple images."
        browseText="Browse"
        icon="image"
        large
      />
    </div>

  )
}


interface UploadBoxProps {
  title: string;
  subtitle: string;
  browseText: string;
  icon: "pdf" | "image";
  large?: boolean;
  className?: string;
}

function UploadBox({ title, subtitle, browseText, icon, large, className }: UploadBoxProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center rounded-xl border-2 border-dotted border-gray-300 text-center cursor-pointer hover:bg-gray-50 transition-all duration-200",
        large ? "h-[200px]" : "h-[400px]", className)}
    >
      {/* ICON */}
      <div className="mb-4">
        {icon === "pdf" ? (
          <img src={pdf} className="w-12 h-12" alt="PDF" />
        ) : (
          <img src={image} className="w-12 h-12" alt="PDF" />
        )}
      </div>

      {/* TEXT */}
      <p className="text-sm font-semibold text-gray-800">
        {title}{" "}
        <span className="text-blue-600 cursor-pointer">{browseText}</span>
      </p>

      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}
