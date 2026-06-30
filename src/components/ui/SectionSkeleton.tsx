export function SectionSkeleton() {
  return (
    <div className="py-16 md:py-20 px-4 border-b-2 border-black animate-pulse">
      <div className="max-w-[1200px] mx-auto">
        <div className="h-4 w-8 bg-newsprint-accent border border-black mb-4" />
        <div className="h-10 w-64 bg-newsprint-accent border-2 border-black mb-8" />
        <div className="space-y-4">
          <div className="h-24 bg-newsprint-accent border-2 border-black" />
          <div className="h-24 bg-newsprint-accent border-2 border-black" />
        </div>
      </div>
    </div>
  );
}