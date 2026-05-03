import { ApiError } from "../error/ApiError";
import handleRegister from "./handleRegister";

describe("handleRegister", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("does not throw on success", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue({
                success: true,
            })
        }) as jest.Mock;

        await expect(handleRegister("user", "pass")).resolves.toBeUndefined();
    });

    test("throws ApiError(-1) when response is not ok", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 400,
            json: jest.fn().mockResolvedValue({
                success: true,
            }),
        }) as jest.Mock;

        await expect(handleRegister("user", "pass")).rejects.toEqual(new ApiError(-1));
    });

    test("throws ApiError(-1) when success is false", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue({
                success: false,
            }),
        }) as jest.Mock;

        await expect(handleRegister("user", "pass")).rejects.toEqual(new ApiError(-1));
  });

    test("throws ApiError(-1) when fetch throws", async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error("network")) as jest.Mock;

        await expect(handleRegister("user", "pass")).rejects.toEqual(new ApiError(-1));
    });

});