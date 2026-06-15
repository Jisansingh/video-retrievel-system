export default function LibraryVideoCard({ title, imageSrc, duration, clipInfo }) {
  return (
    <div className="group cursor-pointer flex flex-col w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-surface-container border border-outline-variant/30 soft-shadow">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          alt={title} 
          src={imageSrc} 
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="material-symbols-outlined text-white text-5xl drop-shadow-lg" style={{ fontVariationSettings: '"FILL" 1' }}>play_circle</span>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white font-label-sm text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm z-20">
          {duration}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-body-md font-semibold text-on-surface truncate leading-tight" title={title}>{title}</h4>
          <span className="material-symbols-outlined text-outline text-lg hover:text-primary transition-colors">bookmark</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">{clipInfo}</p>
      </div>
    </div>
  );
}
