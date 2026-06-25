import { useEffect, useRef, useState } from 'react';
import {
  X, Play, Pause, Volume2, Volume1, VolumeX, Maximize,
  ChevronLeft, ChevronRight, Clock, Film, MoreVertical, Download
} from 'lucide-react';
import { assetUrl, API_URL } from '../lib/api';

function formatTime(t) {
  if (!t || isNaN(t)) return '00:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getScoreConfig(scorePct) {
  if (scorePct == null) return null;
  if (scorePct > 90) return { color: '#0f766e', label: 'Excellent Match' };
  if (scorePct >= 70) return { color: '#22c55e', label: 'Good Match' };
  if (scorePct >= 50) return { color: '#f59e0b', label: 'Moderate Match' };
  return { color: '#ef4444', label: 'Low Match' };
}

function getFrameThumbs(video) {
  if (!video?.video) return [];
  return Array.from({ length: 8 }, (_, i) =>
    `/frames/${video.video}/frame_${String(i).padStart(5, '0')}.jpg`
  );
}

function extractRelativeFramePath(frameUrl) {
  if (!frameUrl) return '';
  return frameUrl.replace(/^\/frames\//, '');
}

function isValidValue(val) {
  if (val === null || val === undefined) return false;
  const str = String(val).trim().toLowerCase();
  return str !== '' && str !== 'n/a' && str !== 'unknown' && str !== '-';
}

const Skip10BackIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <text x="12.5" y="15" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold" fill="currentColor" textAnchor="middle">10</text>
  </svg>
);

const Skip10ForwardIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <text x="11.5" y="15" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold" fill="currentColor" textAnchor="middle">10</text>
  </svg>
);

export default function VideoModal({ video, frameUrl, onClose, results = [], currentIndex = -1, onNavigate, searchType, initialTimestamp }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const matchedThumbRef = useRef(null);
  const filmstripRef = useRef(null);

  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(1);
  const [muted, setMuted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [hasSeeked, setHasSeeked] = useState(false);

  const isFrameSearch = searchType === 'frames';
  const url = assetUrl(video?.video_url);
  const pct = video?.score != null ? Math.round(video.score * 100) : null;
  const cfg = getScoreConfig(pct);
  const frames = getFrameThumbs(video);
  const total = results.length;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < total - 1;
  const hlFrame = dur > 0 ? Math.min(frames.length - 1, Math.floor((time / dur) * frames.length)) : 0;
  const matchedFrameIdx = (initialTimestamp != null && dur > 0)
    ? Math.min(frames.length - 1, Math.floor((initialTimestamp / dur) * frames.length))
    : -1;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setTime(el.currentTime);
    const onMeta = () => setDur(el.duration);
    const onVol = () => { setVol(el.volume); setMuted(el.muted); };
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('volumechange', onVol);
    return () => {
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('volumechange', onVol);
    };
  }, [video]);

  useEffect(() => {
    const el = videoRef.current;
    if (el) {
      el.playbackRate = speed;
    }
  }, [video, speed]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || initialTimestamp == null) return;

    setHasSeeked(false);

    const seekAndPause = () => {
      const t = Math.min(initialTimestamp, el.duration || 0);
      el.currentTime = t;
      if (isFrameSearch) {
        el.pause();
        setPlaying(false);
      } else {
        el.play().catch(() => {});
        setPlaying(true);
      }
      setHasSeeked(true);
      el.removeEventListener('loadedmetadata', seekAndPause);
    };

    if (el.readyState >= 1) {
      seekAndPause();
    } else {
      el.addEventListener('loadedmetadata', seekAndPause);
    }
  }, [video, initialTimestamp, isFrameSearch]);

  useEffect(() => {
    if (matchedFrameIdx >= 0 && matchedThumbRef.current && filmstripRef.current) {
      matchedThumbRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [matchedFrameIdx, video]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate?.(currentIndex - 1);
      if (e.key === 'ArrowRight' && hasNext) onNavigate?.(currentIndex + 1);
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, hasPrev, hasNext, currentIndex, onNavigate]);

  useEffect(() => {
    const clickOutside = (e) => {
      if (menuOpen &&
          menuRef.current && !menuRef.current.contains(e.target) &&
          menuButtonRef.current && !menuButtonRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, [menuOpen]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.paused ? el.play() : el.pause();
  };

  const skip = (sec) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(el.currentTime + sec, el.duration || 0));
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
  };

  const changeVol = (e) => {
    const el = videoRef.current;
    if (!el) return;
    const v = parseFloat(e.target.value);
    el.volume = v;
    if (v === 0) el.muted = true;
    else if (muted) el.muted = false;
  };

  const toggleFs = async () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await el.requestFullscreen();
    }
  };

  const seekFrame = (idx) => {
    const el = videoRef.current;
    if (!el || !dur) return;
    el.currentTime = (idx / frames.length) * dur;
  };

  const changeSpeed = (s) => {
    const el = videoRef.current;
    if (!el) return;
    el.playbackRate = s;
    setSpeed(s);
    setMenuOpen(false);
  };

  const togglePip = async () => {
    try {
      const el = videoRef.current;
      if (!el) return;
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await el.requestPictureInPicture();
      }
      setMenuOpen(false);
    } catch (err) {
      console.error('Picture-in-Picture error:', err);
    }
  };

  const handleDownloadVideo = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = video?.title || 'video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMenuOpen(false);
  };

  const handleDownloadFrame = () => {
    const frameUrlToDownload = frameUrl || video?.frame_url;
    if (!frameUrlToDownload) return;

    const relativePath = extractRelativeFramePath(frameUrlToDownload);
    const downloadUrl = `${API_URL}/download/frame?path=${encodeURIComponent(relativePath)}`;
    console.log("Matched frame:", frameUrlToDownload);
    console.log("Downloading:", downloadUrl);

    const link = document.createElement("a");
    link.href = downloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBgClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!video) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs" onClick={handleBgClick}>
      <div className="bg-surface-container-lowest rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl border border-outline-variant/30" onClick={e => e.stopPropagation()}>

        {/* Header Bar */}
        <div className="flex items-center gap-4 px-6 py-4 shrink-0 relative border-b border-outline-variant/20 bg-surface-container-lowest">
          <img className="w-12 h-12 rounded-lg object-cover shrink-0 border border-outline-variant/50 shadow-sm" src={assetUrl(video.thumbnail_url)} alt="" />
          <div className="flex-1 min-w-0 pr-8">
            <h3 className="text-base md:text-lg font-bold text-on-surface truncate leading-tight" title={video.title}>
              {video.title}
            </h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs md:text-sm text-on-surface-variant font-medium">
              {video.category && isValidValue(video.category) && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-teal-400">
                  {video.category}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-on-surface-variant/80">
                <Clock className="w-4 h-4 text-on-surface-variant/60" />
                {formatTime(dur || video.duration || 0)}
              </span>
            </div>
          </div>

          {/* Download Frame (only for frame search results) */}
          {isFrameSearch && (frameUrl || video?.frame_url) && (
            <button
              onClick={handleDownloadFrame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-sm font-semibold text-teal-700 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 transition-all shrink-0"
              title="Download matched frame"
            >
              <Download className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Download Frame</span>
            </button>
          )}

          <button
            className="w-8 h-8 rounded-full text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors focus:outline-none shrink-0"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Player Box */}
        <div className="flex flex-col bg-zinc-950 overflow-hidden relative shadow-inner">
          <div
            className="relative w-full aspect-video bg-black flex items-center justify-center group overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-contain cursor-pointer"
              src={url}
              autoPlay
              playsInline
              onClick={togglePlay}
            />

            {/* Center Floating Navigation Overlays */}
            {hasPrev && (
              <button
                onClick={() => onNavigate?.(currentIndex - 1)}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-2xl bg-black/70 hover:bg-black/90 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105 border border-white/10 active:scale-95 shadow-lg opacity-0 group-hover:opacity-100 duration-200"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={() => onNavigate?.(currentIndex + 1)}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-2xl bg-black/70 hover:bg-black/90 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105 border border-white/10 active:scale-95 shadow-lg opacity-0 group-hover:opacity-100 duration-200"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}

            {/* Custom Media Controls Overlay */}
            <div
              className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent px-5 pb-5 pt-16 z-20 flex flex-col gap-3 transition-opacity duration-300 ${
                (!playing || hovered) ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Time indicator */}
              <div className="text-white/90 text-xs font-semibold select-none">
                {formatTime(time)} / {formatTime(dur)}
              </div>

              {/* Controls Bar */}
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-teal-400 transition-colors focus:outline-none shrink-0"
                  title={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                </button>

                {/* Skip 10s Back */}
                <button
                  onClick={() => skip(-10)}
                  className="text-white hover:text-teal-400 transition-colors focus:outline-none shrink-0"
                  title="Seek backward 10s"
                >
                  <Skip10BackIcon />
                </button>

                {/* Skip 10s Forward */}
                <button
                  onClick={() => skip(10)}
                  className="text-white hover:text-teal-400 transition-colors focus:outline-none shrink-0"
                  title="Seek forward 10s"
                >
                  <Skip10ForwardIcon />
                </button>

                {/* Custom Seek Slider */}
                <input
                  type="range"
                  min={0}
                  max={dur || 100}
                  step={0.01}
                  value={time}
                  onChange={(e) => {
                    const el = videoRef.current;
                    if (el) el.currentTime = parseFloat(e.target.value);
                  }}
                  className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400 focus:outline-none transition-all"
                  style={{
                    background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${(dur ? (time / dur) : 0) * 100}%, rgba(255,255,255,0.2) ${(dur ? (time / dur) : 0) * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />

                {/* Right Group: Mute, Vol Slider, Fullscreen, Menu */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-teal-400 transition-colors focus:outline-none"
                    title={muted ? 'Unmute' : 'Mute'}
                  >
                    {muted || vol === 0 ? <VolumeX className="w-5 h-5" /> : vol < 0.5 ? <Volume1 className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={muted ? 0 : vol}
                    onChange={changeVol}
                    className="w-16 md:w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400 focus:outline-none transition-all"
                    style={{
                      background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${(muted ? 0 : vol) * 100}%, rgba(255,255,255,0.2) ${(muted ? 0 : vol) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />

                  <button
                    onClick={toggleFs}
                    className="text-white hover:text-teal-400 transition-colors focus:outline-none"
                    title="Fullscreen"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>

                  {/* Menu Options Button and Dropdown Container */}
                  <div className="relative">
                    <button
                      ref={menuButtonRef}
                      onClick={() => setMenuOpen(!menuOpen)}
                      className={`text-white hover:text-teal-400 transition-colors focus:outline-none cursor-pointer ${menuOpen ? 'text-teal-400' : ''}`}
                      title="More options"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      ref={menuRef}
                      className={`absolute bottom-8 right-0 bg-zinc-900 border border-zinc-800 text-white rounded-xl shadow-2xl p-2 w-56 flex flex-col gap-1 transition-all duration-200 origin-bottom-right z-35 ${
                        menuOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2 pointer-events-none'
                      }`}
                    >
                      <div className="px-2 py-1 text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider select-none text-left">
                        Playback Speed
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => changeSpeed(s)}
                            className={`px-1 py-1 rounded text-center text-xs font-semibold transition-colors cursor-pointer ${
                              speed === s
                                ? 'bg-teal-600 text-white font-bold shadow-sm'
                                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>

                      <div className="h-px bg-zinc-800 my-1" />

                      {/* Picture in Picture */}
                      {typeof document !== 'undefined' && document.pictureInPictureEnabled && (
                        <button
                          onClick={togglePip}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-zinc-300 hover:bg-teal-500/10 hover:text-teal-400 transition-colors w-full cursor-pointer"
                        >
                          <span className="w-4 h-4 flex items-center justify-center shrink-0 text-sm">📺</span>
                          <span>Picture-in-Picture</span>
                        </button>
                      )}

                      {/* Download Video */}
                      <button
                        onClick={handleDownloadVideo}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-zinc-300 hover:bg-teal-500/10 hover:text-teal-400 transition-colors w-full cursor-pointer"
                      >
                        <span className="w-4 h-4 flex items-center justify-center shrink-0 text-sm">📥</span>
                        <span>Download Video</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail Filmstrip */}
          {frames.length > 0 && (
            <div ref={filmstripRef} className="px-6 py-5 bg-zinc-900 border-t border-zinc-800 flex gap-4 overflow-x-auto scrollbar-none select-none">
              {frames.map((src, i) => {
                const isMatched = i === matchedFrameIdx;
                const isCurrent = i === hlFrame;
                return (
                  <button
                    key={i}
                    ref={isMatched ? matchedThumbRef : null}
                    onClick={() => seekFrame(i)}
                    className={`relative shrink-0 w-32 aspect-video rounded-lg overflow-hidden border-4 transition-all duration-200 cursor-pointer ${
                      isMatched
                        ? 'border-teal-400 scale-105 opacity-100 shadow-lg shadow-teal-400/30 ring-2 ring-teal-400/50'
                        : isCurrent
                          ? 'border-teal-500 scale-102 opacity-100 shadow-lg shadow-teal-500/20'
                          : 'border-transparent opacity-50 hover:opacity-100 hover:scale-102 hover:border-teal-500/40'
                    }`}
                  >
                    <img className="w-full h-full object-cover" src={assetUrl(src)} alt="" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
