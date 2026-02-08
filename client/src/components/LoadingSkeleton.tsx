

export default function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-[#0F172A] p-4 space-y-4">
        <div className="h-10 w-40 bg-gray-700 rounded animate-pulse" />
        <div className="space-y-3 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-full bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </aside>

      <main className="flex-1 p-6 space-y-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-300 rounded animate-pulse" />
        </div>

        <div className="flex gap-4">
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-28 bg-gray-300 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white border rounded-lg p-4 flex items-center gap-4 animate-pulse"
            >
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-6 w-12 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 gap-4 px-4 py-3 border-b bg-gray-100">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded animate-pulse" />
            ))}
          </div>

          <div className="divide-y">
            {Array.from({ length: 10 }).map((_, row) => (
              <div
                key={row}
                className="grid grid-cols-7 gap-4 px-4 py-4 animate-pulse"
              >
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded col-span-1" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
