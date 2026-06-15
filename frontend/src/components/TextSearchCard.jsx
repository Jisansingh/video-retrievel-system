export default function TextSearchCard({ queryType, date, query, resultsCount }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:shadow-md hover:border-primary transition-colors flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-primary font-label-sm text-label-sm uppercase tracking-wider">{queryType}</span>
          <span className="font-body-sm text-body-sm text-outline">{date}</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface mb-6 italic">"{query}"</p>
      </div>
      <div className="flex items-center justify-between border-t border-outline-variant pt-4 mt-auto">
        <div className="text-on-surface-variant font-body-sm text-body-sm">
          <span className="font-bold text-primary">{resultsCount}</span> results
        </div>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-surface-variant text-primary transition-colors border border-outline-variant hover:border-primary" title="Re-run Search">
          <span className="text-lg leading-none">⟳</span>
        </button>
      </div>
    </div>
  );
}
