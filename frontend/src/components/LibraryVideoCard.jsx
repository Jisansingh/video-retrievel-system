import { PlayCircle } from 'lucide-react';
import BookmarkButton from './BookmarkButton';

export default function LibraryVideoCard({ title, imageSrc, onClick, isBookmarked, onToggleBookmark }) {
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
        {onToggleBookmark && (
          <div className="absolute top-3 right-3 z-20">
            <BookmarkButton
              isBookmarked={!!isBookmarked}
              onToggle={() => onToggleBookmark(title)}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-body-md font-semibold text-on-surface truncate leading-tight" title={title}>{title}</h4>
        </div>
      </div>
    </div>
  );
}
