import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import Navbar from '../components/Navbar';
import SearchTabs from '../components/SearchTabs';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import { Link } from 'react-router-dom';
import { textSearch, imageSearch, videoSearch, frameSearch, assetUrl } from '../lib/api';
import FrameCard from '../components/FrameCard';

function saveToHistory(entry) {
  try {
    const raw = localStorage.getItem('searchHistory');
    const history = raw ? JSON.parse(raw) : [];
    history.unshift({ ...entry, timestamp: Date.now() });
    if (history.length > 50) history.length = 50;
    localStorage.setItem('searchHistory', JSON.stringify(history));
  } catch {}
}

function getErrorMessage(err) {
  if (err.response) {
    const detail = err.response.data?.detail;
    if (detail) return detail;
    return `Server error (${err.response.status})`;
  }
  if (err.request) {
    return 'Unable to reach the server. Check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
}

export default function Home() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [matchedFrameUrl, setMatchedFrameUrl] = useState(null);
  const [searchParams] = useSearchParams();
  const [topK, setTopK] = useState(5);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTextSearch = async (q, isFrame) => {
    setLoading(true);
    setError(null);
    setQuery(q);
    setHasSearched(true);
    setSearchType(isFrame ? 'frames' : 'text');

    try {
      if (isFrame) {
        const data = await frameSearch(q, topK);
        setResults(data.results || []);
        saveToHistory({ type: 'frames', query: q });
      } else {
        const data = await textSearch(q, topK);
        setResults(data.results || []);
        saveToHistory({ type: 'text', query: q });
      }
    } catch (err) {
      setResults([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleImageSearch = async (file) => {
    setLoading(true);
    setError(null);
    setSearchType('image');
    setQuery(file.name);
    setHasSearched(true);
    try {
      const data = await imageSearch(file, topK);
      setResults(data.results || []);
      saveToHistory({ type: 'image', fileName: file.name });
    } catch (err) {
      setResults([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSearch = async (file) => {
    setLoading(true);
    setError(null);
    setSearchType('video');
    setQuery(file.name);
    setHasSearched(true);
    try {
      const data = await videoSearch(file, topK);
      setResults(data.results || []);
      saveToHistory({ type: 'video', fileName: file.name });
    } catch (err) {
      setResults([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('query');
    if (q) handleTextSearch(q);
  }, []);

  const showResults = hasSearched || loading || results.length > 0;

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col w-full">
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
            topK={topK}
            onTopKChange={setTopK}
          />
        </section>

        {/* Results Section */}
        {showResults && (
          <section className="w-full max-w-screen-2xl mx-auto px-6 mb-12">
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-on-surface-variant font-body-md">Searching...</p>
                </div>
              </div>
            )}

            {!loading && hasSearched && results.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="font-body-lg text-body-lg text-on-surface-variant">No results found</p>
                <p className="font-body-sm text-body-sm text-outline mt-2">Try a different query or adjust the top-k value.</p>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="font-body-lg text-body-lg text-red-500 font-semibold">Search failed</p>
                <p className="font-body-sm text-body-sm text-outline mt-2">{error}</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 lg:w-3/4 min-w-0">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h2 className="font-headline-md text-headline-md font-bold">Retrieval Results</h2>
                    <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                      <div className="px-4 border-r border-outline-variant">
                        <p className="text-label-sm text-outline-variant uppercase tracking-wider mb-1">Search Type</p>
                        <p className="text-label-md text-on-surface font-semibold capitalize">{searchType === 'frames' ? 'Frame Search' : searchType === 'text' ? 'Video Search' : searchType}</p>
                      </div>
                      <div className="px-4">
                        <p className="text-label-sm text-outline-variant uppercase tracking-wider mb-1">Results</p>
                        <p className="text-label-md text-on-surface font-semibold">{results.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                    {results.map((item, idx) =>
                      searchType === 'frames' ? (
                        <FrameCard
                          key={idx}
                          frameUrl={item.frame_url}
                          video={item.video}
                          videoTitle={`${item.video.split('/').pop()}.mp4`}
                          timestamp={item.timestamp}
                          category={item.category}
                          score={item.score}
                          onClick={() => { setSelectedVideo({ ...item, title: `${item.video.split('/').pop()}.mp4`, thumbnail_url: item.frame_url }); setMatchedFrameUrl(item.frame_url); setSelectedIndex(idx); }}
                        />
                      ) : (
                        <VideoCard
                          key={idx}
                          title={item.title}
                          imageSrc={assetUrl(item.thumbnail_url)}
                          score={item.score}
                          category={item.category}
                          onClick={() => { setSelectedVideo(item); setSelectedIndex(idx); }}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="lg:w-1/4 flex flex-col gap-6">
                  <div className="bg-surface-container-low rounded-xl p-5 soft-shadow border border-outline-variant/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
                      <h3 className="font-headline-sm text-headline-sm font-semibold">How Matching Works</h3>
                    </div>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed mb-3">
                      VidShazam uses CLIP embeddings to transform text, images, and videos into a shared semantic vector space. FAISS performs nearest-neighbor retrieval on 512-dimensional embeddings to identify the most relevant video matches. Similarity scores represent semantic closeness rather than exact visual duplication.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm border border-outline-variant font-medium">CLIP</span>
                      <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm border border-outline-variant font-medium">FAISS</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-5 soft-shadow border border-outline-variant/30">
                    <h3 className="font-headline-sm text-headline-sm font-semibold mb-4">Match Score Guide</h3>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-700 shrink-0"></div>
                        <span className="text-body-sm font-medium text-on-surface">90–100%</span>
                      </div>
                      <span className="text-body-sm text-on-surface-variant">Excellent Match</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></div>
                        <span className="text-body-sm font-medium text-on-surface">70–89%</span>
                      </div>
                      <span className="text-body-sm text-on-surface-variant">Good Match</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></div>
                        <span className="text-body-sm font-medium text-on-surface">50–69%</span>
                      </div>
                      <span className="text-body-sm text-on-surface-variant">Moderate Match</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></div>
                        <span className="text-body-sm font-medium text-on-surface">0–49%</span>
                      </div>
                      <span className="text-body-sm text-on-surface-variant">Low Match</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <VideoModal
        video={selectedVideo}
        frameUrl={matchedFrameUrl}
        onClose={() => { setSelectedVideo(null); setSelectedIndex(-1); setMatchedFrameUrl(null); }}
        results={results}
        currentIndex={selectedIndex}
        searchType={searchType}
        initialTimestamp={selectedVideo?.timestamp}
        onNavigate={(idx) => {
          const item = results[idx];
          if (searchType === 'frames') {
            setSelectedVideo({ ...item, title: `${item.video.split('/').pop()}.mp4`, thumbnail_url: item.frame_url });
            setMatchedFrameUrl(item.frame_url);
          } else {
            setSelectedVideo(item);
          }
          setSelectedIndex(idx);
        }}
      />

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
