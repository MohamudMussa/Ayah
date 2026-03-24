export default function AyahSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 text-center px-2 animate-pulse">
      <div className="space-y-1.5">
        <div className="skeleton h-5 w-24 mx-auto" />
        <div className="skeleton h-3 w-36 mx-auto" />
      </div>
      <div className="space-y-2 w-full max-w-sm">
        <div className="skeleton h-7 w-full" />
        <div className="skeleton h-7 w-4/5 mx-auto" />
      </div>
      <div className="space-y-1.5 w-full max-w-xs">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4 mx-auto" />
      </div>
      <div className="skeleton h-px w-8" />
      <div className="skeleton h-3 w-14 mx-auto" />
    </div>
  )
}
