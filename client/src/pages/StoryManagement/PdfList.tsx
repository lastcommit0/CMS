


export default function PdfList() {

    return (
        <div className="space-y-6">
  {/* HEADER */}
  <div className="flex items-center justify-between border-b pb-3">
    <h2 className="text-lg font-semibold text-blue-700">
      Add New E-Paper PDF
    </h2>

    <div className="flex gap-3">
      <button className="px-4 py-1.5 text-sm border rounded-md">
        Cancel
      </button>
      <button className="px-4 py-1.5 text-sm border rounded-md bg-gray-100">
        Download PDF
      </button>
      <button className="px-4 py-1.5 text-sm rounded-md bg-blue-700 text-white">
        Submit
      </button>
    </div>
  </div>

  {/* PDF TYPE */}
  <div className="flex items-center gap-6 text-sm">
    <span className="font-medium text-gray-700">PDF Type</span>

    <label className="flex items-center gap-2">
      <input type="radio" name="type" defaultChecked />
      E-Paper
    </label>

    <label className="flex items-center gap-2">
      <input type="radio" name="type" />
      Magazine
    </label>
  </div>

  {/* TOP UPLOAD SECTION */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* COVER IMAGE */}
    <UploadBox
      title="Drag and drop Cover image, or"
      subtitle="Minimum 800px width recommended. Max 10MB each"
      browseText="Browse"
      icon="image"
    />

    {/* PDF UPLOAD */}
    <UploadBox
      title="Drag and drop PDF file here, or"
      subtitle="Max PDF file size is 10MB"
      browseText="Browse"
      icon="pdf"
    />
  </div>

  {/* IMAGE QUEUE SECTION */}
  <UploadBox
    title="Drag and drop images file here, or"
    subtitle="Minimum 800px width recommended. You can select multiple images."
    browseText="Browse"
    icon="image"
    large
  />
</div>

    )
}

function UploadBox({ title, subtitle, browseText, icon, large }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-center
      ${large ? "h-[220px]" : "h-[260px]"}`}
    >
      {/* ICON */}
      <div className="mb-4">
        {icon === "pdf" ? (
          <span className="text-orange-500 font-bold text-xl">PDF</span>
        ) : (
          <div className="w-12 h-12 bg-orange-200 rounded-lg" />
        )}
      </div>

      {/* TEXT */}
      <p className="text-sm font-semibold text-gray-800">
        {title}{" "}
        <span className="text-blue-600 cursor-pointer">{browseText}</span>
      </p>

      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}
