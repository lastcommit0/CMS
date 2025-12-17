


interface TextareaProps {
  label: string;
  required?: boolean;
}



export default function Textarea({
  label,
  required = false,
}: TextareaProps){
  return (
    <div>
      <label className="mb-1 block text-sm text-gray-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <textarea
        rows={3}
        className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm outline-none resize-none"
      />
    </div>
  );
}
