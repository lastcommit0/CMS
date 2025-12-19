import { Clipboard } from "lucide-react";
import image from "../../assets/icons/image.svg";

export default function AddStory() {
    return (
        <div className="mx-auto ml-96 min-h-screen max-w-7xl bg-white p-6 shadow">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-[#243874]">New Article</h1>
                <div className="flex gap-3">
                    <button className="rounded-sm border px-4 py-2 text-sm bg-gray-100 ">
                        Save as Draft
                    </button>
                    <button className="rounded-md bg-[#243874] px-4 py-2 text-sm text-white hover:bg-blue-700">
                        Submit
                    </button>
                </div>
            </div>

            {/* Story Type */}
            <div className="mb-6 flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="type" defaultChecked /> Story
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="type" /> Live Blog
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" /> Enable Paywall
                </label>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-600 opacity-85">Story URL (English)
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center overflow-hidden border-b border-gray-300 bg-gray-100">
                            <span className="select-none border-r bg-gray-100 px-3 py-2 text-sm text-gray-600">
                                https://
                            </span>
                            <input
                                type="url"
                                placeholder=""
                                className="flex-1 px-3 py-2 text-sm outline-none"
                            />
                            <button
                                type="button"
                                className="flex items-center justify-center px-3 text-gray-500 hover:text-gray-700"
                            >
                                <Clipboard size={16} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-600 opacity-85">Article Title
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center overflow-hidden border-b border-gray-300 bg-gray-100">
                            <input
                                type="url"
                                placeholder=""
                                className="flex-1 px-3 py-2 text-sm outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-600 opacity-85">Short Title
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center overflow-hidden border-b border-gray-300 bg-gray-100">
                            <input
                                type="url"
                                placeholder=""
                                className="flex-1 px-3 py-2 text-sm outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-600 opacity-85">Slug Intro
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center overflow-hidden border-b border-gray-300 bg-gray-100">
                            <textarea
                                placeholder=""
                                rows={3}
                                className="flex-1 px-3 py-2 text-sm outline-none resize-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-600 opacity-85">Topic Tags (1-2 tags in English)
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center overflow-hidden border-b border-gray-300 bg-gray-100">
                            <input
                                className="flex-1 px-3 py-2 text-sm outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-600 opacity-85">Description</label>
                        <div className="flex items-center overflow-hidden border-b border-gray-300 bg-gray-100">
                            <textarea
                                placeholder=""
                                rows={3}
                                className="flex-1 px-3 py-2 text-sm outline-none resize-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-600 opacity-85">Meta Keywoard
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center overflow-hidden border-b border-gray-300 bg-gray-100">
                            <textarea
                                rows={3}
                                className="flex-1 px-3 py-2 text-sm outline-none resize-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-600 opacity-85">Meta Description
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center overflow-hidden border-b border-gray-300 bg-gray-100">
                            <textarea
                                placeholder=""
                                rows={3}
                                className="flex-1 px-3 py-2 text-sm outline-none resize-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
                        {/* IMAGE UPLOAD */}
                        <div className="h-90 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-center">
                            <img src={image} alt="" className="mb-4 w-16 opacity-80" />

                            <p className="text-sm font-semibold text-gray-800">
                                Drag and drop an image, or{" "}
                                <span className="text-blue-600 cursor-pointer">Browse</span>
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Minimum 800px width recommended. Max 10MB each
                            </p>
                        </div>

                        {/* RIGHT FORM */}
                        <div className="space-y-5">
                            {/* District / Mandal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        District
                                    </label>
                                    <input className="w-full border-b border-gray-300 bg-gray-100 px-2 py-2 text-sm outline-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Mandal <span className="text-red-500">*</span>
                                    </label>
                                    <input className="w-full border-b border-gray-300 bg-gray-100 px-2 py-2 text-sm outline-none" />
                                </div>
                            </div>

                            {/* Photo Caption / Credit */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Photo Caption
                                    </label>
                                    <input className="w-full border-b border-gray-300 bg-gray-100 px-2 py-2 text-sm outline-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Photo Credit
                                    </label>
                                    <input className="w-full border-b border-gray-300 bg-gray-100 px-2 py-2 text-sm outline-none" />
                                </div>
                            </div>

                            {/* Author / Place */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Author
                                    </label>
                                    <select className="w-full border-b border-gray-300 bg-gray-100 px-2 py-2 text-sm outline-none">
                                        <option />
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Place
                                    </label>
                                    <select className="w-full border-b border-gray-300 bg-gray-100 px-2 py-2 text-sm outline-none">
                                        <option />
                                    </select>
                                </div>
                            </div>

                            {/* Highlights */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Highlights
                                </label>

                                <textarea
                                    rows={3}
                                    className="w-full border-b border-gray-300 bg-gray-100 px-2 py-2 text-sm outline-none resize-none"
                                />
                            </div>

                            {/* Google Bot + Options */}
                            <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-1">
                                        Google Bot
                                    </p>
                                    <div className="flex gap-4 text-sm">
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="bot" defaultChecked /> Allow
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="bot" /> Disallow
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-6 text-sm">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" defaultChecked /> Exclude IA
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" defaultChecked /> Schedule Post
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PDF UPLOAD */}
                    <div className="mt-8 h-45 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-center">
                        <img src={image} alt="" className="mb-3 w-12 opacity-80" />
                        <p className="text-sm font-semibold text-gray-800">
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
    );
}
