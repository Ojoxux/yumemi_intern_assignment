import ResizeObserver from 'resize-observer-polyfill';
import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  window.ResizeObserver = ResizeObserver;
}
if (typeof process.env.VITE_REACT_APP_RESAS_API_KEY === 'undefined') {
  process.env.VITE_REACT_APP_RESAS_API_KEY = 'test-api-key';
}