import vid from "../../../assets/icons/vid.svg"
import { X, Clipboard, Tag, Loader2 } from "lucide-react"
import image from "../../../assets/icons/image.svg"
import type { StoryFormState, EditorContent } from "@/types/storyTypes"
import React, { useEffect, useState } from "react"
import { useCreateStory } from "@/hooks/useStories"
import { toast } from "sonner"
import { storyApi } from "@/services/storyService"

const initialStoryFormState: StoryFormState = {
  type: 'STORY',
  storyUrl: '',
  shortTitle: '',
  articleTitle: '',
  slugIntro: '',
  description: {
    version: '1.0',
    blocks: []
  },
  highlights: {
    version: '1.0',
    blocks: []
  },
  topicTags: [],
  seo: {
    metaKeywords: '',
    metaDescription: '',
    googleBot: 'ALLOW',
    excludeIA: false,
  },
  enablePaywall: false,
  schedulePost: false,
  mandal: '',
  author: '',
};

export default function NewVideo({ onClose }: { onClose: () => void }) {
  const createStoryMut = useCreateStory();
  const [form, setForm] = useState<StoryFormState>(initialStoryFormState);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [descriptionText, setDescriptionText] = useState('');
  const [highlightsText, setHighlightsText] = useState('');

  useEffect(() => {
    if (form.articleTitle) {
      const slug = form.articleTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setForm(prev => ({ ...prev, slugIntro: slug }));
    }
  }, [form.articleTitle]);

  const textToEditorContent = (text: string): EditorContent => {
    return {
      version: '1.0',
      time: Date.now(),
      blocks: text ? [{
        id: `block_${Date.now()}`,
        type: 'paragraph',
        data: { text }
      }] : []
    };
  };

  const handleInputChange = (field: keyof StoryFormState, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const handleSEOChange = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && form.topicTags.length < 5) {
      setForm(prev => ({
        ...prev,
        topicTags: [...prev.topicTags, tagInput.trim()]
      }));
      setTagInput('');
    } else if (form.topicTags.length >= 5) {
      toast.error('Maximum 5 tags allowed');
    }
  }

  const handleRemoveTag = (index: number) => {
    setForm(prev => ({
      ...prev,
      topicTags: prev.topicTags.filter((_, i) => i !== index)
    }));
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

  const handleCopyUrl = () => {
    const url = `https://${form.storyUrl}`;
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  }

  const validateForm = (): boolean => {
    if (!form.articleTitle.trim()) {
      toast.error('Article title is required');
      return false;
    }
    if (!form.shortTitle.trim()) {
      toast.error('Short title is required');
      return false;
    }
    if (!form.mandal.trim()) {
      toast.error('Mandal is required');
      return false;
    }
    return true;
  };

  const prepareFormData = () => {
    const description = textToEditorContent(descriptionText);
    const highlights = textToEditorContent(highlightsText);

    return {
      ...form,
      description,
      highlights,
      storyUrl: form.storyUrl || form.articleTitle.toLowerCase().replace(/\s+/g, '-'),
    };
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSaving(true);

    const payload = {
      ...prepareFormData(),
      scheduleAt: form.schedulePost ? new Date().toISOString() : undefined,
    };

    createStoryMut.mutate(payload, {
      onSuccess: async (response: any) => {
        const storyId = response.data.data?.id;

        try {
          if (coverImage && storyId) {
            await storyApi.uploadCoverImage(storyId, coverImage);
          }
          if (pdfFile && storyId) {
            await storyApi.uploadPDF(storyId, pdfFile);
          }
          toast.success('Video story submitted successfully');
          onClose();
        } catch (error) {
          toast.error('Failed to upload files');
          console.error(error);
        } finally {
          setIsSaving(false);
        }
      },
      onError: (error: any) => {
        toast.error('Failed to submit video story');
        console.error(error);
        setIsSaving(false);
      }
    });
  }

  return (
    <div className="bg-white p-6 space-y-6 max-h-screen overflow-y-auto shadow-md">
      <header className="flex flex-row justify-between items-center border-b pb-4">
        <h1 className="text-[18px] text-[#243874] font-semibold">
          Add New Video
        </h1>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-[#243874] text-white rounded text-sm font-medium hover:bg-[#243874]/90 flex items-center gap-2"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            Submit
          </button>
        </div>
      </header>

      <div className="space-y-6">
        <div className="min-w-full grid md:grid-cols-[1.3fr_2fr] grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Story URL (English) <span className="text-red-500">*</span>
            </label>
            <div className="flex border rounded overflow-hidden">
              <span className="px-3 py-2 text-sm text-gray-600 bg-gray-50 border-r">
                https://
              </span>
              <input
                className="flex-1 px-3 py-2 text-sm outline-none"
                placeholder="domain.com/story-slug"
                value={form.storyUrl}
                onChange={(e) => handleInputChange('storyUrl', e.target.value)}
              />
              <button className="px-3 text-gray-500 hover:bg-gray-50"
                type="button"
                onClick={handleCopyUrl}
              >
                <Clipboard size={16} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Short Title <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border rounded text-sm outline-none"
                value={form.shortTitle}
                onChange={(e) => handleInputChange('shortTitle', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border rounded text-sm outline-none"
                value={form.articleTitle}
                onChange={(e) => handleInputChange('articleTitle', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Slug Intro <span className="text-red-500">*</span>
          </label>
          <textarea rows={2} className="w-full px-3 py-2 border rounded text-sm outline-none resize-none"
            value={form.slugIntro}
            onChange={(e) => handleInputChange('slugIntro', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_2fr]">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Topic Tags (1–2 in English) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input className="w-full px-3 py-2 border rounded text-sm outline-none pr-10"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Tag size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-6">
            {form.topicTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded text-xs font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="hover:text-blue-900"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
          <textarea rows={3} className="w-full px-3 py-2 border rounded text-sm outline-none resize-none"
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_2fr]">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Meta Keywords <span className="text-red-500">*</span>
              </label>
              <textarea rows={2} className="w-full px-3 py-2 border rounded text-sm outline-none resize-none"
                value={form.seo.metaKeywords}
                onChange={(e) => handleSEOChange('metaKeywords', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Meta Description <span className="text-red-500">*</span>
              </label>
              <textarea rows={2} className="w-full px-3 py-2 border rounded text-sm outline-none resize-none"
                onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
                value={form.seo.metaDescription}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Mandal <span className="text-red-500">*</span></label>
              <input className="w-full px-3 py-2 border rounded text-sm outline-none"
                value={form.mandal}
                onChange={(e) => handleInputChange('mandal', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">District</label>
              <input className="w-full px-3 py-2 border rounded text-sm outline-none"
                value={form.district || ''}
                onChange={(e) => handleInputChange('district', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Author</label>
              <input className="w-full px-3 py-2 border rounded text-sm outline-none"
                value={form.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Image Upload */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Cover Image</p>
            {coverImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <img
                  src={coverImagePreview || ''}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverImage(null);
                    setCoverImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-gray-300 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <img src={image} className="mb-3 w-12 opacity-50" />
                <p className="text-sm font-medium text-gray-700">
                  Click to upload cover image
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Recommended: 16:9 ratio, max 10MB
                </p>
              </label>
            )}
          </div>

          {/* Video / File Upload */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Video File / Attachment</p>
            {pdfFile ? (
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 aspect-video justify-center flex-col">
                <div className="bg-red-50 p-3 rounded-full mb-2">
                  <Clipboard className="text-red-500" size={24} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm truncate max-w-[200px]">{pdfFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPdfFile(null)}
                  className="mt-4 text-xs font-semibold text-red-600 hover:underline"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-gray-300 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />
                <img src={vid} className="mb-3 w-12 opacity-50" />
                <p className="text-sm font-medium text-gray-700">
                  Upload video file or PDF
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Max size: 10MB
                </p>
              </label>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4 border-t">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-[#243874]"
              checked={form.enablePaywall}
              onChange={(e) => handleInputChange('enablePaywall', e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">Enable Paywall</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-[#243874]"
              checked={form.schedulePost}
              onChange={(e) => handleInputChange('schedulePost', e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">Schedule Post</span>
          </label>
        </div>
      </div>
    </div>
  )
}