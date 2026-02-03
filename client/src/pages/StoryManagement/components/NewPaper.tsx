import { useRef, useState, useEffect } from "react";
import { X, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner"
import addimg from "../../../assets/icons/addimg.svg";
import { useCreateEpaper } from "@/hooks/useEpapers";
import { epaperApi } from "@/services/epaperService";

export default function NewPaper({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<'EPAPER' | 'MAGAZINE'>('EPAPER');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createEpaperMut = useCreateEpaper();

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('PDF file size should be less than 50MB');
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

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!date) {
      toast.error('Date is required');
      return;
    }
    if (!pdfFile && !coverImage) {
      toast.error('Please upload at least a PDF or cover image');
      return;
    }

    setIsSubmitting(true);
    createEpaperMut.mutate({
      title,
      date,
      type,
    }, {
      onSuccess: async (response: any) => {
        const id = response.data.data?.id;
        if (!id) {
          toast.error('Failed to get E-Paper ID');
          setIsSubmitting(false);
          return;
        }
        try {
          if (pdfFile) {
            await epaperApi.uploadPdf(id, pdfFile);
          }
          if (coverImage) {
            await epaperApi.uploadCover(id, coverImage);
          }
          toast.success('E-Paper created successfully');
          onClose();
        } catch (error) {
          toast.error('Failed to upload files');
        } finally {
          setIsSubmitting(false);
        }
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  }

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen shadow max-w-7xl mx-auto rounded-lg">
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-[18px] text-[#243874] font-semibold">
          Add New {type === 'EPAPER' ? 'E-Paper' : 'Magazine'} PDF
        </h2>

        <div className="flex gap-3">
          <button className="px-4 py-1.5 text-sm border rounded-md hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1.5 text-sm rounded-md bg-[#243874] text-white flex items-center gap-2 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Submit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Title</label>
          <input
            className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-[#243874]"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-[#243874]"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <span className="font-medium text-gray-700">Type</span>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="type"
            checked={type === 'EPAPER'}
            onChange={() => setType('EPAPER')}
          />
          E-Paper
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="type"
            checked={type === 'MAGAZINE'}
            onChange={() => setType('MAGAZINE')}
          />
          Magazine
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Cover Image</p>
          {coverImage ? (
            <div className="flex items-center justify-center relative border-2 border-dashed rounded-lg p-4 h-[400px] w-full bg-gray-50">
              <img
                src={coverImagePreview || ''}
                alt="Preview"
                className="h-full object-contain rounded shadow-sm"
              />
              <button
                type="button"
                onClick={() => {
                  setCoverImage(null);
                  setCoverImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center cursor-pointer hover:bg-gray-50 min-h-[400px] transition-colors group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <ImageIcon className="mb-4 w-14 h-14 text-gray-300 group-hover:text-gray-400 transition-colors" />
              <p className="text-sm font-semibold">
                Drag and drop an image, or{" "}
                <span className="text-blue-600">Browse</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Max 10MB
              </p>
            </label>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">PDF File</p>
          {pdfFile ? (
            <div className="flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed rounded-lg bg-gray-50 h-[400px]">
              <div className="bg-red-50 p-6 rounded-full">
                <FileText size={48} className="text-red-500" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-800">{pdfFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPdfFile(null)}
                className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
              >
                Remove PDF
              </button>
            </div>
          ) : (
            <label className="flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed text-center cursor-pointer hover:bg-gray-50 transition-colors group">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfChange}
                className="hidden"
              />
              <FileText className="mb-4 w-14 h-14 text-gray-300 group-hover:text-gray-400 transition-colors" />
              <p className="text-sm font-semibold">
                Drag and drop PDF file here, or{" "}
                <span className="text-blue-600">Browse</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Max 50MB
              </p>
            </label>
          )}
        </div>
      </div>

      <PaperImagesUploader />
    </div>
  )
}

export function PaperImagesUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<{ file: File, preview: string }[]>([]);
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
      className="space-y-4 pt-4 border-t"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <p className="text-sm font-semibold text-gray-700">Internal Pages (Optional)</p>
      {items.length === 0 ? (
        <div
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all cursor-pointer h-[150px] ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          <ImageIcon className="mb-2 w-8 h-8 text-gray-300" />
          <p className="text-sm font-semibold text-gray-800">
            Drag and drop images for pages, or <span className="text-blue-600">Browse</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">Max size 10MB each.</p>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-xl p-4 border-gray-300">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {items.map((item, i) => (
              <div key={item.preview} className="relative flex-shrink-0 w-[100px] h-[130px] border rounded-md overflow-hidden group shadow-sm">
                <img src={item.preview} className="w-full h-full object-cover" alt="preview" />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-1 right-1 bg-black/50 text-white h-5 w-5 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-[100px] h-[130px] flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed rounded-md border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <img src={addimg} className="mb-2 w-6 opacity-40" alt="Upload" />
              <span className="text-[10px] font-semibold text-gray-500 uppercase">Add Page</span>
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
