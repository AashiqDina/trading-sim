import axios from "axios";
import { ApiError } from "../error/ApiError";
import DeleteFriend from "./DeleteFriend";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("DeleteFriend", () => {

    const friendId = 2;

    beforeEach(() => {
        jest.resetAllMocks();
        
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => "mock-token"),
            },
            writable: true,
        });
    });

    test("returns data on success", async () => {

        mockedAxios.delete.mockResolvedValue({
            data: {
                errorCode: null,
                hasError: false,
                data: { success: true },
            },
        });

        const result = await DeleteFriend({ friendId });

        expect(result).toEqual({ success: true });

        expect(mockedAxios.delete).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/User/Delete-Friend/${friendId}`, {
                headers: {
                    Authorization: `Bearer mock-token`
                }
            }
        );

    });

    test("throws ApiError when backend returns hasError", async () => {

        mockedAxios.delete.mockResolvedValue({
            data: {
                hasError: true,
                errorCode: 400,
                data: null,
            },
        });

        await expect(DeleteFriend({ friendId })).rejects.toEqual(new ApiError(400));

    });

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.delete.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(DeleteFriend({ friendId })).rejects.toEqual(new ApiError(500));

    });

    test("throws ApiError -1 from axios response broken error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.delete.mockRejectedValue({
            response: null,
        });

        await expect(DeleteFriend({ friendId })).rejects.toEqual(new ApiError(-1));

    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.delete.mockRejectedValue(1.23);

        await expect(DeleteFriend({ friendId })).rejects.toEqual(new ApiError(-1));

    });

    test("throws ApiError(4010) when axios returns 401", async () => {
        mockedAxios.isAxiosError.mockReturnValue(true as any);

        mockedAxios.delete.mockRejectedValue({
            isAxiosError: true,
            response: { status: 401 },
        });

        await expect(DeleteFriend({ friendId })).rejects.toEqual(new ApiError(4010));
    });
});