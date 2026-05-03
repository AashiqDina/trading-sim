import axios from "axios";
import { ApiError } from "../error/ApiError";
import DeclineFriendRequest from "./DeclineFriendRequest";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Decline Friend Request", () => {

    const userId = 1;
    const friendId = 2;

    test("returns data on success", async () => {

        mockedAxios.post.mockResolvedValue({
            data: {
                errorCode: null, 
                hasError: false,
                data: { success: true }
            }
        });

        const result = await DeclineFriendRequest({ userId, friendId });

        expect(result).toEqual({ success: true });
        expect(mockedAxios.post).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/User/Decline-Request/${userId}/${friendId}`);
    });

    test("throws ApiError when backend returns hasError", async () => {
       
        mockedAxios.post.mockResolvedValue({
            data: {
                hasError: true,
                errorCode: 400,
                data: { success: false }
            }
        });

        await expect(DeclineFriendRequest({ userId, friendId })).rejects.toEqual(new ApiError(400));
    });

    test("throws ApiError from axios response error", async () => {
        
        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.post.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(DeclineFriendRequest({ userId, friendId })).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {
        mockedAxios.post.mockRejectedValue({});

        await expect(DeclineFriendRequest({ userId, friendId })).rejects.toEqual(new ApiError(-1));
    });
});