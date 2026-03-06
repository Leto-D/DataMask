// Force-patch localStorage — Node 22+ has a broken built-in localStorage
// when --localstorage-file is not provided
const store = {};
const localStorageMock = {
  getItem: (key) => store[key] ?? null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  get length() { return Object.keys(store).length; },
  key: (i) => Object.keys(store)[i] ?? null,
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Minimal document mock for i18n.updateDOM()
if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: (tag) => ({
      tagName: tag.toUpperCase(),
      style: {},
      setAttribute: () => {},
      getAttribute: () => null,
      appendChild: () => {},
      textContent: '',
    }),
    body: { appendChild: () => {}, removeChild: () => {} },
    execCommand: () => true,
  };
}
