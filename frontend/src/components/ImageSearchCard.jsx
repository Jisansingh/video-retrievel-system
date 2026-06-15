export default function ImageSearchCard({ filename, date, searchType, resultsCount, imageSrc }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:shadow-md hover:border-primary transition-colors flex flex-col justify-between h-full">
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container">
          <img alt={filename} className="w-full h-full object-cover" src={imageSrc} />
        </div>
        <div>
          <span className="font-body-sm text-body-sm text-outline">{date}</span>
          <h3 className="font-label-md text-label-md text-on-surface mt-1 truncate max-w-[150px] sm:max-w-[200px]" title={filename}>{filename}</h3>
          <p className="text-on-surface-variant font-body-sm text-body-sm mt-1">{searchType}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-outline-variant pt-4 mt-auto">
        <div className="text-on-surface-variant font-body-sm text-body-sm">
          <span className="font-bold text-primary">{resultsCount}</span> results
        </div>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-surface-variant text-primary transition-colors border border-outline-variant hover:border-primary" title="Re-run Search">
          <span className="text-lg leading-none">⟳</span>
        </button>
      </div>
    </div>
  );
}
