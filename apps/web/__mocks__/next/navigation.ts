// This mock is for `next/navigation`
import { URLSearchParams } from 'url';

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  forward: jest.fn(),
  isReady: true,
  isPreview: false,
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
}));

export const usePathname = jest.fn(() => '/');
export const useSearchParams = jest.fn(() => new URLSearchParams());
export const redirect = jest.fn();
export const useSelectedLayoutSegment = jest.fn();
export const useSelectedLayoutSegments = jest.fn();
export const useServerInsertedHTML = jest.fn();
