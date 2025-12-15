// apps/web/jest.setup.ts
import '@testing-library/jest-dom';
import 'whatwg-fetch';
import 'regenerator-runtime/runtime'; // For async/await polyfill

// Polyfill TextEncoder and TextDecoder for JSDOM environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.crypto.subtle for environments where it's not available (e.g., JSDOM in older Node versions)
// This is important for components that use Web Crypto API (e.g., for PKCE)
if (typeof window.crypto === 'undefined') {
  Object.defineProperty(global.window, 'crypto', {
    value: {
      subtle: {
        digest: jest.fn(() => Promise.resolve(new ArrayBuffer(32))), // Mock SHA-256 digest
      },
    },
  });
}
