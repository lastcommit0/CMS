import pdf from "../../../assets/icons/pdf.svg";
import image from "../../../assets/icons/image.svg";
import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner"
import addimg from "../../../assets/icons/addimg.svg";


export default function NewPaper({ onClose }: { onClose: () => void }) {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('PDF file size should be less than 10MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      setPdfFile(file);
    }
  }


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }


  return (
    <div className="space-y-6 p-6 bg-white min-h-screen max-w-7xl shadow">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-[18px] text-[#243874] font-semibold">
          Add New E-Paper PDF
        </h2>

        <div className="flex gap-3">
          <button className="px-4 py-1.5 text-sm border rounded-md"
            onClick={() => onClose()}
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

        <div>
          {coverImage ? (
            <div className="flex items-center justify-center relative border-2 border-dashed rounded-lg p-4 h-[400px] w-full">
              <img
                src={coverImagePreview || ''}
                alt="Preview"
                className="min-h-[306px] w-[235px] h-full object-cover rounded"
              />
              <button
                type="button"
                onClick={() => {
                  setCoverImage(null);
                  setCoverImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-grey-300 text-black p-1 rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dotted text-center cursor-pointer hover:bg-gray-50 min-h-[400px]">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <img src={image} className="mb-4 w-14 opacity-80" alt="Upload" />
              <p className="text-sm font-semibold">
                Drag and drop an image, or{" "}
                <span className="text-blue-600">Browse</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Minimum 800px width. Max 10MB
              </p>
            </label>
          )}
        </div>


        <div>
          {pdfFile ? (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 h-full min-h-[400px]">
              <div className="flex-1">
                <p className="font-medium">{pdfFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPdfFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <label className="flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dotted text-center cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfChange}
                className="hidden"
              />
              <img src={pdf} className="mb-3 w-12 opacity-80" alt="PDF" />
              <p className="text-sm font-semibold">
                Drag and drop PDF file here, or{" "}
                <span className="text-blue-600">Browse</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Max PDF file size is 10MB
              </p>
            </label>
          )}
        </div>


      </div>


      <PaperImagesUploader />
    </div>

  )
}



interface FileWithPreview {
  file: File;
  preview: string;
}

export function PaperImagesUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => items.forEach(item => URL.revokeObjectURL(item.preview));
  }, [items]);

  const handleFiles = (incomingFiles: File[]) => {
    const validImages = incomingFiles.filter(f => f.type.startsWith('image/'));

    if (validImages.length === 0) return;

    const newItems = validImages.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setItems(prev => [...prev, ...newItems]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const remove = (index: number) => {
    URL.revokeObjectURL(items[index].preview);
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="space-y-4"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      {items.length === 0 ? (
        <div
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dotted transition-all cursor-pointer h-[200px] ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          <img src={image} className="mb-4 w-14 opacity-80" alt="Upload" />
          <p className="text-sm font-semibold text-gray-800">
            Drag and drop images, or <span className="text-blue-600">Browse</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">Max size 10MB each. Multiple selection allowed.</p>
        </div>
      ) : (
        <div className="border-2 border-dotted rounded-xl p-4 border-gray-300">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {items.map((item, i) => (
              <div key={item.preview} className="relative flex-shrink-0 w-[120px] h-[160px] border-2 rounded-md overflow-hidden group">
                <img src={item.preview} className="w-full h-full object-cover" alt="preview" />

                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-0.5 right-0.5 bg-white/90 hover:bg-white text-gray-800 h-6 w-6 rounded-xs shadow-md transition-colors flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-[120px] h-[160px] flex-shrink-0 flex flex-col items-center justify-center border-2 border-dotted rounded-md border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <img src={addimg} className="mb-4 w-14 opacity-80" alt="Upload" />
              <span className="text-xs font-semibold text-black">Add Image</span>
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        hidden
        multiple
        accept="image/*"
        onChange={(e) => handleFiles(Array.from(e.target.files || []))}
      />
    </div>
  );
}
