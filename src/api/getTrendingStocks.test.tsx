import axios from "axios";
import { ApiError } from "../error/ApiError";
import getTrendingStocks from "./getTrendingStocks";
import { mockTrendingStocks } from "../mocks/Home/mockTrendingStocks";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getTrendingStocks", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockResponse = {
        data: {
            errorCode: null,
            hasError: false,
            trendingStocks: mockTrendingStocks
        },
    }

    test("returns data on success", async () => {

        mockedAxios.get.mockResolvedValue(mockResponse)

        const result = await getTrendingStocks();

        expect(result).toEqual(mockResponse.data.trendingStocks);
        expect(mockedAxios.get).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/stocks/GetTrendingStocks`);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    test("throws ApiError when hasErr", async () => {

        mockedAxios.get.mockResolvedValue({
            data: {
                hasError: true,
                errorCode: 400,
                trendingStocks: null
            },
        });

        await expect(getTrendingStocks()).rejects.toEqual(new ApiError(400));

    })

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(getTrendingStocks()).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.get.mockRejectedValue({arr: []});

        await expect(getTrendingStocks()).rejects.toEqual(new ApiError(-1));
    });
});