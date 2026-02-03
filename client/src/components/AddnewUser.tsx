import Section from "./ui/Section";
import Textarea from "./ui/TextArea";
import TwoCol from "./ui/TwoCol";


export default function AddNewUser() {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-[510px] bg-white shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-blue-700">Add New User</h2>
          <button
            type="button"
            className="text-xl text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 px-6 py-4">
          <div className="flex items-center gap-4">
            <img
              src="https://i.pravatar.cc/80"
              alt="avatar"
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <button
                type="button"
                className="rounded-md border px-4 py-1.5 text-sm font-medium"
              >
                Upload New Photo
              </button>
              <p className="mt-1 text-xs text-gray-500">
                At least 150x150 px recommended JPG, PNG or JPEG is allowed
              </p>
            </div>
          </div>

          <Section title="Basic Info">
            <TwoCol>
              <Input label="First Name" required />
              <Input label="Last Name" required />
            </TwoCol>

            <TwoCol>
              <Input label="WhatsApp No." required />
              <Input label="Password" type="password" required />
            </TwoCol>

            <Input label="Location" />
            <Input label="Email Address" required />

            <Textarea label="Profile Summary" required />
          </Section>

          <Section title="Professional Info">
            <TwoCol>
              <Select label="Job Type" required />
              <Select label="Designation" required />
            </TwoCol>

            <TwoCol>
              <Select label="Reporting Manager" required />
              <Select label="Select Role" required />
            </TwoCol>
          </Section>
        </div>

        <div className="sticky bottom-0 border-t bg-white px-6 py-4">
          <button
            type="submit"
            className="w-full rounded-md bg-blue-800 py-2 text-sm font-semibold text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}



interface InputProps {
  label: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
}

function Input({
  label,
  required = false,
  type = "text",
}: InputProps) {
  return (
    <div>
      <label className="mb-1 block text-sm text-gray-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        type={type}
        className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm outline-none"
      />
    </div>
  );
}


interface SelectProps {
  label: string;
  required?: boolean;
}

function Select({
  label,
  required = false,
}: SelectProps) {
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