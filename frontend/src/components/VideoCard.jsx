import { PlayCircle } from 'lucide-react';

export default function VideoCard({ title, imageSrc, score, category, onClick }) {
  const scorePct = score != null ? Math.round(score * 100) : null;

  return (
    <div className="group flex flex-col w-full cursor-pointer" onClick={onClick}>
      <div className="relative w-full rounded-xl bg-black aspect-video mb-3 overflow-hidden soft-shadow border border-outline-variant/30">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
          alt={title} 
          src={imageSrc} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
        
        {scorePct != null && scorePct >= 90 && (
          <div className="absolute top-3 left-3 bg-primary text-on-primary px-2 py-1 rounded text-label-sm font-bold shadow-md z-10">
            Best Match
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/30">
          <PlayCircle className="text-white w-14 h-14" strokeWidth={3} />
        </div>
      </div>
      
      <div className="flex justify-between items-start mb-2 gap-2">
        <div className="flex flex-col min-w-0">
          <p className="text-body-md font-semibold text-on-surface line-clamp-2 leading-tight" title={title}>{title}</p>
          {category && (
            <p className="text-label-sm text-primary font-medium mt-0.5">{category}</p>
          )}
        </div>
      </div>
      
      {scorePct != null && (
        <div className="flex items-center gap-3 mt-auto">
          <div className="flex-grow h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${scorePct}%` }}></div>
          </div>
          <span className={`text-label-sm font-bold ${scorePct >= 90 ? 'text-primary' : 'text-on-surface-variant'}`}>
            {scorePct}%
          </span>
        </div>
      )}
    </div>
  );
}
