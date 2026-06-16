import { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';
import LibraryVideoCard from '../components/LibraryVideoCard';
import VideoModal from '../components/VideoModal';
import { Link } from 'react-router-dom';
import { getLibrary, assetUrl } from '../lib/api';

const PAGE_SIZE = 12;

export default function Library() {
  const [activeCategory, setActiveCategory] = useState('animals');
  const [libraryData, setLibraryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    console.log('[Library] fetching /library...');
    getLibrary()
      .then(data => {
        console.log('[Library] response', data);
        setLibraryData(data);
        const keys = Object.keys(data);
        console.log('[Library] categories:', keys);
        if (keys.length > 0) setActiveCategory(keys[0]);
      })
      .catch(err => {
        console.error('[Library] FAILED:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory]);

  const categories = libraryData
    ? Object.entries(libraryData).map(([key, videos]) => ({
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1),
        count: videos.length,
        imageSrc: videos[0] ? assetUrl(videos[0].thumbnail_url) : ''
      }))
    : [];

  const allVideos = libraryData?.[activeCategory] || [];
  const visibleVideos = allVideos.slice(0, visibleCount);
  const hasMore = visibleCount < allVideos.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col w-full">
      <Navbar />
      
      <main className="pt-28 pb-12 flex-grow w-full flex flex-col max-w-screen-2xl mx-auto px-6">
        
        {/* Categories Section */}
        <section className="mb-12 w-full">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Explore Library</h2>
            <p className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl">
              Browse curated datasets across primary categories for high-precision retrieval training and archival analysis.
            </p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-on-surface-variant font-body-md">Loading library...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {categories.map(category => (
                <CategoryCard 
                  key={category.id}
                  title={category.title}
                  count={category.count}
                  imageSrc={category.imageSrc}
                  isActive={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Video Grid Section */}
        {!loading && (
          <section className="mt-8 w-full">
            <div className="mb-8 border-b border-outline-variant pb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Collection
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {visibleVideos.map((video, idx) => (
                <LibraryVideoCard 
                  key={video.title + idx}
                  title={video.title}
                  imageSrc={assetUrl(video.thumbnail_url)}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 flex items-center justify-center">
                <button
                  className="bg-surface-container-low border border-outline-variant text-primary font-label-md text-base px-8 py-3 rounded-lg hover:bg-surface-variant transition-all font-semibold shadow-sm hover:shadow active:scale-95 cursor-pointer"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-surface-container-low dark:bg-surface-dim border-t border-outline-variant dark:border-outline mt-auto">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Database className="text-primary w-6 h-6" />
              <span className="font-headline-sm text-headline-sm font-bold text-primary">Video Retrieval System</span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim hidden md:block">© 2024 Video Retrieval System.</p>
          </div>
          <div className="flex items-center gap-8">
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium" to="#">Terms</Link>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium" to="#">Privacy</Link>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium" to="#">Github</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
