import { PlayCircle, Clock, Download } from 'lucide-react';
import { assetUrl } from '../lib/api';

function getScoreConfig(scorePct) {
  if (scorePct == null) return null;
  if (scorePct > 90) return { color: '#0f766e', label: 'Excellent Match', textColor: 'text-teal-700' };
  if (scorePct >= 70) return { color: '#22c55e', label: 'Good Match', textColor: 'text-green-500' };
  if (scorePct >= 50) return { color: '#f59e0b', label: 'Moderate Match', textColor: 'text-amber-500' };
  return { color: '#ef4444', label: 'Low Match', textColor: 'text-red-500' };
}

function formatTimestamp(t) {
  if (t == null) return '00:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

async function handleDownload(frameUrl, e) {
  e.stopPropagation();
  try {
    const response = await fetch(assetUrl(frameUrl));
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = frameUrl.split('/').pop() || 'frame.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download failed:', err);
  }
}

export default function FrameCard({ frameUrl, video, videoTitle, timestamp, category, score, onClick }) {
  const scorePct = score != null ? Math.round(score * 100) : null;
  const scoreConfig = getScoreConfig(scorePct);

  return (
    <div className="group flex flex-col w-full cursor-pointer" onClick={onClick}>
      <div className="relative w-full rounded-xl bg-black aspect-video mb-3 overflow-hidden soft-shadow border border-outline-variant/30">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={video}
          src={assetUrl(frameUrl)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

        {scorePct != null && scorePct >= 90 && (
          <div className="absolute top-3 left-3 bg-primary text-on-primary px-2 py-1 rounded text-label-sm font-bold shadow-md z-10">
            Best Match
          </div>
        )}

        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-label-sm font-semibold shadow-md flex items-center gap-1.5 z-10">
          <Clock className="w-3.5 h-3.5" />
          {formatTimestamp(timestamp)}
        </div>

        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2 py-0.5 rounded-full text-label-sm font-bold uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 shadow-sm">
            {category}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/30">
          <PlayCircle className="text-white w-14 h-14" strokeWidth={3} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-body-sm text-on-surface-variant line-clamp-1">
            Source: <span className="font-medium text-on-surface">{videoTitle || video}</span>
          </p>
        </div>
        <button
          onClick={(e) => handleDownload(frameUrl, e)}
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-label-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all border border-transparent hover:border-primary/20"
          title="Download Frame"
        >
          <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>

      {scorePct != null && scoreConfig && (
        <div className="space-y-1.5">
          <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${scorePct}%`, backgroundColor: scoreConfig.color }}
            ></div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: scoreConfig.color }}></span>
            <span className={`text-label-sm font-bold ${scoreConfig.textColor}`}>{scorePct}%</span>
            <span className="text-label-sm text-outline">{scoreConfig.label}</span>
          </div>
        </div>
      )}
    </div>
  );
}
