import axios from "axios";
import { ApiError } from "../error/ApiError";
import updateAllStocksInPortfolio from "./UpdateStocksInPortfolio";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("updateAllStocksInPortfolio", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const userId = 1;

    test("calls successfully", async () => {

    mockedAxios.put.mockResolvedValue({});

        await expect(updateAllStocksInPortfolio({ userId })).resolves.toBeUndefined();

        expect(mockedAxios.put).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/portfolio/${userId}/stocks/update`);
    });

    test("throws ApiError(1000) when userId is falsey", async () => {

        await expect(updateAllStocksInPortfolio({ userId: undefined })).rejects.toEqual(new ApiError(1000));
    });

    test("throws ApiError from axios response has error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.put.mockRejectedValue({response: { status: 500 },});

        await expect(updateAllStocksInPortfolio({ userId })).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {
            
        mockedAxios.put.mockRejectedValue("random error");

        await expect(updateAllStocksInPortfolio({ userId })).rejects.toEqual(new ApiError(-1));
    });

});