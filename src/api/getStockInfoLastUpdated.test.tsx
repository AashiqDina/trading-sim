import axios from "axios";
import { ApiError } from "../error/ApiError";
import getStockInfoLastUpdated from "./getStockInfoLastUpdated";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getStockInfoLastUpdated", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });


    const mockResponse = {
        data: {
            hasError: false,
            errorCode: null,
            data: "img"
        },
    }

    test("returns data on success", async () => {

        mockedAxios.get.mockResolvedValue(mockResponse)

        const result = await getStockInfoLastUpdated("SYMB");

        expect(result).toEqual(mockResponse.data.data);
        expect(mockedAxios.get).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/stocks/GetStockInfoLastUpdated/${"SYMB"}`);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(getStockInfoLastUpdated("SYMB")).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.get.mockRejectedValue(Number("123.456"));

        await expect(getStockInfoLastUpdated("SYMB")).rejects.toEqual(new ApiError(-1));
    });
});