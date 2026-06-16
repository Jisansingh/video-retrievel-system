import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getHistory() {
  try {
    const raw = localStorage.getItem('searchHistory');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const textSearches = history.filter(h => h.type === 'text');
  const imageSearches = history.filter(h => h.type === 'image');
  const videoSearches = history.filter(h => h.type === 'video');

  const handleRerunText = (query) => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleClearAll = () => {
    localStorage.removeItem('searchHistory');
    setHistory([]);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col w-full">
      <Navbar />
      
      <main className="pt-28 pb-12 flex-grow w-full flex flex-col max-w-screen-2xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-bold">History</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Review and re-run your previous queries across all retrieval modalities.
            </p>
          </div>
          {history.length > 0 && (
            <button
              className="text-label-sm text-on-surface-variant hover:text-error transition-colors font-semibold px-3 py-1.5 rounded-lg border border-outline-variant hover:border-error/50"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-body-lg text-body-lg text-on-surface-variant">No search history yet.</p>
            <p className="font-body-sm text-body-sm text-outline mt-2">Your searches will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12 w-full">
            
            {/* Text Searches Section */}
            {textSearches.length > 0 && (
              <section>
                <div className="mb-6 border-b border-outline-variant pb-4">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Text Searches</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {textSearches.map((entry, idx) => (
                    <div key={idx} className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:shadow-md hover:border-primary transition-colors flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-primary font-label-sm text-label-sm uppercase tracking-wider">Text Query</span>
                          <span className="font-body-sm text-body-sm text-outline">{formatDate(entry.timestamp)}</span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface mb-6 italic">"{entry.query}"</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-outline-variant pt-4 mt-auto">
                        <div className="text-on-surface-variant font-body-sm text-body-sm">Text search</div>
                        <button
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-surface-variant text-primary transition-colors border border-outline-variant hover:border-primary"
                          title="Re-run Search"
                          onClick={() => handleRerunText(entry.query)}
                        >
                          <span className="text-lg leading-none">⟳</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Image Searches Section */}
            {imageSearches.length > 0 && (
              <section>
                <div className="mb-6 border-b border-outline-variant pb-4">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Image Searches</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {imageSearches.map((entry, idx) => (
                    <div key={idx} className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:shadow-md hover:border-primary transition-colors flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-primary font-label-sm text-label-sm uppercase tracking-wider">Image Query</span>
                          <span className="font-body-sm text-body-sm text-outline">{formatDate(entry.timestamp)}</span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface">{entry.fileName}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-outline-variant pt-4 mt-auto">
                        <div className="text-on-surface-variant font-body-sm text-body-sm">Image search</div>
                        <button
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-surface-variant text-primary transition-colors border border-outline-variant hover:border-primary"
                          title="Go to Search"
                          onClick={() => navigate('/search')}
                        >
                          <span className="text-lg leading-none">⟳</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Video Searches Section */}
            {videoSearches.length > 0 && (
              <section>
                <div className="mb-6 border-b border-outline-variant pb-4">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Video Searches</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videoSearches.map((entry, idx) => (
                    <div key={idx} className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:shadow-md hover:border-primary transition-colors flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-primary font-label-sm text-label-sm uppercase tracking-wider">Video Query</span>
                          <span className="font-body-sm text-body-sm text-outline">{formatDate(entry.timestamp)}</span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface">{entry.fileName}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-outline-variant pt-4 mt-auto">
                        <div className="text-on-surface-variant font-body-sm text-body-sm">Video search</div>
                        <button
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-surface-variant text-primary transition-colors border border-outline-variant hover:border-primary"
                          title="Go to Search"
                          onClick={() => navigate('/search')}
                        >
                          <span className="text-lg leading-none">⟳</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-surface-container-low dark:bg-surface-dim border-t border-outline-variant dark:border-outline mt-auto">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">Video Retrieval System</span>
            <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim hidden md:block">© 2026 Video Retrieval System.</p>
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
