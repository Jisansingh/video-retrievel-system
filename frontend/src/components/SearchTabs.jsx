import { useState, useRef } from 'react';
import { Image as ImageIcon, Film, Zap } from 'lucide-react';
import SearchBar from './SearchBar';

export default function SearchTabs({ onTextSearch, onImageSearch, onVideoSearch, topK, onTopKChange }) {
  const [activeTab, setActiveTab] = useState('text');
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const tabs = ['text', 'image', 'video'];
  const activeIndex = tabs.indexOf(activeTab);

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSearch(file);
      e.target.value = '';
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onVideoSearch(file);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant soft-shadow relative shadow-lg">
      <div className="flex border-b border-outline-variant relative bg-surface-container-low/50">
        <button 
          className={`flex-1 py-5 sm:py-6 font-label-md transition-colors cursor-pointer text-sm sm:text-base font-semibold ${activeTab === 'text' ? 'text-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`} 
          onClick={() => setActiveTab('text')}
        >
          Text Search
        </button>
        <button 
          className={`flex-1 py-5 sm:py-6 font-label-md transition-colors cursor-pointer text-sm sm:text-base font-semibold ${activeTab === 'image' ? 'text-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`} 
          onClick={() => setActiveTab('image')}
        >
          Image Search
        </button>
        <button 
          className={`flex-1 py-5 sm:py-6 font-label-md transition-colors cursor-pointer text-sm sm:text-base font-semibold ${activeTab === 'video' ? 'text-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`} 
          onClick={() => setActiveTab('video')}
        >
          Video Search
        </button>
        <div 
          className="active-tab-indicator w-1/3 left-0 absolute bottom-0 h-1 rounded-t-full bg-primary transition-all duration-300" 
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        ></div>
      </div>
      <div className="p-6 sm:p-10">
        {/* Text Search Panel */}
        {activeTab === 'text' && (
          <SearchBar onSearch={(query, isFrame) => onTextSearch(query, isFrame)} topK={topK} onTopKChange={onTopKChange} />
        )}
        
        {/* Image Search Panel */}
        {activeTab === 'image' && (
          <div
            className="border-2 border-dashed border-outline-variant rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-surface-container-low group"
            onClick={handleImageClick}
          >
            <ImageIcon className="text-outline group-hover:text-primary w-12 h-12 mb-4 transition-colors mx-auto" />
            <p className="font-label-md text-on-surface-variant text-lg">Drop an image here or <span className="text-primary underline font-semibold">browse</span></p>
            <p className="text-body-sm text-outline mt-2">Supports JPG, PNG up to 10MB</p>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/bmp,image/tiff"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        )}
        
        {/* Video Search Panel */}
        {activeTab === 'video' && (
          <div
            className="border-2 border-dashed border-primary bg-primary/5 rounded-xl p-12 text-center hover:bg-primary/10 transition-all cursor-pointer relative overflow-hidden group shadow-inner"
            onClick={handleVideoClick}
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
            <Film className="text-primary w-12 h-12 mb-4 mx-auto" />
            <p className="font-label-md text-primary text-lg font-semibold">Upload Video Query</p>
            <p className="text-body-sm text-on-surface-variant mt-2">Find similar clips across the entire library</p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-label-sm text-primary font-semibold">
              <Zap className="w-4 h-4" />
              Primary Retrieval Mode
            </div>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/x-msvideo,video/quicktime,video/x-matroska,video/webm"
              className="hidden"
              onChange={handleVideoChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
