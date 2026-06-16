import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ title, count, imageSrc, isActive, onClick }) {
  return (
    <button 
      className={`group relative flex flex-col items-start p-4 bg-surface-container-lowest border rounded-xl transition-all duration-300 hover:border-primary hover:shadow-md ${isActive ? 'border-primary bg-surface-container-low shadow-md' : 'border-outline-variant'}`}
      onClick={onClick}
    >
      <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
        <img 
          className={`w-full h-full object-cover transition-all duration-500 ${isActive ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} 
          alt={title} 
          src={imageSrc} 
        />
      </div>
      <span className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">{title}</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">{count} Videos</span>
      
      <div className={`absolute top-6 right-6 bg-primary/10 text-primary p-1.5 rounded-full transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <ArrowRight className="w-4 h-4" />
      </div>
    </button>
  );
}
