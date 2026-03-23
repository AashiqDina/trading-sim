import { jest } from '@jest/globals';

jest.mock('axios');

jest.mock("../../Functions/AuthContext", () => {
  const actual = jest.requireActual("../../Functions/AuthContext") as Record<string, any>;
  return {
    ...actual,
    useAuth: () => ({
      user: {
        id: 1,
        username: "TestUser",
        investedAmount: 0,
        currentValue: 0,
        profitLoss: 0,
        portfolio: undefined
      }
    })
  };
});

jest.mock("focus-trap-react", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));