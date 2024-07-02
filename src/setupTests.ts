import ResizeObserver from 'resize-observer-polyfill';
import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  window.ResizeObserver = ResizeObserver;
}
