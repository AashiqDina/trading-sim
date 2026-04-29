import { renderHook, act } from "@testing-library/react";
import { useLogout } from "./useLogout";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router";

jest.mock("../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
}));

const mockLogout = jest.fn();
const mockNavigate = jest.fn();

describe("useLogout tests", () => {

  test("calls logout and navigates to login", () => {

    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    const { result } = renderHook(() => useLogout());

    act(() => {
      result.current();
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});