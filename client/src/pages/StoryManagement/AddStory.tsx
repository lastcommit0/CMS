import { Clipboard, Tag } from "lucide-react"
import image from "../../assets/icons/image.svg"
import type { StoryFormState } from "@/types/storyTypes"
import { useEffect, useState } from "react"
import { storyApi } from "@/services/storyService"


const initialStoryFormState: StoryFormState = {
  type: 'STORY',
  status: 'DRAFT',

  storyUrl: '',
  shortTitle: '',
  articleTitle: '',
  slugIntro: '',

  description: '',
  content: { blocks: [] },
  highlights: '',

  topicTags: [],

  seo: {
    metaKeywords: '',
    metaDescription: '',
    googleBot: 'ALLOW',
    excludeIA: true,
  },

  enablePaywall: false,
  schedulePost: false,

  author: '',
  mandal: '',
};

export default function AddStory() {

  const [form, setForm] = useState<StoryFormState>(initialStoryFormState);
  const [storyId, setStoryId] = useState<string | null>(null);

  useEffect(()=> {
    const createDraft = async () => {
      const res = await storyApi.createDraft();
      const story = res.data.data;
      if(!story) return;
      setStoryId(story.id);
      setForm(prev => ({...prev, status: 'DRAFT'}));
    };

    createDraft();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#F8F8F8]">
      <div className="mx-auto bg-white px-6 py-5 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#243874]">New Article</h1>

          <div className="flex gap-3">
            <button className="rounded border bg-gray-100 px-4 py-2 text-sm">
              Save as Draft
            </button>
            <button className="rounded bg-[#243874] px-4 py-2 text-sm text-white">
              Submit
            </button>
          </div>
        </div>

        {/* Type */}
        <div className="mb-6 flex flex-wrap items-center gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" name="type" defaultChecked /> Story
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="type" /> Live Blog
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Enable Paywall
          </label>
        </div>

        {/* Main Grid */}
        <div className="">
          {/* LEFT FORM */}
          <div className="">
            {/* Story URL */}
            <div className="min-w-full grid md:grid-cols-[1.3fr_2fr] grid-cols-1  gap-4">
              <div>
                <label className="label">
                  Story URL (English) <span className="text-red-500">*</span>
                </label>
                <div className="flex border-b bg-gray-100">
                  <span className="px-3 py-2 text-sm text-gray-600 border-r">
                    https://
                  </span>
                  <input className="flex-1 bg-transparent px-3 py-2 text-sm outline-none" />
                  <button className="px-3 text-gray-500">
                    <Clipboard size={16} />
                  </button>
                </div>
              </div>

              {/* Titles */}
              <div className="grid md:grid-cols-[1fr_1fr] grid-cols-1 gap-4">
                <div>
                  <label className="label">
                    Short Title <span className="text-red-500">*</span>
                  </label>
                  <input className="input" />
                </div>

                <div>
                  <label className="label">
                    Article Title <span className="text-red-500">*</span>
                  </label>
                  <input className="input" />
                </div>
              </div>
            </div>

            {/* Slug */}
            <div>
              <label className="label">
                Slug Intro <span className="text-red-500">*</span>
              </label>
              <textarea rows={3} className="input resize-none" />
            </div>

            {/* Tags */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_2fr]">
              <div>
                <label className="label">
                  Topic Tags (1–2 in English) <span className="text-red-500">*</span>
                </label>
                <input className="input" />
                <Tag className="absolute left-13/25 top-17/37 -translate-y-1/2 text-[#636363] hover:text-gray-500/70 w-4 h-4 cursor-pointer" />
              </div>
              <div>

              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label">Description</label>
              <textarea rows={4} className="input resize-none" />
            </div>

            {/* SEO */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_2fr]">
              <div>
                <label className="label">
                  Meta Keywords <span className="text-red-500">*</span>
                </label>
                <textarea rows={3} className="input resize-none" />
              </div>

              <div>
                <label className="label">
                  Meta Description <span className="text-red-500">*</span>
                </label>
                <textarea rows={3} className="input resize-none" />
              </div>
            </div>

            {/* Image + Right Fields */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_2fr]">
              {/* Image Upload */}
              <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                <img src={image} className="mb-4 w-14 opacity-80" />
                <p className="text-sm font-semibold">
                  Drag and drop an image, or{" "}
                  <span className="text-blue-600 cursor-pointer">Browse</span>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 800px width. Max 10MB
                </p>
              </div>

              {/* Right Meta */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="label">
                      District
                    </label>
                    <input className="input" />
                  </div>
                  <div className="flex flex-col">
                    <label className="label">
                      Mandal <span className="text-red-500">*</span>
                    </label>
                    <input className="input" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="label">
                      Photo Caption
                    </label>
                    <input className="input" />
                  </div>
                  <div className="flex flex-col">
                    <label className="label">
                      Photo Credit
                    </label>
                    <input className="input" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="label">
                      Author
                    </label>
                    <input className="input" />
                  </div>
                  <div className="flex flex-col">
                    <label className="label">
                      Place
                    </label>
                    <input className="input" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="label">
                    Highlights
                  </label>
                  <textarea rows={3} className="input resize-none" />
                </div>

                <div className="flex flex-wrap justify-between gap-6 pt-2 text-sm">
                  <div>
                    <p className="mb-1 font-semibold">Google Bot</p>
                    <div className="flex gap-4">
                      <label className="flex gap-2">
                        <input type="radio" defaultChecked /> Allow
                      </label>
                      <label className="flex gap-2">
                        <input type="radio" /> Disallow
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-6 pt-6">
                    <label className="flex gap-2">
                      <input type="checkbox" defaultChecked /> Exclude IA
                    </label>
                    <label className="flex gap-2">
                      <input type="checkbox" defaultChecked /> Schedule Post
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF Upload */}
            <div className="mt-8 flex h-[180px] flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
              <img src={image} className="mb-3 w-12 opacity-80" />
              <p className="text-sm font-semibold">
                Drag and drop PDF file here, or{" "}
                <span className="text-blue-600 cursor-pointer">Browse</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Max PDF file size is 10MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shared styles */}
      <style>
        {`
          .label {
            display: block;
            margin-bottom: 4px;
            font-size: 13px;
            color: #525252;
            font-weight: 500;
          }
          .input {
            width: 100%;
            background: #f3f4f6;
            border-bottom: 1px solid #d1d5db;
            padding: 8px;
            font-size: 14px;
            outline: none;
          }
        `}
      </style>
    </div>
  )
}
