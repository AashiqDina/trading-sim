import axios from "axios";
import { ApiError } from "../error/ApiError";
import { StockHistory } from "../types/types";
import getMarketNews from "./getMarketNews";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getCompanyInformation", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockData: StockHistory[] = [
        {
            stockId: 2,
            symbol: "SYMB1",
            history: [],
        },
        {
            stockId: 3,
            symbol: "SYMB2",
            history: [],
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

    const result = await getMarketNews();

    expect(result).toEqual(mockResponse.data.data);
    expect(mockedAxios.get).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/stocks/GetMarketNews`);
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

        await expect(getMarketNews()).rejects.toEqual(new ApiError(400));

    })

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(getMarketNews()).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.get.mockRejectedValue(123);

        await expect(getMarketNews()).rejects.toEqual(new ApiError(-1));
    });
});