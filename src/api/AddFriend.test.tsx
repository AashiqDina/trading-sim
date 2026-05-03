import axios from "axios";
import AddFriend from "./AddFriend";
import { ApiError } from "../error/ApiError";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AddFriend", () => {
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

        const result = await AddFriend({ userId, friendId });

        expect(result.data).toEqual({ success: true });
        expect(mockedAxios.post).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/User/Send-Friend-Request/${userId}/${friendId}`);
    });

    test("throws ApiError when backend returns hasError", async () => {
       
        mockedAxios.post.mockResolvedValue({
            data: {
                hasError: true,
                errorCode: 400,
                data: { success: false }
            }
        });

        await expect(AddFriend({ userId, friendId })).rejects.toEqual(new ApiError(400));
    });

    test("throws ApiError from axios response error", async () => {
        
        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.post.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(AddFriend({ userId, friendId })).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {
        mockedAxios.post.mockRejectedValue({error: {code: 123}});

        await expect(AddFriend({ userId, friendId })).rejects.toEqual(new ApiError(-1));
    });
});