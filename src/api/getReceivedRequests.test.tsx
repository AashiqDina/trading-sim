import axios from "axios";
import { ApiError } from "../error/ApiError";
import { friendListMember } from "../types/types";
import getReceivedRequests from "./getReceivedRequests";
import { mockFriendList } from "../mocks/Friends/mockFriendList";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getReceivedRequests", () => {

    beforeEach(() => {
        jest.resetAllMocks();
        Storage.prototype.getItem = jest.fn(() => "fake-token");
    });

    const mockData: friendListMember[] = mockFriendList

    const mockResponse = {
        data: {
            hasError: false,
            errorCode: null,
            data: mockData,
        },
    }

    test("returns data on success", async () => {

        mockedAxios.get.mockResolvedValue(mockResponse)

        const result = await getReceivedRequests();

        expect(result).toEqual(mockResponse.data.data);
        expect(mockedAxios.get).toHaveBeenCalledWith(
            "https://tradingsim-backend.onrender.com/api/User/Get-Received-Request",
            {
                headers: {
                Authorization: `Bearer fake-token`,
                },
            }
        );
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    test("throws ApiError when hasErr", async () => {

        mockedAxios.get.mockResolvedValue({
            data: {
                hasError: true,
                errorCode: 400,
                data: mockData,
            },
        });

        await expect(getReceivedRequests()).rejects.toEqual(new ApiError(400));

    })

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(getReceivedRequests()).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError from axios response error -1 when status is broken", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: null,
        });

        await expect(getReceivedRequests()).rejects.toEqual(new ApiError(-1));
    });

    test("uses error.response.status ?? -1 branch", async () => {
        mockedAxios.isAxiosError.mockReturnValue(true as any);

        mockedAxios.get.mockRejectedValue({
            response: { status: null },
        });

        await expect(getReceivedRequests()).rejects.toEqual(new ApiError(-1));
    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.get.mockRejectedValue(/aBcD/i);

        await expect(getReceivedRequests()).rejects.toEqual(new ApiError(-1));
    });

    test("throws ApiError(4010) when axios returns 401", async () => {
        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 401 },
        });

        await expect(getReceivedRequests()).rejects.toEqual(new ApiError(4010));
    });
});