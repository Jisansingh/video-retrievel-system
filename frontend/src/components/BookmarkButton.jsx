import { useState } from 'react';
import { Bookmark } from 'lucide-react';

export default function BookmarkButton({ isBookmarked, onToggle, className = '' }) {
  const [animating, setAnimating] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center transition-transform duration-150 ${animating ? 'scale-110' : 'scale-100'} ${className}`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Bookmark
        className={`transition-all duration-150 ${isBookmarked ? 'text-teal-600' : 'text-outline hover:text-primary'}`}
        fill={isBookmarked ? '#0d9488' : 'none'}
        strokeWidth={2}
        size={20}
      />
    </button>
  );
}
