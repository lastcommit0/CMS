import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useManagers } from "@/hooks/useUsers";
import { useRegister } from "@/hooks/useAuth";
import { useUpdateUser } from "@/hooks/useUsers";
import { toast } from "sonner";

type NewUserProps = {
  closeModal: () => void;
  modalType: any | null;
  onSuccess?: () => void;
};

interface Manager {
  id: string;
  name: string;
  email: string;
}

export default function NewUser({ closeModal, modalType, onSuccess }: NewUserProps) {
  const isEditMode = !!modalType;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    location: "",
    bio: "",
    role: "" as "" | "ADMIN" | "SUB_ADMIN" | "EDITOR",
    designation: "" as "" | "OPERATIONS_MANAGER" | "COMMUNITY_MODERATOR" | "COMPLIANCE_OFFICER" | "EDITOR_IN_CHIEF" | "MANAGING_EDITOR" | "SENIOR_EDITOR" | "COPY_EDITOR" | "SEO_EDITOR",
    jobType: "" as "" | "FULL_TIME" | "PART_TIME" | "FREELANCE" | "INTERN",
    managerId: "",
    avatar: "",
  });

  useEffect(() => {
    if (isEditMode && modalType) {
      const nameParts = modalType.name?.split(" ") || ["", ""];
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: modalType.email || "",
        phone: modalType.phone || "",
        password: "",
        location: modalType.profile?.location || "",
        bio: modalType.profile?.bio || "",
        role: modalType.roles?.[0]?.role?.name || "",
        designation: modalType.profile?.designation || "",
        jobType: modalType.profile?.jobType || "",
        managerId: modalType.managerId || "",
        avatar: modalType.profile?.avatar || "",
      });
    }
  }, [isEditMode, modalType]);

  const { data: managers, isLoading: managersLoading } = useManagers(formData.role);
  const registerMutation = useRegister();
  const updateUserMutation = useUpdateUser();

  const managerOptions: Array<{ label: string; value: string }> =
    managers?.map((m: Manager) => ({
      label: m.name,
      value: m.id,
    })) ?? [];

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
    if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      toast.error("Invalid phone number format");
      return false;
    }
    if (!isEditMode && !formData.password) {
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

  const buildPayload = () => {
    const payload: any = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      designation: formData.designation,
      jobType: formData.jobType,
      location: formData.location || undefined,
      bio: formData.bio,
      managerId: formData.managerId || undefined,
      avatar: formData.avatar || undefined,
    };

    // Only include password if it's provided
    if (formData.password) {
      payload.password = formData.password;
    }

    // For register, we need firstName, lastName, and role separately
    if (!isEditMode) {
      payload.firstName = formData.firstName;
      payload.lastName = formData.lastName;
      payload.role = formData.role;
    }

    return payload;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = buildPayload();

    if (isEditMode) {
      updateUserMutation.mutate(
        {
          id: modalType.id,
          data: payload,
        },
        {
          onSuccess: () => {
            toast.success("User updated successfully");
            onSuccess?.();
            closeModal();
          },
          onError: (error: any) => {
            const message = error?.response?.data?.error?.message || "Failed to update user";
            toast.error(message);
          },
        }
      );
    } else {
      registerMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("User created successfully");
          onSuccess?.();
          closeModal();
        },
        onError: (error: any) => {
          const message = error?.response?.data?.error?.message || "Failed to create user";
          toast.error(message);
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
    { label: "Operations Manager", value: "OPERATIONS_MANAGER" },
    { label: "Community Moderator", value: "COMMUNITY_MODERATOR" },
    { label: "Compliance Officer", value: "COMPLIANCE_OFFICER" },
    { label: "Editor in Chief", value: "EDITOR_IN_CHIEF" },
    { label: "Managing Editor", value: "MANAGING_EDITOR" },
    { label: "Senior Editor", value: "SENIOR_EDITOR" },
    { label: "Copy Editor", value: "COPY_EDITOR" },
    { label: "SEO Editor", value: "SEO_EDITOR" },
  ];

  const jobTypeOptions = [
    { label: "Full Time", value: "FULL_TIME" },
    { label: "Part Time", value: "PART_TIME" },
    { label: "Freelance", value: "FREELANCE" },
    { label: "Intern", value: "INTERN" },
  ];

  const isSubmitting = registerMutation.isPending || updateUserMutation.isPending;

  return (
    <div className="fixed min-h-screen inset-0 z-50 flex justify-end items-start">
      <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

      <div
        className="relative min-h-screen w-[520px] max-h-screen overflow-y-auto bg-white shadow-xl z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-[#243874] text-lg">
            {isEditMode ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={closeModal}
            className="hover:bg-gray-100 p-1 rounded"
            disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                    Password {!isEditMode && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={isSubmitting}
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
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                  Profile Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  className="w-full bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none px-3 py-2 text-sm outline-none resize-none"
                  disabled={isSubmitting}
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
                <SelectField
                  label="Job Type"
                  value={formData.jobType}
                  options={jobTypeOptions}
                  onChange={(value) => handleInputChange("jobType", value)}
                  disabled={isSubmitting}
                />
                <SelectField
                  label="Designation"
                  value={formData.designation}
                  options={designationOptions}
                  onChange={(value) => handleInputChange("designation", value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="Reporting Manager"
                  value={formData.managerId}
                  options={managerOptions}
                  onChange={(value) => handleInputChange("managerId", value)}
                  placeholder={managersLoading ? "Loading..." : "Select manager"}
                  disabled={isSubmitting || managersLoading || !formData.role}
                />
                <SelectField
                  label="Select Role"
                  value={formData.role}
                  options={roleOptions}
                  onChange={(value) => {
                    handleInputChange("role", value);
                    handleInputChange("managerId", "");
                  }}
                  disabled={isSubmitting || isEditMode}
                />
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
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
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
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = "Select...",
  disabled = false,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
        {label} <span className="text-red-500">*</span>
      </label>

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="bg-[#F8F8F8] w-full border-0 border-b-2 text-gray-500 border-gray-200 rounded-none">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}