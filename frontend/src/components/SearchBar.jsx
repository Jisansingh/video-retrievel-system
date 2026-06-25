import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Film, X } from 'lucide-react';

const TOP_K_OPTIONS = [5, 10, 20, 50];
const MENU_ITEMS = [
  { id: 'frames', icon: '🖼️', label: 'Frames', desc: 'Find specific moments and scenes' },
  { id: 'videos', icon: '📹', label: 'Videos', desc: 'Search across the full video library' },
];

const CHIP_CONFIG = {
  frames: { icon: ImageIcon, label: 'Frames', bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-700', iconColor: 'text-teal-600', hoverBg: 'hover:bg-teal-500/20' },
  videos: { icon: Film, label: 'Videos', bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', iconColor: 'text-primary', hoverBg: 'hover:bg-primary/20' },
};

export default function SearchBar({ onSearch, topK, onTopKChange }) {
  const [value, setValue] = useState('');
  const [searchMode, setSearchMode] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    if (value === '/' && !searchMode) {
      setShowMenu(true);
      setActiveIdx(0);
      setValue('');
    }
  }, [value, searchMode]);

  useEffect(() => {
    if (showMenu) {
      itemRefs.current[activeIdx]?.focus();
    }
  }, [showMenu, activeIdx]);

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && e.target !== inputRef.current) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const selectMode = (mode) => {
    setSearchMode(mode);
    setShowMenu(false);
    inputRef.current?.focus();
  };

  const removeMode = () => {
    setSearchMode(null);
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSearch(trimmed, searchMode === 'frames');
    }
  };

  const handleKeyDown = (e) => {
    if (showMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((prev) => (prev + 1) % MENU_ITEMS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectMode(MENU_ITEMS[activeIdx].id);
      } else if (e.key === 'Escape') {
        setShowMenu(false);
      }
    }
  };

  const chip = searchMode ? CHIP_CONFIG[searchMode] : null;
  const ChipIcon = chip?.icon;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="relative flex-grow w-full">
        <div className="flex items-center gap-2 w-full px-8 py-5 rounded-xl border border-outline/40 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all bg-surface-container-low hover:border-outline shadow-inner">
          {chip && (
            <div className={`group relative flex items-center gap-1 px-2 py-1 rounded-lg ${chip.bg} ${chip.border} shrink-0`}>
              {ChipIcon && <ChipIcon className={`w-4 h-4 ${chip.iconColor}`} strokeWidth={2} />}
              <span className={`text-label-sm font-semibold ${chip.text}`}>{chip.label}</span>
              <button
                type="button"
                onClick={removeMode}
                className={`ml-0.5 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${chip.hoverBg}`}
              >
                <X className={`w-3 h-3 ${chip.iconColor}`} strokeWidth={3} />
              </button>
            </div>
          )}
          <input
            ref={inputRef}
            className="flex-grow bg-transparent outline-none font-body-md text-lg text-on-surface placeholder:text-outline-variant min-w-0"
            placeholder={searchMode === 'frames' ? "Describe the frame you're looking for..." : 'Describe a video...'}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {showMenu && (
          <div
            ref={menuRef}
            className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xl z-50 overflow-hidden"
          >
            {MENU_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                ref={(el) => { itemRefs.current[idx] = el; }}
                type="button"
                onClick={() => selectMode(item.id)}
                onMouseEnter={() => setActiveIdx(idx)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  idx === MENU_ITEMS.length - 1 ? '' : 'border-b border-outline-variant/20'
                } ${
                  idx === activeIdx ? 'bg-surface-container-high' : 'hover:bg-surface-container-high'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-body-md font-semibold text-on-surface">{item.label}</p>
                  <p className="text-body-sm text-on-surface-variant">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 items-stretch">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline/40 bg-surface-container-low">
          <label className="font-label-sm text-on-surface-variant whitespace-nowrap">Top Results</label>
          <select
            className="bg-transparent text-on-surface font-label-md font-semibold outline-none cursor-pointer py-1"
            value={topK}
            onChange={e => onTopKChange(Number(e.target.value))}
          >
            {TOP_K_OPTIONS.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-primary text-on-primary px-10 py-5 rounded-xl font-label-md text-lg hover:bg-primary-container transition-all cursor-pointer whitespace-nowrap font-bold shadow-md hover:shadow-lg active:scale-[0.98]">
          Search
        </button>
      </div>
    </form>
  );
}
