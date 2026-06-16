import { useState } from 'react';

const TOP_K_OPTIONS = [5, 10, 20, 50];

export default function SearchBar({ onSearch, topK, onTopKChange }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full">
      <input 
        className="flex-grow w-full px-8 py-5 rounded-xl border border-outline/40 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all font-body-md text-lg bg-surface-container-low text-on-surface placeholder:text-outline-variant hover:border-outline shadow-inner" 
        placeholder="Describe a video..." 
        type="text" 
        value={value}
        onChange={e => setValue(e.target.value)}
      />
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
