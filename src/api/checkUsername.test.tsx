import checkUsername from "./checkUsername";
import { ApiError } from "../error/ApiError";

describe("checkUsername", () => {

    const username = "testUser";

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("calls with no issue when username is available", async () => {

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ exists: false }),
        } as Response);

        await expect(checkUsername(username)).resolves.toBeUndefined();

        expect(fetch).toHaveBeenCalledWith("https://tradingsim-backend.onrender.com/api/User/checkUsername",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({ username }),
            })
        );
    });

    test("throws ApiError(1003) when username exists", async () => {

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ exists: true }),
        } as Response);

        await expect(checkUsername(username)).rejects.toEqual(new ApiError(1003));
    });

    test("throws ApiError(1002) when response not ok", async () => {

        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
        } as Response);

        await expect(checkUsername(username)).rejects.toEqual(new ApiError(1002));
    });

    test("throws ApiError(-1) for unknown error", async () => {
        global.fetch = jest.fn().mockRejectedValue([1,2,3]);

        await expect(checkUsername(username)).rejects.toEqual(new ApiError(-1));
    });
});