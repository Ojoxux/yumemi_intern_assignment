import ResizeObserver from 'resize-observer-polyfill';
import '@testing-library/jest-dom';
process.env.VITE_REACT_APP_RESAS_API = 'test-api-key';

if (typeof window !== 'undefined') {
  window.ResizeObserver = ResizeObserver;
}
