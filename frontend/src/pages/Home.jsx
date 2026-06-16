import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchTabs from '../components/SearchTabs';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import { Link } from 'react-router-dom';
import { textSearch, imageSearch, videoSearch, assetUrl } from '../lib/api';

function saveToHistory(entry) {
  try {
    const raw = localStorage.getItem('searchHistory');
    const history = raw ? JSON.parse(raw) : [];
    history.unshift({ ...entry, timestamp: Date.now() });
    if (history.length > 50) history.length = 50;
    localStorage.setItem('searchHistory', JSON.stringify(history));
  } catch {}
}

export default function Home() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchParams] = useSearchParams();

  const handleTextSearch = async (q) => {
    setLoading(true);
    setSearchType('text');
    setQuery(q);
    try {
      console.log('[Search] text search query:', q);
      const data = await textSearch(q, 5);
      console.log('[Search] response', data);
      setResults(data.results || []);
      saveToHistory({ type: 'text', query: q });
    } catch (err) {
      console.error('[Search] FAILED:', err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSearch = async (file) => {
    setLoading(true);
    setSearchType('image');
    setQuery(file.name);
    try {
      console.log('[Search] image search file:', file.name);
      const data = await imageSearch(file, 5);
      console.log('[Search] response', data);
      setResults(data.results || []);
      saveToHistory({ type: 'image', fileName: file.name });
    } catch (err) {
      console.error('[Search] FAILED:', err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSearch = async (file) => {
    setLoading(true);
    setSearchType('video');
    setQuery(file.name);
    try {
      console.log('[Search] video search file:', file.name);
      const data = await videoSearch(file, 5);
      console.log('[Search] response', data);
      setResults(data.results || []);
      saveToHistory({ type: 'video', fileName: file.name });
    } catch (err) {
      console.error('[Search] FAILED:', err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('query');
    if (q) handleTextSearch(q);
  }, []);

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col w-full overflow-x-hidden">
      <Navbar />
      
      <main className="pt-24 pb-12 flex-grow w-full flex flex-col">
        {/* Hero Section */}
        <section className="w-full max-w-5xl mx-auto px-6 mb-12 text-center">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-4">Multimodal Video Retrieval</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
            Harnessing state-of-the-art vision-language models to find specific moments across massive video archives with surgical precision.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-label-sm border border-outline-variant font-medium">CLIP ViT-B/32</span>
            <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-label-sm border border-outline-variant font-medium">FAISS</span>
            <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-label-sm border border-outline-variant font-medium">FastAPI</span>
            <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-label-sm border border-outline-variant font-medium">Multimodal Search</span>
          </div>
        </section>

        {/* Search Section */}
        <section className="w-full max-w-5xl mx-auto px-6 mb-16">
          <SearchTabs
            onTextSearch={handleTextSearch}
            onImageSearch={handleImageSearch}
            onVideoSearch={handleVideoSearch}
          />
        </section>

        {/* Results Section */}
        {(results.length > 0 || loading) && (
          <section className="w-full max-w-screen-2xl mx-auto px-6 mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h2 className="font-headline-md text-headline-md font-bold">Retrieval Results</h2>
              <div className="flex flex-wrap gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                <div className="px-4 border-r border-outline-variant">
                  <p className="text-label-sm text-outline-variant uppercase tracking-wider mb-1">Search Type</p>
                  <p className="text-label-md text-on-surface font-semibold capitalize">{searchType}</p>
                </div>
                <div className="px-4 border-r border-outline-variant">
                  <p className="text-label-sm text-outline-variant uppercase tracking-wider mb-1">Query</p>
                  <p className="text-label-md text-on-surface font-semibold max-w-[200px] truncate">{query}</p>
                </div>
                <div className="px-4">
                  <p className="text-label-sm text-outline-variant uppercase tracking-wider mb-1">Results</p>
                  <p className="text-label-md text-on-surface font-semibold">{results.length}</p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-on-surface-variant font-body-md">Searching...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
                {results.map((video, idx) => (
                  <VideoCard
                    key={idx}
                    title={video.title}
                    imageSrc={assetUrl(video.thumbnail_url)}
                    score={video.score}
                    category={video.category}
                    onClick={() => setSelectedVideo(video)}
                  />
                ))}
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
            <span className="font-headline-sm text-headline-sm font-bold text-primary">Video Retrieval System</span>
            <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim">© 2024 Video Retrieval System.</p>
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
