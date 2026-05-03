import { ApiError } from "../error/ApiError";
import handleLogin from "./handleLogin";

describe("handleLogin", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockResponseData = {
        userId: 1,
        username: "testUser",
    };

    test("returns data correctly", async () => {

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue(mockResponseData),
        }) as jest.Mock;

        const result = await handleLogin("testUser", "password");

        expect(result).toEqual(mockResponseData);
        expect(fetch).toHaveBeenCalledWith("https://tradingsim-backend.onrender.com/api/User/login",
            expect.objectContaining({
                method: "POST",
                credentials: "include",
        }));

    });

    test("throws ApiError when response is not ok", async () => {

        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 401,
            json: jest.fn().mockResolvedValue({}),
        }) as jest.Mock;

        await expect(handleLogin("testUser", "wrongPassword")).rejects.toEqual(new ApiError(401));

    });

    test("throws ApiError(-1) when fetch throws", async () => {
        global.fetch = jest.fn().mockRejectedValue(jest.fn()) as jest.Mock;

        await expect(handleLogin("testUser", "password")).rejects.toEqual(new ApiError(-1));
    });

});