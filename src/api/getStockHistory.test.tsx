import axios from "axios";
import { ApiError } from "../error/ApiError";
import { StockDetailsHistoryItem } from "../types/types";
import { mockHistory } from "../mocks/StockDetails/mockHistory";
import getStockHistory from "./getStockHistory";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getStockHistory", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockData: StockDetailsHistoryItem[] = mockHistory 

    const mockResponse = {
        data: {
            hasError: false,
            errorCode: null,
            data: {
                values: mockData
            },
        },
    }

    test("returns data on success", async () => {

        mockedAxios.get.mockResolvedValue(mockResponse)

        const result = await getStockHistory("SYMB");

        expect(result).toEqual(mockResponse.data.data.values);
        expect(mockedAxios.get).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/stocks/GetStocksFullHistory/${"SYMB"}`);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    test("throws ApiError when hasErr", async () => {

        mockedAxios.get.mockResolvedValue({
            data: {
                data: {
                    hasError: true,
                    errorCode: 400,
                    values: mockData
                },
            },
        });

        await expect(getStockHistory("SYMB")).rejects.toEqual(new ApiError(400));

    })

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(getStockHistory("SYMB")).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.get.mockRejectedValue(async () => {});

        await expect(getStockHistory("SYMB")).rejects.toEqual(new ApiError(-1));
    });
});