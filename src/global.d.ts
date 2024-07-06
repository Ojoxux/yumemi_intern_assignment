import 'resize-observer-polyfill';
import 'testing-library/jest-dom';

declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}
