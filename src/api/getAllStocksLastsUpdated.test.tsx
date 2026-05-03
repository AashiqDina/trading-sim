import axios from "axios";
import getAllStocksLastUpdated from "./getAllStocksLastUpdated";
import { ApiError } from "../error/ApiError";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getAllStocksLastUpdated", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockData = {
        AAPL: "2026-05-01",
        TSLA: "2026-05-01",
    };

    test("returns stock update map on success", async () => {

        mockedAxios.get.mockResolvedValue({
            data: {
                data: mockData,
            },
        });

        const result = await getAllStocksLastUpdated();

        expect(result).toEqual(mockData);
        expect(mockedAxios.get).toHaveBeenCalledWith("https://tradingsim-backend.onrender.com/api/stocks/GetAllStockLastUpdated");
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    });

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(getAllStocksLastUpdated()).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.get.mockRejectedValue(123);

        await expect(getAllStocksLastUpdated()).rejects.toEqual(new ApiError(-1));
    });
});