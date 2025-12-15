

interface SelectProps {
  label: string;
  required?: boolean;
}


function Select({
  label,
  required = false,
}: SelectProps){
  return (
    <div>
      <label className="mb-1 block text-sm text-gray-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm outline-none">
        <option value="" />
      </select>
    </div>
  );
}
