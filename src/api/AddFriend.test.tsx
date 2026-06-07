import axios from "axios";
import AddFriend from "./AddFriend";
import { ApiError } from "../error/ApiError";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AddFriend", () => {
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

        mockedAxios.post.mockResolvedValue({
            data: {
                errorCode: null, 
                hasError: false,
                data: { success: true }
            }
        });

        const result = await AddFriend({ friendId });

        expect(result.data).toEqual({ success: true });
        expect(mockedAxios.post).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/User/Send-Friend-Request/${friendId}`, {}, {
                headers: {
                    Authorization: `Bearer mock-token`
                }
            });
    });

    test("throws ApiError when backend returns hasError", async () => {
       
        mockedAxios.post.mockResolvedValue({
            data: {
                hasError: true,
                errorCode: 400,
                data: { success: false }
            }
        });

        await expect(AddFriend({ friendId })).rejects.toEqual(new ApiError(400));
    });

    test("throws ApiError -1 from axios response broken error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.delete.mockRejectedValue({
            response: null,
        });

        await expect(AddFriend({ friendId })).rejects.toEqual(new ApiError(-1));

    });

    test("throws ApiError from axios response error", async () => {
        
        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.post.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(AddFriend({ friendId })).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {
        mockedAxios.post.mockRejectedValue({error: {code: 123}});

        await expect(AddFriend({ friendId })).rejects.toEqual(new ApiError(-1));
    });

    test("throws ApiError(4010) when axios returns 401", async () => {
        mockedAxios.isAxiosError.mockReturnValue(true as any);

        mockedAxios.post.mockRejectedValue({
            isAxiosError: true,
            response: { status: 401 },
        });

        await expect(AddFriend({ friendId})).rejects.toEqual(new ApiError(4010));
    });
});