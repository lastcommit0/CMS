import { Clipboard, Tag } from "lucide-react"
import image from "../../assets/icons/image.svg"
import pdf from "../../assets/icons/pdf.svg"
import type { CreateStoryRequest, StoryFormState } from "@/types/storyTypes"
import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateStory } from "@/hooks/useStories"
import { toast } from "sonner"
import { Loader2, X } from "lucide-react"
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor"
import { storageApi } from "@/services/storageService"
import type { StoryAssetInput } from "@/types/storyTypes"
import { useUploadImage } from "@/hooks/useStorage"
import { storyApi } from "@/services/storyService"

const MAX_META_DESCRIPTION_LENGTH = 160;
const MIN_META_DESCRIPTION_LENGTH = 150;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
const ALLOWED_PDF_MIME_TYPES = new Set(['application/pdf']);
const ALLOWED_PDF_EXTENSIONS = new Set(['pdf']);
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STORY_URL_REGEX = /^(?!https?:\/\/)[a-z0-9]+([.-][a-z0-9]+)*(\/[a-z0-9\-._~%!$&'()*+,;=:@/]*)?$/i;
type SeoField = keyof StoryFormState['seo'];
type StoryDuplicateCandidate = {
  id: string;
  title?: string;
  slug?: string;
  storyUrl?: string;
};

const stripHtmlTags = (value: string): string =>
  value
    .replace(/<[^>]*>/g, '')
    .replace(/[^\x20-\x7E]/g, '')
    .trim();

const containsHtmlTags = (value: string): boolean => /<[^>]*>/.test(value);

const sanitizeEditorContent = (content: StoryFormState['description']) => ({
  ...content,
  blocks: content.blocks.map((block) => {
    if (block.type === 'paragraph') {
      return {
        ...block,
        data: { ...block.data, text: stripHtmlTags(block.data.text || '') },
      };
    }
    if (block.type === 'heading') {
      return {
        ...block,
        data: { ...block.data, text: stripHtmlTags(block.data.text || '') },
      };
    }
    return block;
  }),
});

const hasUnsafeEditorContent = (content: StoryFormState['description']): boolean =>
  content.blocks.some((block) => {
    if (block.type === 'paragraph' || block.type === 'heading') {
      return containsHtmlTags(block.data.text || '');
    }
    return false;
  });

const getFileExtension = (name: string): string =>
  name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';

const extractStoryCandidates = (payload: unknown): StoryDuplicateCandidate[] => {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const rawPayload = payload as { stories?: unknown; data?: { data?: unknown } | unknown };
  const stories = Array.isArray(rawPayload.stories)
    ? rawPayload.stories
    : rawPayload.data && typeof rawPayload.data === 'object' && Array.isArray((rawPayload.data as { data?: unknown }).data)
      ? (rawPayload.data as { data: unknown[] }).data
      : Array.isArray(rawPayload.data)
        ? rawPayload.data
        : [];

  return stories.filter((item): item is StoryDuplicateCandidate => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as { id?: unknown };
    return typeof candidate.id === 'string' && candidate.id.length > 0;
  });
};

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
  const draftHydratedRef = useRef(false);
  const draftSaveTimerRef = useRef<number | null>(null);
  const [form, setForm] = useState<StoryFormState>(initialStoryFormState);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const uploadImageMut = useUploadImage();


  const DRAFT_STORAGE_KEY = 'cms:add-story-draft:v1';

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!stored) {
        draftHydratedRef.current = true;
      } else {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.form) {
          setForm(parsed.form);
        }
        if (parsed && typeof parsed.tagInput === 'string') {
          setTagInput(parsed.tagInput);
        }
        draftHydratedRef.current = true;
      }

      // Check for News Agent Data Handoff
      const agentDataStr = sessionStorage.getItem('newsAgent:generatedStory');
      if (agentDataStr) {
        const agentData = JSON.parse(agentDataStr);
        setForm(prev => ({
          ...prev,
          articleTitle: agentData.title || prev.articleTitle,
          shortTitle: agentData.shortTitle || prev.shortTitle,
          slugIntro: agentData.slug || prev.slugIntro,
          description: agentData.content || prev.description,
          highlights: agentData.highlights || prev.highlights,
          mandal: agentData.mandal || prev.mandal,
          district: agentData.district || prev.district,
          seo: {
            ...prev.seo,
            metaKeywords: agentData.metaTags?.metaKeywords || prev.seo.metaKeywords,
            metaDescription: agentData.metaTags?.metaDescription || prev.seo.metaDescription,
          }
        }));

        // Handle Automatic Image Placement
        if (agentData.imageUrl && !coverImagePreview) {
          fetch(agentData.imageUrl)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], 'cover-image.jpg', { type: 'image/jpeg' });
              setCoverImage(file);
              setCoverImagePreview(agentData.imageUrl);
              // Proactively upload to storage
              uploadImageMut.mutate(file);
            })
            .catch(err => console.error('Failed to fetch agent image:', err));
        }

        toast.success('Story imported from News Agent');
        // We keep it in session for now in case of refresh, 
        // but clear it on success or if user wants to discard
      }
    } catch (error) {
      console.warn('Failed to restore draft or agent data', error);
      draftHydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!draftHydratedRef.current) return;

    if (draftSaveTimerRef.current) {
      window.clearTimeout(draftSaveTimerRef.current);
    }

    draftSaveTimerRef.current = window.setTimeout(() => {
      try {
        const payload = {
          form,
          tagInput,
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
      } catch (error) {
        console.warn('Failed to save draft to storage', error);
      }
    }, 300);

    return () => {
      if (draftSaveTimerRef.current) {
        window.clearTimeout(draftSaveTimerRef.current);
      }
    };
  }, [form, tagInput]);

  const clearDraftStorage = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      sessionStorage.removeItem('newsAgent:generatedStory');
    } catch (error) {
      console.warn('Failed to clear draft storage', error);
    }
  };

  useEffect(() => {
    if (form.articleTitle) {
      const slug = form.articleTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setForm(prev => ({ ...prev, slugIntro: slug }));
    }
  }, [form.articleTitle]);


  const handleInputChange = <K extends keyof StoryFormState>(field: K, value: StoryFormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const handleSEOChange = <K extends SeoField>(field: K, value: StoryFormState['seo'][K]) => {
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
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error('Image size should be less than 10MB');
        return;
      }
      const fileExtension = getFileExtension(file.name);
      if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type) || !ALLOWED_IMAGE_EXTENSIONS.has(fileExtension)) {
        toast.error('Only image files are allowed');
        return;
      }
      uploadImageMut.mutate(file);
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
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error('PDF file size should be less than 10MB');
        return;
      }
      const fileExtension = getFileExtension(file.name);
      if (!ALLOWED_PDF_MIME_TYPES.has(file.type) || !ALLOWED_PDF_EXTENSIONS.has(fileExtension)) {
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

  const checkForDuplicateStoryData = async (): Promise<boolean> => {
    try {
      const storyUrl = form.storyUrl.trim().toLowerCase();
      const title = form.articleTitle.trim().toLowerCase();
      const slug = form.slugIntro.trim().toLowerCase();
      const searchTerms = Array.from(new Set([title, slug, storyUrl].filter(Boolean)));
      const candidates: StoryDuplicateCandidate[] = [];

      await Promise.all(
        searchTerms.map(async (term) => {
          const response = await storyApi.getStories({ search: term, page: 1, limit: 50 });
          const stories = extractStoryCandidates(response.data);
          candidates.push(...stories);
        })
      );

      const uniqueCandidates = Array.from(
        new Map(candidates.map((item) => [item.id, item])).values()
      );
      const duplicateTitle = uniqueCandidates.find((item) =>
        typeof item?.title === 'string' && item.title.trim().toLowerCase() === title
      );
      const duplicateSlug = uniqueCandidates.find((item) =>
        typeof item?.slug === 'string' && item.slug.trim().toLowerCase() === slug
      );
      const duplicateStoryUrl = uniqueCandidates.find((item) =>
        typeof item?.storyUrl === 'string' && item.storyUrl.trim().toLowerCase() === storyUrl
      );

      if (duplicateTitle) {
        toast.error('A story with this article title already exists');
        return false;
      }
      if (duplicateSlug || duplicateStoryUrl) {
        toast.error('Story URL / slug already exists');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to validate duplicate story data', error);
      toast.error('Unable to verify duplicate title/slug right now');
      return false;
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const normalizedStoryUrl = form.storyUrl.trim();
    const normalizedSlug = form.slugIntro.trim().toLowerCase();
    const normalizedMetaDescription = form.seo.metaDescription.trim();
    const keywords = form.seo.metaKeywords
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);

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
    if (!SLUG_REGEX.test(normalizedSlug)) {
      toast.error('Slug must contain only lowercase letters, numbers, and hyphens');
      return false;
    }
    if (normalizedStoryUrl && !STORY_URL_REGEX.test(normalizedStoryUrl)) {
      toast.error('Story URL is invalid. Use domain/path without protocol');
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
    if (
      normalizedMetaDescription.length < MIN_META_DESCRIPTION_LENGTH ||
      normalizedMetaDescription.length > MAX_META_DESCRIPTION_LENGTH
    ) {
      toast.error('Meta description must be between 150 and 160 characters');
      return false;
    }
    if (keywords.length === 0) {
      toast.error('Meta keywords should be comma-separated values');
      return false;
    }
    if (keywords.some((keyword) => keyword.length < 2 || keyword.length > 50 || !/^[a-z0-9\s-]+$/i.test(keyword))) {
      toast.error('Each meta keyword must be 2-50 chars and use letters, numbers, spaces or hyphens');
      return false;
    }
    if (containsHtmlTags(form.articleTitle) || containsHtmlTags(form.shortTitle) || containsHtmlTags(form.slugIntro)) {
      toast.error('HTML tags are not allowed in story title fields');
      return false;
    }
    if (hasUnsafeEditorContent(form.description) || hasUnsafeEditorContent(form.highlights)) {
      toast.error('HTML tags are not allowed in description/highlights text');
      return false;
    }
    if (!form.description.blocks.length) {
      toast.error('Description is required');
      return false;
    }
    if (!coverImage) {
      toast.error('Cover image is required');
      return false;
    }
    if (!pdfFile) {
      toast.error('PDF is required');
      return false;
    }
    return checkForDuplicateStoryData();
  };

  const prepareFormData = (status: 'DRAFT' | 'SUBMITTED') => {
    const sanitizedDescription = sanitizeEditorContent(form.description);
    const sanitizedHighlights = sanitizeEditorContent(form.highlights);
    const sanitizedStoryUrl = stripHtmlTags(form.storyUrl) || stripHtmlTags(form.articleTitle).toLowerCase().replace(/\s+/g, '-');
    const sanitizedMetaKeywords = form.seo.metaKeywords
      .split(',')
      .map((keyword) => stripHtmlTags(keyword))
      .filter(Boolean)
      .join(', ');

    return {
      title: stripHtmlTags(form.articleTitle),
      shortTitle: stripHtmlTags(form.shortTitle),
      slug: stripHtmlTags(form.slugIntro).toLowerCase(),
      excerpt: stripHtmlTags(form.slugIntro).slice(0, 100),
      content: sanitizedDescription,
      highlights: sanitizedHighlights.blocks.length ? sanitizedHighlights : undefined,
      storyType: form.type === 'STORY' ? 'NEWS' : 'BLOG',
      status,
      mandal: stripHtmlTags(form.mandal),
      district: form.district ? stripHtmlTags(form.district) : undefined,
      place: form.place ? stripHtmlTags(form.place) : undefined,
      photoCaption: form.photoCaption ? stripHtmlTags(form.photoCaption) : undefined,
      photoCredit: form.photoCredit ? stripHtmlTags(form.photoCredit) : undefined,
      storyUrl: sanitizedStoryUrl,
      metaTags: {
        metaKeywords: sanitizedMetaKeywords,
        metaDescription: stripHtmlTags(form.seo.metaDescription),
        googleBot: form.seo.googleBot,
        excludeIA: form.seo.excludeIA,
      }
    };
  };

  const uploadRequiredAssets = async (): Promise<StoryAssetInput[]> => {
    if (!coverImage || !pdfFile) {
      throw new Error('Cover image and PDF are required');
    }

    const [coverRes, pdfRes] = await Promise.all([
      storageApi.uploadImage(coverImage),
      storageApi.uploadPdf(pdfFile),
    ]);

    if (coverRes.data.fileUrl) {
      setCoverImagePreview(coverRes.data.fileUrl);
    }

    return [
      { mediaId: coverRes.data.id, isCover: true, order: 0 },
      { mediaId: pdfRes.data.id, isCover: false, order: 1 },
    ];
  };

  const handleSaveDraft = async () => {
    if (!(await validateForm())) return;
    setIsSaving(true);

    try {
      const assets = await uploadRequiredAssets();
      const payload = { ...prepareFormData('DRAFT'), assets } as unknown as CreateStoryRequest;

      createStoryMut.mutate(payload, {
        onSuccess: async () => {
          clearDraftStorage();
          toast.success('Story saved as draft');
          navigate('/user/stories/view');
          setIsSaving(false);
        },
        onError: (error) => {
          toast.error('Failed to save draft');
          console.error(error);
          setIsSaving(false);
        }
      });
    } catch (error) {
      toast.error('Failed to upload files');
      console.error(error);
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!(await validateForm())) return;
    setIsSaving(true);

    try {
      const assets = await uploadRequiredAssets();
      const payload = {
        ...prepareFormData('SUBMITTED'),
        scheduleAt: form.schedulePost ? new Date().toISOString() : undefined,
        assets,
      } as unknown as CreateStoryRequest;

      createStoryMut.mutate(payload, {
        onSuccess: async () => {
          clearDraftStorage();
          toast.success('Story submitted successfully');
          navigate('/user/stories/view');
          setIsSaving(false);
        },
        onError: (error) => {
          toast.error('Failed to submit story');
          console.error(error);
          setIsSaving(false);
        }
      });
    } catch (error) {
      toast.error('Failed to upload files');
      console.error(error);
      setIsSaving(false);
    }
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
              value={form.description}
              onChange={(val) => handleInputChange('description', val)}
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
              />
              <p className="mt-1 text-xs text-gray-500">
                Use comma-separated keywords (example: politics, local news, election)
              </p>
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
              />
              <p className={`mt-1 text-xs ${form.seo.metaDescription.trim().length >= MIN_META_DESCRIPTION_LENGTH && form.seo.metaDescription.trim().length <= MAX_META_DESCRIPTION_LENGTH ? 'text-green-600' : 'text-amber-600'}`}>
                {form.seo.metaDescription.trim().length}/{MAX_META_DESCRIPTION_LENGTH} characters (recommended {MIN_META_DESCRIPTION_LENGTH}-{MAX_META_DESCRIPTION_LENGTH})
              </p>
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
                  value={form.highlights}
                  onChange={(val) => handleInputChange('highlights', val)}
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
