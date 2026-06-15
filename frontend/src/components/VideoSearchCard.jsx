export default function VideoSearchCard({ filename, dateInfo, indexBadge, matchesCount, duration, imageSrc }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:shadow-md hover:border-primary transition-colors flex flex-col justify-between h-full">
      <div className="flex gap-4 mb-4">
        <div className="relative w-28 h-16 sm:w-32 sm:h-20 bg-on-surface rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          <img alt={filename} className="w-full h-full object-cover opacity-60" src={imageSrc} />
          <span className="material-symbols-outlined text-surface absolute text-3xl">play_circle</span>
          <div className="absolute bottom-1 right-1 bg-on-surface/80 text-surface text-[10px] px-1.5 rounded font-medium">{duration}</div>
        </div>
        <div className="flex flex-col">
          <h3 className="font-label-md text-label-md text-on-surface font-semibold truncate max-w-[140px] sm:max-w-[180px]" title={filename}>{filename}</h3>
          <p className="text-on-surface-variant font-body-sm text-body-sm mt-1">{dateInfo}</p>
          <div className="mt-2">
            <span className="inline-block bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {indexBadge}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-outline-variant pt-4 mt-auto">
        <div className="text-on-surface-variant font-body-sm text-body-sm">
          <span className="font-bold text-primary">{matchesCount}</span> matches
        </div>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-surface-variant text-primary transition-colors border border-outline-variant hover:border-primary" title="Re-run Search">
          <span className="text-lg leading-none">⟳</span>
        </button>
      </div>
    </div>
  );
}
