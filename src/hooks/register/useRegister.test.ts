import { renderHook, act } from "@testing-library/react";
import { useRegister } from "./useRegister";
import checkUsername from "../../api/checkUsername";
import handleRegister from "../../api/handleRegister";
import { ApiError } from "../../error/ApiError";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../api/checkUsername")
const mockedCheckUsername = jest.mocked(checkUsername)

jest.mock("../../api/handleRegister")
const mockedHandleRegister = jest.mocked(handleRegister)

describe("useRegister tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("successful register navigates user to the login page", async () => {

        mockedCheckUsername.mockResolvedValue(undefined)
        mockedHandleRegister.mockResolvedValue(undefined)

        const { result } = renderHook(() => useRegister())

        await act(async () => {
            await result.current.toRegister("TestUser", "password123", "password123")
        })

        
        expect(mockedCheckUsername).toHaveBeenCalledWith("TestUser")
        expect(mockedHandleRegister).toHaveBeenCalledWith("TestUser", "password123")
        expect(mockNavigate).toHaveBeenCalledWith("/login")

    })

    test("username less than 3 chars throws err", async () => {

        mockedCheckUsername.mockResolvedValue(undefined)
        mockedHandleRegister.mockResolvedValue(undefined)

        const { result } = renderHook(() => useRegister())

        await act(async () => {
            await result.current.toRegister("TU", "password123", "password123") 
        })

        expect(result.current.error).toBe("Usernames Need To Be At Least 3 Characters")
        expect(mockedCheckUsername).not.toHaveBeenCalled();
        expect(mockedHandleRegister).not.toHaveBeenCalled();

    })

    test("mismatched passwords throws err", async () => {

        mockedCheckUsername.mockResolvedValue(undefined)
        mockedHandleRegister.mockResolvedValue(undefined)

        const { result } = renderHook(() => useRegister())

        await act(async () => {
            await result.current.toRegister("TestUser", "password123", "password12") 
        })

        expect(result.current.error).toBe("Passwords Do Not Match")
        expect(mockedCheckUsername).not.toHaveBeenCalled();
        expect(mockedHandleRegister).not.toHaveBeenCalled();

    })

    test("short passwords throws err", async () => {

        mockedCheckUsername.mockResolvedValue(undefined)
        mockedHandleRegister.mockResolvedValue(undefined)

        const { result } = renderHook(() => useRegister())

        await act(async () => {
            await result.current.toRegister("TestUser", "pass", "pass") 
        })

        expect(result.current.error).toBe("Passwords Need To Be At Least 8 Characters")
        expect(mockedCheckUsername).not.toHaveBeenCalled();
        expect(mockedHandleRegister).not.toHaveBeenCalled();

    })

    test("unable to check username availability throws err", async () => {

        mockedCheckUsername.mockRejectedValue(new ApiError(1002))
        mockedHandleRegister.mockResolvedValue(undefined)

        const { result } = renderHook(() => useRegister())

        await act(async () => {
            await result.current.toRegister("TestUser", "password123", "password123") 
        })

        expect(result.current.error).toBe("Error Checking Username Availability")

    })

    test("taken username throws err", async () => {

        mockedCheckUsername.mockRejectedValue(new ApiError(1003))
        mockedHandleRegister.mockResolvedValue(undefined)

        const { result } = renderHook(() => useRegister())

        await act(async () => {
            await result.current.toRegister("TestUser", "password123", "password123") 
        })

        expect(result.current.error).toBe("Username Already Taken")

    })

    test("unknown ApiError sets correct errCode", async () => {

        mockedCheckUsername.mockResolvedValue(undefined)
        mockedHandleRegister.mockRejectedValue(new ApiError(404))

        const { result } = renderHook(() => useRegister())

        await act(async () => {
            await result.current.toRegister("TestUser", "password123", "password123")
        })

        expect(result.current.errorCode).toBe(404)
    })

    test("unknown Error sets ErrCode to -1", async () => {

        mockedCheckUsername.mockResolvedValue(undefined)
        mockedHandleRegister.mockRejectedValue([{Error: "Funky Error"}])

        const { result } = renderHook(() => useRegister())

        await act(async () => {
            await result.current.toRegister("TestUser", "password123", "password123")
        })

        expect(result.current.errorCode).toBe(-1)
    })

    test("resetError resets error correctly", async () => {

        mockedCheckUsername.mockResolvedValue(undefined)
        mockedHandleRegister.mockRejectedValue(new ApiError(404))

        const { result } = renderHook(() => useRegister())

        await act(async () => {
            await result.current.toRegister("TestUser", "password123", "password123")
        })

        expect(result.current.errorCode).toBe(404)

        act(() => {
            result.current.resetError()
        })

        expect(result.current.errorCode).toBe(null)

    })

    test("loading is true during registration and false when complete", async () => {

        let resolvePromise!: () => void;

        const pendingPromise = new Promise<void>((resolve) => {
            resolvePromise = resolve;
        });

        mockedCheckUsername.mockReturnValue(pendingPromise)
        mockedHandleRegister.mockResolvedValue(undefined)

        const { result } = renderHook(() => useRegister())

        act(() => {
            result.current.toRegister(
                "TestUser",
                "password123",
                "password123"
            )
        })

        expect(result.current.loading).toBe(true)

        await act(async () => {
            resolvePromise()
            await pendingPromise
        });

        expect(result.current.loading).toBe(false)
    });

    test("loading returns to false after validation error", async () => {

        const { result } = renderHook(() => useRegister());

        await act(async () => {
            await result.current.toRegister(
                "TU",
                "password123",
                "password123"
            );
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(
            "Usernames Need To Be At Least 3 Characters"
        );
    });
})