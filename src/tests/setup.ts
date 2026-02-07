import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// ყოველი ტესტის შემდეგ DOM-ის გასუფთავება
afterEach(() => {
  cleanup();
});