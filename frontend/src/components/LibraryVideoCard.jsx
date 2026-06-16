import { PlayCircle, Bookmark } from 'lucide-react';

export default function LibraryVideoCard({ title, imageSrc, onClick }) {
  return (
    <div className="group cursor-pointer flex flex-col w-full" onClick={onClick}>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-surface-container border border-outline-variant/30 soft-shadow">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          alt={title} 
          src={imageSrc} 
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <PlayCircle className="text-white w-14 h-14" strokeWidth={3} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-body-md font-semibold text-on-surface truncate leading-tight" title={title}>{title}</h4>
          <Bookmark className="text-outline w-5 h-5 hover:text-primary transition-colors shrink-0 mt-0.5" />
        </div>
      </div>
    </div>
  );
}
