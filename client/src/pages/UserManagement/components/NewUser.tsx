import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useManagers, useUpdateUser } from "@/hooks/useUsers";
import { useRegister } from "@/hooks/useAuth";
import { type UserFormState } from "@/types/userTypes";
import { toast } from "sonner";


type NewUserProps = {
  closeModal: () => void
  modalType: UserFormState | null,
  users: any,
}

interface Manager {
  id: string;
  name: string;
  email: string;
}

export default function NewUser({ closeModal, modalType, users }: NewUserProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: users.firstName || "",
    lastName: users.lastName || "",
    email: users?.email || "",
    phone: users?.phone || "",
    password: users?.password || "",
    location: users?.location || "",
    bio: users?.bio || "",
    role: users?.role || "",
    designation: users?.designation || "",
    jobType: users?.jobType || "",
    managerId: users?.managerId || "",
    avatar: users?.avatar || "",
  });
  const { data: managers } = useManagers(formData.role);
  const managerOptions: OptionProps[] =
    managers?.map((m) => ({
      label: m.name,
      value: m.id,
    })) ?? [];

  const registerMutation = useRegister();
  const updateUserMutation = useUpdateUser();
  const buildPayload = () => ({
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    phone: formData.phone,
    role: formData.role,
    designation: formData.designation,
    jobType: formData.jobType,
    location: formData.location,
    bio: formData.bio,
    managerId: formData.managerId,
    avatar: formData.avatar,
    ...(formData.password && { password: formData.password }),
  });


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!modalType && !formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password && formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (!formData.bio.trim()) {
      toast.error("Profile summary is required");
      return false;
    }
    if (!formData.role) {
      toast.error("Role is required");
      return false;
    }
    if (!formData.designation) {
      toast.error("Designation is required");
      return false;
    }
    if (!formData.jobType) {
      toast.error("Job type is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = buildPayload();

    if (modalType) {
      updateUserMutation.mutate(
        {
          id: users.id,
          data: payload,
        },
        {
          onSuccess: () => {
            closeModal();
          },
        }
      );
    } else {
      registerMutation.mutate(payload, {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  const roleOptions = [
    { label: "Admin", value: "ADMIN" },
    { label: "Sub Admin", value: "SUB_ADMIN" },
    { label: "Editor", value: "EDITOR" },
  ];

  const designationOptions = [
    { label: "Editor in Chief", value: "EDITOR_IN_CHIEF" },
    { label: "Managing Editor", value: "MANAGING_EDITOR" },
    { label: "Editor", value: "EDITOR" },
    { label: "Writer", value: "WRITER" },
    { label: "Contributor", value: "CONTRIBUTOR" },
  ];

  const jobTypeOptions = [
    { label: "Full Time", value: "FULL_TIME" },
    { label: "Part Time", value: "PART_TIME" },
    { label: "Freelance", value: "FREELANCE" },
    { label: "Intern", value: "INTERN" },
  ];

  return (
    <div className="fixed min-h-screen inset-0 z-50 flex justify-end items-start">
      <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

      {/* Drawer */}
      <div
        className="relative min-h-screen w-[520px] max-h-screen overflow-y-auto bg-white shadow-xl z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-[#243874] text-lg">
            {modalType ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={closeModal}
            className="hover:bg-gray-100 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center gap-4">
            <div className="size-20 object-cover rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
              {formData.firstName[0] || "U"}
              {formData.lastName[0] || ""}
            </div>
            <div className="flex flex-col">
              <Button
                variant="outline"
                size="sm"
                className="w-[150px] text-[#404040] text-[14px]"
              >
                Upload New Photo
              </Button>
              <p className="text-[13px] tracking-tight text-[#1E1E1E] mt-2">
                At least 150x150 px recommended JPG, PNG or JPEG is allowed
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-3">
              Basic Info
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                    WhatsApp No. <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                  Location
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                  Profile Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={2}
                  className="w-full bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none px-3 py-2 text-sm outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-3">
              Professional Info
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Job Type" value={formData.jobType} options={jobTypeOptions} onChange={(value) => handleInputChange("jobType", value)} />
                <SelectField label="Designation" value={formData.designation} options={designationOptions} onChange={(value) => handleInputChange("designation", value)} />

              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Reporting Manager" value={formData.managerId} options={managerOptions} onChange={(value) => handleInputChange("managerId", value)} />
                <SelectField label="Select Role" value={formData.role} options={roleOptions} onChange={(value) => handleInputChange("role", value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#243874] hover:bg-[#243874]/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {modalType ? "Updating..." : "Creating..."}
              </>
            ) : modalType ? (
              "Update User"
            ) : (
              "Create User"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}




interface SelectFieldProps {
  label: string;
  value: string;
  options: OptionProps[];
  onChange: (value: string) => void;
}

interface OptionProps {
  label: string;
  value: string;
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
        {label}  <span className="text-red-500">*</span>
      </label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#F8F8F8] w-[220px] border-0 border-b-2 text-gray-500 border-gray-200 rounded-none">
          <SelectValue placeholder={""} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}