import { act, render, renderHook } from "@testing-library/react";
import handleLogin from "../../api/handleLogin";
import { useLogin } from "./useLogin";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../error/ApiError";

jest.mock("../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../api/handleLogin");

const mockHandleLogin = handleLogin as jest.Mock;
const mockNavigate = jest.fn();
const mockLogin = jest.fn();

describe("useLogin tests", () => {

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test("Successful Login", async () => {
    mockHandleLogin.mockResolvedValue({
      user: {
        id: 1,
        username: "username",
        investedAmount: 100,
        currentValue: 150,
        profitLoss: 50,
      },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.CompleteLogin("username", "password");
    });

    expect(mockHandleLogin).toHaveBeenCalledWith("username", "password");

    expect(mockLogin).toHaveBeenCalledWith({
      id: 1,
      username: "username",
      investedAmount: 100,
      currentValue: 150,
      profitLoss: 50,
    });

    expect(mockNavigate).toHaveBeenCalledWith("/portfolio");
  });

  test("Login failed with APIError(401)", async () => {

    mockHandleLogin.mockRejectedValue(new ApiError(401))

    const { result } = renderHook(() => useLogin())

    await act(async () => {
        await result.current.CompleteLogin("username", "password")
    })

    expect(result.current.error).toBe("Invalid Username or Password")
    expect(result.current.errorCode).toBeNull()
  })

  test("Login failed with other ApiError", async () => {

    mockHandleLogin.mockRejectedValue(new ApiError(404))

    const { result } = renderHook(() => useLogin())

    await act(async () => {
        await result.current.CompleteLogin("username", "password")
    })

    expect(result.current.error).toBe("")
    expect(result.current.errorCode).toBe(404)
  })

  test("Login Failed with non ApiError", async () => {
     
    mockHandleLogin.mockRejectedValue("A random unknown error")

    const { result }  = renderHook(() => useLogin())

    await act(async () => {
        await result.current.CompleteLogin("username", "passsword")
    })

    expect(result.current.error).toBe("")
    expect(result.current.errorCode).toBe(-1)
  })

  test("reset Error resets errorCode", async () => {

    mockHandleLogin.mockRejectedValue(new ApiError(429))

    const { result } = renderHook(() => useLogin())

    await act(async () => {
        await result.current.CompleteLogin("username", "passsword")
    })

    expect(result.current.errorCode).toBe(429)

    await act(() => {
        result.current.resetError()
    })

    expect(result.current.errorCode).toBeNull()
  })

  test("loading is true while login is in progress and false when complete", async () => {
    let resolvePromise: (value: any) => void;

    const loginPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockHandleLogin.mockReturnValue(loginPromise);

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.CompleteLogin("username", "password");
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({
        user: {
          id: 1,
          username: "username",
          investedAmount: 100,
          currentValue: 150,
          profitLoss: 50,
        },
      });

      await loginPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  test("loading is false after failed login", async () => {
    let rejectPromise: (reason?: any) => void;

    const loginPromise = new Promise((_, reject) => {
      rejectPromise = reject;
    });

    mockHandleLogin.mockReturnValue(loginPromise);

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.CompleteLogin("username", "password");
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      rejectPromise!(new ApiError(401));

      try {
        await loginPromise;
      } catch {}
    });

    expect(result.current.loading).toBe(false);
  });
});