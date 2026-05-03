import axios from "axios";
import { ApiError } from "../error/ApiError";
import getStockImage from "./getStockImage";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getStockImage", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });


    const mockResponse = {
        data: {
            hasError: false,
            errorCode: null,
            image: {
                data: "img"
            },
        },
    }

    test("returns data on success", async () => {

        mockedAxios.get.mockResolvedValue(mockResponse)

        const result = await getStockImage("SYMB");

        expect(result).toEqual(mockResponse.data.image.data);
        expect(mockedAxios.get).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/stocks/StockImage/${"SYMB"}`);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    test("throws ApiError when hasErr", async () => {

        mockedAxios.get.mockResolvedValue({
            data: {
                image: {
                    hasError: true,
                    errorCode: 400,
                    data: "img"
                },
            },
        });

        await expect(getStockImage("SYMB")).rejects.toEqual(new ApiError(400));

    })

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(getStockImage("SYMB")).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.get.mockRejectedValue(() => {});

        await expect(getStockImage("SYMB")).rejects.toEqual(new ApiError(-1));
    });
});