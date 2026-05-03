import axios from "axios";
import { ApiError } from "../error/ApiError";
import getFriends from "./getFriends";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getCompanyInformation", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockData = [
        {
            friendsUserId: 2,
            username: "name1",
            userId: 1,
            profitLoss: 2,
        },
        {
            friendsUserId: 3,
            username: "name2",
            userId: 1,
            profitLoss: 23,
        }
    ]

    const mockResponse = {
        data: {
            hasError: false,
            errorCode: null,
            data: mockData,
        },
    }
test("returns data on success", async () => {

    mockedAxios.get.mockResolvedValue(mockResponse)

    const result = await getFriends({ userId: 123 });

    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/User/Get-Friends/123`);
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

        await expect(getFriends({userId: 123})).rejects.toEqual(new ApiError(400));

    })

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(getFriends({userId: 123})).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.get.mockRejectedValue(123);

        await expect(getFriends({userId: 123})).rejects.toEqual(new ApiError(-1));
    });
});