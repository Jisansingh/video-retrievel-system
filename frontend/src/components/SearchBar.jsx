import { useState } from 'react';

export default function SearchBar({ onSearch }) {
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
      <button type="submit" className="bg-primary text-on-primary px-10 py-5 rounded-xl font-label-md text-lg hover:bg-primary-container transition-all cursor-pointer whitespace-nowrap font-bold shadow-md hover:shadow-lg active:scale-[0.98]">
        Search
      </button>
    </form>
  );
}
