import axios from "axios";
import { ApiError } from "../error/ApiError";
import DeleteFriend from "./DeleteFriend";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("DeleteFriend", () => {

    const userId = 1;
    const friendId = 2;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("returns data on success", async () => {

        mockedAxios.delete.mockResolvedValue({
            data: {
                errorCode: null,
                hasError: false,
                data: { success: true },
            },
        });

        const result = await DeleteFriend({ userId, friendId });

        expect(result).toEqual({ success: true });

        expect(mockedAxios.delete).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/User/Delete-Friend/${userId}/${friendId}`);

    });

    test("throws ApiError when backend returns hasError", async () => {

        mockedAxios.delete.mockResolvedValue({
            data: {
                hasError: true,
                errorCode: 400,
                data: null,
            },
        });

        await expect(DeleteFriend({ userId, friendId })).rejects.toEqual(new ApiError(400));

    });

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.delete.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(DeleteFriend({ userId, friendId })).rejects.toEqual(new ApiError(500));

    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.delete.mockRejectedValue(1.23);

        await expect(DeleteFriend({ userId, friendId })).rejects.toEqual(new ApiError(-1));

    });
});