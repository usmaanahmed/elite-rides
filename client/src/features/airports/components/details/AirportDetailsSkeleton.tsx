// Grey placeholder in the shape of the airport page (title, gallery, text), shown while it loads.
// Keeping the same shape stops the page from jumping when the real content appears.
export function AirportDetailsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-4 w-48 animate-pulse rounded-full bg-white/8" />
      <div className="mt-10 h-3 w-32 animate-pulse rounded-full bg-white/10" />
      <div className="mt-6 h-12 w-3/4 max-w-xl animate-pulse rounded-2xl bg-white/10 sm:h-16" />
      <div className="mt-6 h-4 w-2/3 max-w-md animate-pulse rounded-full bg-white/6" />

      {/* Gallery: one block on phones, the 4 x 2 grid shape on wide screens */}
      <div className="mt-12 grid h-72 gap-2 sm:h-96 lg:h-[min(560px,64svh)] lg:grid-cols-4 lg:grid-rows-2">
        <div className="animate-pulse rounded-2xl bg-white/6 lg:col-span-2 lg:row-span-2 lg:rounded-l-[28px] lg:rounded-r-none" />
        <div className="hidden animate-pulse bg-white/5 lg:block" />
        <div className="hidden animate-pulse rounded-tr-[28px] bg-white/5 lg:block" />
        <div className="hidden animate-pulse bg-white/5 lg:block" />
        <div className="hidden animate-pulse rounded-br-[28px] bg-white/5 lg:block" />
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          <div className="h-9 w-64 animate-pulse rounded-2xl bg-white/10" />
          <div className="mt-6 h-4 w-full animate-pulse rounded-full bg-white/6" />
          <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-white/6" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-white/6" />
        </div>
        <div className="h-96 animate-pulse rounded-[28px] bg-white/4" />
      </div>
    </div>
  )
}
