import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend vitest's expect with jest-dom matchers
expect.extend(matchers);

// Add type declarations for jest-dom matchers
declare module 'vitest' {
    interface Assertion<T = any> extends jest.Matchers<void, T> { }
    interface AsymmetricMatchersContaining extends jest.Matchers<void, any> { }
}

afterEach(() => {
    cleanup();
});
