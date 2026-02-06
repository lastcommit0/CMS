import { X, Eye, EyeOff, Loader2, Camera } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useManagers } from "@/hooks/useUsers";
import { useRegister } from "@/hooks/useAuth";
import { useUpdateUser } from "@/hooks/useUsers";
import { useUploadImage } from "@/hooks/useStorage";
import { toast } from "sonner";
import { USER_ROLES, DESIGNATIONS, JOB_TYPES, type UserFormState, userFormSchema } from "@/types/userTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

type NewUserProps = {
  closeModal: () => void;
  userToEdit: UserFormState | null;
  onSuccess?: () => void;
};

interface Manager {
  id: string;
  name: string;
  email: string;
}

const getDefaultValues = (user?: UserFormState | null): UserFormState => ({
  firstName: user?.firstName ?? "",
  lastName: user?.lastName ?? "",
  email: user?.email ?? "",
  phone: user?.phone ?? "",
  password: "",
  role: user?.role ?? "EDITOR",
  designation: user?.designation,
  jobType: user?.jobType,
  location: user?.location ?? "",
  bio: user?.bio ?? "",
  managerId: user?.managerId,
  avatar: user?.avatar,
});

export default function NewUser({ closeModal, userToEdit, onSuccess }: NewUserProps) {
  const isEditMode = !!userToEdit;
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const { register, handleSubmit: handleFormSubmit, watch, setValue } = useForm<UserFormState>({
    resolver: zodResolver(userFormSchema),
    defaultValues: getDefaultValues(userToEdit),
  });

  const formValues = watch();
  const currentRole = watch("role");

  const { data: managers, isLoading: managersLoading } = useManagers(currentRole);
  const registerMutation = useRegister();
  const updateUserMutation = useUpdateUser();
  const uploadImageMutation = useUploadImage();

  const managerOptions: Array<{ label: string; value: string }> =
    managers?.map((m: Manager) => ({
      label: m.name,
      value: m.id,
    })) ?? [];

  const validateForm = (data: UserFormState) => {
    if (!data.firstName?.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!data.lastName?.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!data.email?.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!data.phone?.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(data.phone)) {
      toast.error("Invalid phone number format");
      return false;
    }
    if (!isEditMode && !data.password) {
      toast.error("Password is required");
      return false;
    }
    if (data.password && data.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (!data.bio?.trim()) {
      toast.error("Profile summary is required");
      return false;
    }
    if (!data.role) {
      toast.error("Role is required");
      return false;
    }
    if (!data.designation) {
      toast.error("Designation is required");
      return false;
    }
    if (!data.jobType) {
      toast.error("Job type is required");
      return false;
    }
    return true;
  };

  const buildPayload = (data: UserFormState) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      designation,
      jobType,
      location,
      bio,
      managerId,
      avatar,
      password,
      role,
    } = data;

    return {
      firstName,
      lastName,
      email,
      phone,
      designation,
      jobType,
      bio,
      location: location || undefined,
      managerId: managerId || undefined,
      avatar: avatar || undefined,
      ...(password ? { password } : {}),
      ...(!isEditMode ? { role } : {}),
    };
  };

  const handleSubmit = async (data: UserFormState) => {
    if (!validateForm(data)) return;

    const payload = buildPayload(data);

    if (isEditMode && userToEdit?.id) {
      updateUserMutation.mutate(
        {
          id: userToEdit.id,
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

  const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {

  } 

  const handleImageDelete = async (e: React.ChangeEvent<HTMLInputElement>) => {

  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG or PNG images are allowed");
      e.currentTarget.value = "";
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      e.currentTarget.value = "";
      return;
    }

    // Revoke previous blob URL if it exists
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    // Create and store new blob URL for preview
    const localPreview = URL.createObjectURL(file);
    blobUrlRef.current = localPreview;
    setAvatarPreview(localPreview);

    try {
      const uploaded = await uploadImageMutation.mutateAsync(file);
      const fileUrl = uploaded?.fileUrl || uploaded?.data?.fileUrl;
      
      if (fileUrl) {
        setValue("avatar", fileUrl, { shouldDirty: true });
        setAvatarPreview(fileUrl);
        toast.success("Photo uploaded");
        
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = null;
        }
      } else {
        toast.error("Upload succeeded but no URL returned");
        setAvatarPreview(formValues.avatar || null);
      }
    } catch (error) {
      toast.error("Photo upload failed");
      setAvatarPreview(formValues.avatar || null);
    } finally {
      e.currentTarget.value = "";
    }
  };

  const roleOptions = USER_ROLES.map(role => ({ label: role, value: role }));
  const designationOptions = DESIGNATIONS.map(designation => ({ label: designation, value: designation }));
  const jobTypeOptions = JOB_TYPES.map(jobType => ({ label: jobType, value: jobType }));

  const isSubmitting = registerMutation.isPending || updateUserMutation.isPending;
  const isUploading = uploadImageMutation.isPending;

  // Initialize avatar preview from form values
  useEffect(() => {
    if (formValues.avatar) {
      setAvatarPreview(formValues.avatar);
    }
  }, [formValues.avatar]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed min-h-screen inset-0 z-50 flex justify-end items-start">
      <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

      <div
        className="relative min-h-screen w-[520px] max-h-screen overflow-y-auto bg-white shadow-xl z-10"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isEditMode ? "Edit user" : "Create user"}
      >
        <header className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b">
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
        </header>

        <form className="p-6 space-y-6" onSubmit={handleFormSubmit(handleSubmit)}>
          <div className="flex items-center gap-4">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="User avatar"
                className="size-20 rounded-full object-cover aspect-square"
              />
            ) : (
              <div className="size-20 rounded-full bg-blue-200 text-gray-600 flex items-center justify-center text-xl font-bold aspect-square">
                <Camera />
              </div>
            )}
            <div className="flex flex-col">
              <Button
                variant="outline"
                size="sm"
                className="w-[150px] text-[#404040] text-[14px]"
                disabled={isSubmitting || isUploading}
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                {isUploading ? "Uploading..." : "Upload New Photo"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleImageUpload}
              />
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
                    {...register("firstName")}
                    className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("lastName")}
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
                    {...register("phone")}
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
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
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
                  {...register("location")}
                  className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("email")}
                  type="email"
                  className="bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
                  Profile Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("bio")}
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
                  value={formValues.jobType || ""}
                  options={jobTypeOptions}
                  onChange={(value) => setValue("jobType", value as any)}
                  disabled={isSubmitting}
                />
                <SelectField
                  label="Designation"
                  value={formValues.designation || ""}
                  options={designationOptions}
                  onChange={(value) => setValue("designation", value as any)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="Reporting Manager"
                  value={formValues.managerId || ""}
                  options={managerOptions}
                  onChange={(value) => setValue("managerId", value)}
                  placeholder={managersLoading ? "Loading..." : "Select manager"}
                  disabled={isSubmitting || managersLoading || !currentRole}
                />
                <SelectField
                  label="Select Role"
                  value={formValues.role || ""}
                  options={roleOptions}
                  onChange={(value) => {
                    setValue("role", value as any);
                    setValue("managerId", undefined);
                  }}
                  disabled={isSubmitting || isEditMode}
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t px-6 py-4 -mx-6">
            <Button
              type="submit"
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
        </form>
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

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: boolean
}

export const InputField = React.forwardRef<
  HTMLInputElement,
  InputFieldProps
>((props, ref) => {
  const { label, required, error, className, ...rest } = props

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block mb-1 text-[14px] font-semibold text-[#606060]">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}

      <Input
        ref={ref}
        {...rest}
        className={cn(
          "bg-gray-100 border-0 border-b-2 border-gray-200 rounded-none",
          error && "border-destructive focus-visible:border-destructive",
          className
        )}
      />
    </div>
  )
})

InputField.displayName = "InputField"
