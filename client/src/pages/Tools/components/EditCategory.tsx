import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, AlertCircle, Loader2, CheckCircle, Archive, Trash2, Merge as Merge2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { CategoryData } from '@/types/categoryTypes';
import { useDeleteCategory, useUpdateCategory } from "@/hooks/useCategories";

type CategoryProps = {
  category?: CategoryData;
  categories?: CategoryData[];
  closeModal: () => void;
  onSave?: (data: CategoryData) => void;
}

export default function EditCategory({ category, categories = [], closeModal, onSave }: CategoryProps) {
  const [formData, setFormData] = useState<CategoryData>(category || {
    id: '',
    name: '',
    slug: '',
    parentId: null,
    isActive: true
  });

  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const loading = updateCategory.isPending || deleteCategory.isPending;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeAction, setActiveAction] = useState<'EDIT' | 'CHANGE_PARENT' | 'DELETE' | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const getErrorMessage = (err: unknown) => {
    const message =
      (err as any)?.response?.data?.error?.message ||
      (err instanceof Error ? err.message : null);
    return message || 'An error occurred';
  };

  useEffect(() => {
    if (category) {
      setFormData(category);
    }
  }, [category]);

  const handleSave = async () => {
    setError(null);
    try {
      // Validate form
      if (!formData.name.trim()) {
        setError('Category name is required');
        return;
      }

      const updated = await updateCategory.mutateAsync({
        id: formData.id,
        data: {
          name: formData.name,
          parentId: formData.parentId ?? null,
          isActive: formData.isActive,
        },
      });

      setFormData(updated);
      setSuccess(true);
      onSave?.(updated);

      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleStatusToggle = async () => {
    setError(null);
    try {
      const updated = await updateCategory.mutateAsync({
        id: formData.id,
        data: { isActive: !formData.isActive },
      });
      setFormData(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
    setShowConfirm(false);
  };

  const handleChangeParent = async (newParentId: string | null) => {
    setError(null);
    try {
      const updated = await updateCategory.mutateAsync({
        id: formData.id,
        data: { parentId: newParentId },
      });
      setFormData(updated);
      setSuccess(true);
      setActiveAction(null);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteCategory.mutateAsync(formData.id);
      setSuccess(true);
      setTimeout(() => closeModal(), 1200);
    } catch (err) {
      setError(getErrorMessage(err));
    }
    setShowConfirm(false);
  };

  const filterOutSelfAndChildren = (cats: CategoryData[]) => {
    const getChildren = (id: string): Set<string> => {
      const children = new Set<string>();
      cats.forEach(cat => {
        if (cat.parentId === id) {
          children.add(cat.id);
          getChildren(cat.id).forEach(child => children.add(child));
        }
      });
      return children;
    };

    const excluded = new Set([formData.id, ...getChildren(formData.id)]);
    return cats.filter(cat => !excluded.has(cat.id));
  };

  const renderEditForm = () => (
    <div className="p-6 space-y-6">
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Category Name <span className="text-red-500">*</span>
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter category name"
          className="border-b-2 border-gray-200 rounded-none bg-gray-50"
          disabled={loading}
        />
      </div>

      <SelectField
        label="Parent Category"
        value={formData.parentId || 'none'}
        options={[
          { label: 'No Parent', value: 'none' },
          ...filterOutSelfAndChildren(categories).map(cat => ({
            label: cat.name,
            value: cat.id,
          })),
        ]}
        onChange={(value) => setFormData({ ...formData, parentId: (value === 'none' || !value) ? null : value })}
      />

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          <CheckCircle className="w-4 h-4" />
          Changes saved successfully!
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Save Changes
        </Button>
        <Button
          onClick={closeModal}
          variant="outline"
          disabled={loading}
          className="flex-1 bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderActions = () => (
    <div className="p-6 space-y-3 border-t">
      <div className="text-sm font-semibold text-gray-600 mb-4">Actions</div>

      <Button
        onClick={() => setShowConfirm(true)}
        variant="outline"
        className="w-full justify-start"
        disabled={loading}
      >
        <Archive className="w-4 h-4 mr-2" />
        {formData.isActive ? 'Deactivate' : 'Activate'}
      </Button>

      <Button
        onClick={() => setActiveAction('CHANGE_PARENT')}
        variant="outline"
        className="w-full justify-start"
        disabled={loading}
      >
        <Merge2 className="w-4 h-4 mr-2" />
        Change Parent
      </Button>

      <Button
        onClick={() => setActiveAction('DELETE')}
        variant="outline"
        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        disabled={loading}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Category
      </Button>
    </div>
  );

  return (
    <>
      <div className="fixed min-h-screen inset-0 z-50 flex justify-end items-start">
        <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
        <div
          className="relative min-h-screen w-[520px] max-h-screen overflow-y-auto bg-white shadow-xl z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-semibold text-[#243874] text-lg">
              Edit Category
            </h2>
            <button
              onClick={closeModal}
              className="hover:bg-gray-100 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {activeAction === 'CHANGE_PARENT' ? (
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Select New Parent</h3>
              <SelectField
                label="Parent Category"
                value={formData.parentId || 'none'}
                options={[
                  { label: 'No Parent', value: 'none' },
                  ...filterOutSelfAndChildren(categories).map(cat => ({
                    label: cat.name,
                    value: cat.id,
                  })),
                ]}
                onChange={(value) => handleChangeParent((value === 'none' || !value) ? null : value)}
              />
              <Button onClick={() => setActiveAction(null)} variant="outline" className="w-full">
                Cancel
              </Button>
            </div>
          ) : (
            <>
              {renderEditForm()}
              {renderActions()}
            </>
          )}
        </div>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {activeAction === 'DELETE' ? 'Delete Category?' : 'Confirm Action'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {activeAction === 'DELETE' && 'This action cannot be undone. The category must have no stories or child categories.'}
              {formData.isActive && activeAction !== 'DELETE' && `Are you sure you want to deactivate "${formData.name}"?`}
              {!formData.isActive && activeAction !== 'DELETE' && `Are you sure you want to activate "${formData.name}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (activeAction === 'DELETE') {
                  handleDelete();
                } else {
                  handleStatusToggle();
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
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

function SelectField({
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
        <SelectTrigger className="bg-[#F8F8F8] w-full border-0 border-b-2 text-gray-500 border-gray-200 rounded-none">
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
