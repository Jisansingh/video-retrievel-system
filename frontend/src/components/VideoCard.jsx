export default function VideoCard({ title, imageSrc, rank, duration, score, isBestMatch }) {
  return (
    <div className="group flex flex-col w-full">
      <div className="relative w-full rounded-xl bg-black aspect-video mb-3 overflow-hidden soft-shadow cursor-pointer border border-outline-variant/30">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
          alt={title} 
          src={imageSrc} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
        
        {isBestMatch && (
          <div className="absolute top-3 left-3 bg-primary text-on-primary px-2 py-1 rounded text-label-sm font-bold shadow-md z-10">
            Best Match
          </div>
        )}
        
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-label-sm z-10">
          {duration}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/20">
          <span className="material-symbols-outlined text-5xl text-white drop-shadow-lg">play_circle</span>
        </div>
      </div>
      
      <div className="flex justify-between items-start mb-2 gap-2">
        <p className="text-body-md font-semibold text-on-surface line-clamp-2 leading-tight" title={title}>{title}</p>
        <p className={`text-label-sm whitespace-nowrap mt-1 ${isBestMatch ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'}`}>
          Rank #{rank}
        </p>
      </div>
      
      <div className="flex items-center gap-3 mt-auto">
        <div className="flex-grow h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${score}%` }}></div>
        </div>
        <span className={`text-label-sm font-bold ${isBestMatch ? 'text-primary' : 'text-on-surface-variant'}`}>
          {score}%
        </span>
      </div>
    </div>
  );
}
