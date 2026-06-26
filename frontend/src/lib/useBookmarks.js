import { useState, useCallback } from 'react';

const STORAGE_KEY = 'videoBookmarks';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function save(bookmarks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...bookmarks]));
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(load);

  const toggle = useCallback((id) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      save(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback((id) => bookmarks.has(id), [bookmarks]);

  return { bookmarks, toggle, isBookmarked };
}

export default useBookmarks;
