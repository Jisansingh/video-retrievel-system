import { PlayCircle, Check } from 'lucide-react';
import BookmarkButton from './BookmarkButton';

function getScoreConfig(scorePct) {
  if (scorePct == null) return null;
  if (scorePct > 90) {
    return { color: '#0f766e', label: 'Excellent Match', textColor: 'text-teal-700' };
  }
  if (scorePct >= 70) {
    return { color: '#22c55e', label: 'Good Match', textColor: 'text-green-500' };
  }
  if (scorePct >= 50) {
    return { color: '#f59e0b', label: 'Moderate Match', textColor: 'text-amber-500' };
  }
  return { color: '#ef4444', label: 'Low Match', textColor: 'text-red-500' };
}

const CATEGORY_EXPLANATIONS = {
  animals: [
    'Similar animal appearance',
    'Related outdoor environment',
    'Comparable movement patterns',
    'Matching subject focus',
    'Similar fur or body structure',
    'Related natural setting',
  ],
  nature: [
    'Similar landscape composition',
    'Comparable texture patterns',
    'Related environmental features',
    'Similar color palette',
    'Matching natural scenery',
    'Similar lighting conditions',
  ],
  humans: [
    'Similar human activity',
    'Related scene composition',
    'Comparable posture patterns',
    'Matching contextual elements',
    'Similar interaction dynamics',
    'Related visual focus',
  ],
  vehicles: [
    'Similar vehicle structure',
    'Comparable motion characteristics',
    'Related transportation context',
    'Similar shape features',
    'Matching visual geometry',
    'Comparable scene environment',
  ],
  indoors: [
    'Similar room layout',
    'Related interior composition',
    'Comparable lighting conditions',
    'Matching architectural features',
    'Similar object arrangement',
    'Related indoor environment',
  ],
};

const DEFAULT_EXPLANATIONS = [
  'Similar visual composition',
  'Related semantic features',
  'Comparable content patterns',
  'Matching contextual elements',
  'Shared feature space',
  'Related embedding proximity',
];

function hashSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickN(arr, seed, n) {
  const indices = arr.map((_, i) => i);
  const chosen = [];
  let s = seed;
  for (let i = 0; i < Math.min(n, arr.length); i++) {
    s = (s * 16807) % 2147483647;
    const idx = s % indices.length;
    chosen.push(arr[indices[idx]]);
    indices.splice(idx, 1);
  }
  return chosen;
}

function getExplanations(category, title) {
  const pool = CATEGORY_EXPLANATIONS[category?.toLowerCase()] || DEFAULT_EXPLANATIONS;
  const seed = hashSeed(String(title ?? ''));
  return pickN(pool, seed, 3);
}

export default function VideoCard({ title, imageSrc, score, category, onClick, isBookmarked, onToggleBookmark }) {
  const scorePct = score != null ? Math.round(score * 100) : null;
  const scoreConfig = getScoreConfig(scorePct);
  const explanations = getExplanations(category, title);

  return (
    <div className="group flex flex-col w-full cursor-pointer" onClick={onClick}>
      <div className="relative w-full rounded-xl bg-black aspect-video mb-3 overflow-hidden soft-shadow border border-outline-variant/30">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
          alt={title} 
          src={imageSrc} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
        
        {scorePct != null && scorePct >= 90 && (
          <div className="absolute top-3 left-3 bg-primary text-on-primary px-2 py-1 rounded text-label-sm font-bold shadow-md z-10">
            Best Match
          </div>
        )}

        {onToggleBookmark && (
          <div className="absolute top-3 right-3 z-20">
            <BookmarkButton
              isBookmarked={!!isBookmarked}
              onToggle={() => onToggleBookmark(title)}
            />
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/30">
          <PlayCircle className="text-white w-14 h-14" strokeWidth={3} />
        </div>
      </div>
      
      <div className="flex justify-between items-start mb-2 gap-2">
        <div className="flex flex-col min-w-0">
          <p className="text-body-md font-semibold text-on-surface line-clamp-2 leading-tight" title={title}>{title}</p>
          {category && (
            <p className="text-label-sm text-primary font-medium mt-0.5">{category}</p>
          )}
        </div>
      </div>
      
      {scorePct != null && scoreConfig && (
        <div className="space-y-1.5 mt-auto">
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

      {explanations.length > 0 && (
        <div className="mt-3 pt-3 border-t border-outline-variant/40">
          <p className="text-label-sm text-outline font-medium mb-2">Why it matched</p>
          <div className="space-y-1">
            {explanations.map((exp, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" strokeWidth={3} />
                <span className="text-body-sm text-on-surface-variant">{exp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
