import axios from "axios";
import { ApiError } from "../error/ApiError";
import { UserPortfolio } from "../types/types";
import getPortfolio from "./getPortfolio";
import getStockName from "./getStockName";
import getStockImage from "./getStockImage";
import { imageMap, nameMap } from "./getPortfolio";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("./getStockName")
const mockedGetStockName = jest.mocked(getStockName)

jest.mock("./getStockImage")
const mockedGetStockImage = jest.mocked(getStockImage)

describe("getPortfolio", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const finalMockData: UserPortfolio = {
        id: 1,
        userId: 1,
        stocks: [{
            id: 1,
            symbol: "SYMB",
            purchasePrice: 101,
            currentPrice: 102,
            quantity: 1,
            totalValue: 102,
            profitLoss: 1,
            portfolioId: 1,
            history: [],
            name: "Symbol",
            logo: "Image"
        }],
        totalInvested: 100,
        currentValue: 200,
        profitLoss: 100
    }

    const expectedMockData = {
        id: 1,
        userId: 1,
        stocks: [{
            id: 1,
            symbol: "SYMB",
            purchasePrice: 101,
            currentPrice: 102,
            quantity: 1,
            totalValue: 102,
            profitLoss: 1,
            portfolioId: 1,
            history: [],
        }],
        totalInvested: 100,
        currentValue: 200,
        profitLoss: 100
    }

    const mockResponse = {
        hasError: false,
        errorCode: null,
        data: expectedMockData,
    }
    

    const userId = 1;

    test("returns data on success", async () => {

        mockedAxios.get.mockResolvedValue(mockResponse)
        mockedGetStockName.mockResolvedValue("Symbol")
        mockedGetStockImage.mockResolvedValue("Image")

        const result = await getPortfolio(userId);

        expect(result).toEqual(finalMockData);
        expect(mockedAxios.get).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/portfolio/${userId}`);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    test("throws ApiError when hasErr", async () => {

        mockedAxios.get.mockResolvedValue({
            data: null,
            status: 400
        });

        await expect(getPortfolio(userId)).rejects.toEqual(new ApiError(400));

    });

    test("throws ApiError when getName has Err", async () => {

        imageMap.clear();
        nameMap.clear();
        mockedAxios.get.mockResolvedValue(mockResponse)
        mockedGetStockName.mockRejectedValue(new ApiError(404))

        await expect(getPortfolio(userId)).rejects.toEqual(new ApiError(404));

    });

    test("throws ApiError when getName has unknown Err", async () => {

        imageMap.clear();
        nameMap.clear();
        mockedAxios.get.mockResolvedValue(mockResponse)
        mockedGetStockName.mockRejectedValue("jojo")

        await expect(getPortfolio(userId)).rejects.toEqual(new ApiError(-1));

    });

    test("uses cache and does not call getStockName/getStockImage again", async () => {
        mockedAxios.get.mockResolvedValue(mockResponse);

        mockedGetStockName.mockResolvedValue("Name");
        mockedGetStockImage.mockResolvedValue("Image");

        await getPortfolio(userId);

        mockedGetStockName.mockClear();
        mockedGetStockImage.mockClear();

        await getPortfolio(userId);

        expect(mockedGetStockName).not.toHaveBeenCalled();
        expect(mockedGetStockImage).not.toHaveBeenCalled();
    });

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(getPortfolio(userId)).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.get.mockRejectedValue(123);

        await expect(getPortfolio(userId)).rejects.toEqual(new ApiError(-1));
    });
});