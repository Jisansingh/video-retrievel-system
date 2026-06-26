import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;

const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use(config => {
  console.log('[API] Request:', config.method.toUpperCase(), config.baseURL + config.url, config.params || '');
  return config;
});

client.interceptors.response.use(
  res => {
    console.log('[API] Response OK:', res.config.url, 'status:', res.status);
    return res;
  },
  err => {
    console.error('[API] Response FAILED:', err.config?.url, err.message);
    if (err.response) {
      console.error('[API] status:', err.response.status, 'body:', err.response.data);
    } else if (err.request) {
      console.error('[API] No response received. Check CORS or backend connectivity.');
    }
    return Promise.reject(err);
  }
);

export function getLibrary() {
  return client.get('/library').then(res => res.data);
}

export function textSearch(query, topK = 5) {
  return client.get('/search', { params: { query, top_k: topK } }).then(res => res.data);
}

export function frameSearch(query, topK = 12) {
  return client.get('/search/frames', { params: { query, top_k: topK } }).then(res => res.data);
}

export function imageSearch(file, topK = 5) {
  const form = new FormData();
  form.append('image', file);
  return client.post('/search', form, { params: { top_k: topK } }).then(res => res.data);
}

export function videoSearch(file, topK = 5) {
  const form = new FormData();
  form.append('video', file);
  return client.post('/search/video', form, { params: { top_k: topK } }).then(res => res.data);
}

export function assetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}

export default client;
