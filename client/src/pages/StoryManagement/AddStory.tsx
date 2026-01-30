import { Clipboard, Tag } from "lucide-react"
import image from "../../assets/icons/image.svg"
import pdf from "../../assets/icons/pdf.svg"
import type { StoryFormState, EditorContent } from "@/types/storyTypes"
import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateStory } from "@/hooks/useStories"
import { toast } from "sonner"
import { Loader2, X } from "lucide-react"
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor"

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
  author: '',
  mandal: '',
};

export default function AddStory() {
  const navigate = useNavigate();
  const createStoryMut = useCreateStory();
  const [form, setForm] = useState<StoryFormState>(initialStoryFormState);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  
  // Temporary text state for description and highlights
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

  // Convert text to EditorContent format
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
    if (!form.slugIntro.trim()) {
      toast.error('Slug intro is required');
      return false;
    }
    if (!form.mandal.trim()) {
      toast.error('Mandal is required');
      return false;
    }
    if (form.topicTags.length === 0) {
      toast.error('At least one topic tag is required');
      return false;
    }
    if (!form.seo.metaKeywords.trim()) {
      toast.error('Meta keywords are required');
      return false;
    }
    if (!form.seo.metaDescription.trim()) {
      toast.error('Meta description is required');
      return false;
    }
    return true;
  };

  const prepareFormData = () => {
    // Convert text inputs to EditorContent
    const description = textToEditorContent(descriptionText);
    const highlights = textToEditorContent(highlightsText);

    return {
      ...form,
      description,
      highlights,
      storyUrl: form.storyUrl || form.articleTitle.toLowerCase().replace(/\s+/g, '-'),
    };
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;
    setIsSaving(true);

    const payload = prepareFormData();

    createStoryMut.mutate(payload, {
      onSuccess: (response) => {
        const storyId = response.data.id;
        
        // Upload files if present
        const uploadPromises = [];
        if (coverImage && storyId) {
          uploadPromises.push(
            // You'll need to implement this in your API
            // storyApi.uploadCoverImage(storyId, coverImage)
          );
        }
        if (pdfFile && storyId) {
          uploadPromises.push(
            // storyApi.uploadPDF(storyId, pdfFile)
          );
        }

        Promise.all(uploadPromises)
          .then(() => {
            toast.success('Story saved as draft');
            navigate('/user/stories/view');
          })
          .catch((error) => {
            toast.error('Failed to upload files');
            console.error(error);
          })
          .finally(() => {
            setIsSaving(false);
          });
      },
      onError: (error) => {
        toast.error('Failed to save draft');
        console.error(error);
        setIsSaving(false);
      }
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSaving(true);

    const payload = {
      ...prepareFormData(),
      scheduleAt: form.schedulePost ? new Date().toISOString() : undefined,
    };

    createStoryMut.mutate(payload, {
      onSuccess: (response) => {
        const storyId = response.data.id;
        
        // Upload files if present
        const uploadPromises = [];
        if (coverImage && storyId) {
          uploadPromises.push(
            // storyApi.uploadCoverImage(storyId, coverImage)
          );
        }
        if (pdfFile && storyId) {
          uploadPromises.push(
            // storyApi.uploadPDF(storyId, pdfFile)
          );
        }

        Promise.all(uploadPromises)
          .then(() => {
            toast.success('Story submitted successfully');
            navigate('/user/stories/view');
          })
          .catch((error) => {
            toast.error('Failed to upload files');
            console.error(error);
          })
          .finally(() => {
            setIsSaving(false);
          });
      },
      onError: (error) => {
        toast.error('Failed to submit story');
        console.error(error);
        setIsSaving(false);
      }
    });
  }

  return (
    <div className="min-h-screen w-full bg-[#F8F8F8]">
      <div className="mx-auto bg-white px-6 py-5 shadow-sm">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#243874]">New Article</h1>

          <div className="flex gap-3">
            <button 
              className="rounded border bg-gray-100 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSaveDraft}
              disabled={createStoryMut.isPending || isSaving}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                'Save as Draft'
              )}
            </button>
            <button 
              className="rounded bg-[#243874] px-4 py-2 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={createStoryMut.isPending || isSaving}
            >
              {createStoryMut.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200" />
        
        {/* Type */}
        <div className="my-6 flex flex-wrap items-center gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              checked={form.type === 'STORY'}
              onChange={() => handleInputChange('type', 'STORY')}
            />
            Story
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              checked={form.type === 'LIVE_BLOG'}
              onChange={() => handleInputChange('type', 'LIVE_BLOG')}
            />
            Live Blog
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.enablePaywall}
              onChange={(e) => handleInputChange('enablePaywall', e.target.checked)}
            />
            Enable Paywall
          </label>
        </div>

        {/* Main Grid */}
        <div className="space-y-6">
          {/* Story URL */}
          <div className="min-w-full grid md:grid-cols-[1.3fr_2fr] grid-cols-1 gap-4">
            <div>
              <label className="custom-label">
                Story URL (English) <span className="text-red-500">*</span>
              </label>
              <div className="flex border-b bg-gray-100">
                <span className="px-3 py-2 text-sm text-gray-600 border-r">
                  https://
                </span>
                <input 
                  className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                  value={form.storyUrl}
                  onChange={(e) => handleInputChange('storyUrl', e.target.value)}
                />
                <button 
                  className="px-3 text-gray-500 hover:text-gray-700"
                  type="button"
                  onClick={handleCopyUrl}
                >
                  <Clipboard size={16} />
                </button>
              </div>
            </div>

            {/* Titles */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label className="custom-label">
                  Short Title <span className="text-red-500">*</span>
                </label>
                <input 
                  className="custom-input"
                  value={form.shortTitle}
                  onChange={(e) => handleInputChange('shortTitle', e.target.value)}
                />
              </div>

              <div>
                <label className="custom-label">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input 
                  className="custom-input"
                  value={form.articleTitle}
                  onChange={(e) => handleInputChange('articleTitle', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="custom-label">
              Slug Intro <span className="text-red-500">*</span>
            </label>
            <textarea 
              rows={3} 
              className="custom-input resize-none"
              value={form.slugIntro}
              onChange={(e) => handleInputChange('slugIntro', e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_2fr]">
            <div>
              <label className="custom-label">
                Topic Tags (1–2 in English) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  className="custom-input pr-10"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Type and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#636363] hover:text-gray-700"
                >
                  <Tag size={16} />
                </button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.topicTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex h-10 mt-4 items-center gap-1 bg-gray-200 text-blue-800 px-2 rounded text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="hover:text-blue-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="custom-label">Description</label>
              <RichTextEditor
                value={descriptionText}
                onChange={setDescriptionText}
                rows={8}
              />
          </div>

          {/* SEO */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_2fr]">
            <div>
              <label className="custom-label">
                Meta Keywords <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows={3} 
                className="custom-input resize-none w-full"
                value={form.seo.metaKeywords}
                onChange={(e) => handleSEOChange('metaKeywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div>
              <label className="custom-label">
                Meta Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows={3} 
                className="custom-input resize-none w-full"
                onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
                value={form.seo.metaDescription}
                placeholder="SEO description for search engines"
              />
            </div>
          </div>

          {/* Image + Right Fields */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_2fr]">
            {/* Image Upload */}
            <div>
              {coverImage ? (
                <div className="relative border-2 border-dashed rounded-lg p-4 h-full min-h-[200px]">
                  <img
                    src={coverImagePreview || ''}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(null);
                      setCoverImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dotted text-center cursor-pointer hover:bg-gray-50 min-h-[200px]">
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

            {/* Right Meta */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="custom-label">District</label>
                  <input 
                    className="custom-input" 
                    value={form.district || ''}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="custom-label">
                    Mandal <span className="text-red-500">*</span>
                  </label>
                  <input 
                    className="custom-input" 
                    value={form.mandal}
                    onChange={(e) => handleInputChange('mandal', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="custom-label">Photo Caption</label>
                  <input 
                    className="custom-input" 
                    value={form.photoCaption || ''}
                    onChange={(e) => handleInputChange('photoCaption', e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="custom-label">Photo Credit</label>
                  <input 
                    className="custom-input" 
                    value={form.photoCredit || ''}
                    onChange={(e) => handleInputChange('photoCredit', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="custom-label">Author</label>
                  <input 
                    className="custom-input" 
                    value={form.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="custom-label">Place</label>
                  <input 
                    className="custom-input"
                    value={form.place || ''}
                    onChange={(e) => handleInputChange('place', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="custom-label">Highlights</label>
                <RichTextEditor
                  value={highlightsText}
                  onChange={setHighlightsText}
                  rows={4}
                />
              </div>

              <div className="flex flex-wrap justify-between gap-6 pt-2 text-sm">
                <div>
                  <p className="mb-1 font-semibold">Google Bot</p>
                  <div className="flex gap-4">
                    <label className="flex gap-2">
                      <input 
                        type="radio"
                        name="googleBot"
                        checked={form.seo.googleBot === 'ALLOW'}
                        onChange={() => handleSEOChange('googleBot', 'ALLOW')}
                      /> Allow
                    </label>
                    <label className="flex gap-2">
                      <input 
                        type="radio"
                        name="googleBot"
                        checked={form.seo.googleBot === 'DISALLOW'}
                        onChange={() => handleSEOChange('googleBot', 'DISALLOW')}
                      /> Disallow
                    </label>
                  </div>
                </div>

                <div className="flex gap-6 pt-6">
                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={form.seo.excludeIA}
                      onChange={(e) => handleSEOChange('excludeIA', e.target.checked)}
                    />
                    Exclude IA
                  </label>
                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={form.schedulePost}
                      onChange={(e) => handleInputChange('schedulePost', e.target.checked)}
                    />
                    Schedule Post
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Upload */}
          <div>
            {pdfFile ? (
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
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
              <label className="flex h-[180px] flex-col items-center justify-center rounded-lg border-2 border-dotted text-center cursor-pointer hover:bg-gray-50">
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
      </div>
    </div>
  )
}