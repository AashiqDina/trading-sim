import axios from "axios";
import { ApiError } from "../error/ApiError";
import getStockPrice from "./getStockPrice";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getStockPrice", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockResponse = {
        data: {
            response: {
            hasError: false,
            errorCode: null,
                data: 10
            }
        },
    }

    test("returns data on success", async () => {

        mockedAxios.get.mockResolvedValue(mockResponse)

        const result = await getStockPrice("SYMB");

        expect(result).toEqual(mockResponse.data.response.data);
        expect(mockedAxios.get).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/stocks/${"SYMB"}`);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    test("throws ApiError when hasErr", async () => {

        mockedAxios.get.mockResolvedValue({
            data: {
                response: {
                    hasError: true,
                    errorCode: 400,
                    data: 10
                }
            },
        });

        await expect(getStockPrice("SYMB")).rejects.toEqual(new ApiError(400));

    })

    test("throws ApiError when hasErr 404", async () => {

        mockedAxios.get.mockResolvedValue({
            data: {
                response: {
                    hasError: true,
                    errorCode: 404,
                    data: 10
                }
            },
        });

        await expect(getStockPrice("SYMB")).rejects.toEqual(new ApiError(1001));

    })

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(getStockPrice("SYMB")).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.get.mockRejectedValue({ obj: {}});

        await expect(getStockPrice("SYMB")).rejects.toEqual(new ApiError(-1));
    });
});