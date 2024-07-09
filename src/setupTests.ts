import '@testing-library/jest-dom';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

if (typeof process.env.VITE_REACT_APP_RESAS_API_KEY === 'undefined') {
  process.env.VITE_REACT_APP_RESAS_API_KEY = 'test-api-key';
}