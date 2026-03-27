import { jest } from '@jest/globals';

jest.mock('axios');

jest.mock("focus-trap-react", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));