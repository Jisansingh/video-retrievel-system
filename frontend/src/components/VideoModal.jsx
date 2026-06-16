import { useEffect } from 'react';
import { X } from 'lucide-react';
import { assetUrl } from '../lib/api';

export default function VideoModal({ video, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">{video.title}</h2>
            <span className="font-label-sm text-label-sm text-primary font-semibold uppercase tracking-wider">{video.category}</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-variant flex items-center justify-center transition-colors" onClick={onClose}>
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
        <div className="p-6">
          <video
            className="w-full rounded-xl bg-black"
            controls
            autoPlay
            src={assetUrl(video.video_url)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
