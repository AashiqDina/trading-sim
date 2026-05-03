import axios from "axios";
import deleteStock from "./deleteStock";
import { ApiError } from "../error/ApiError";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("deleteStock", () => {

    const userId = 1;
    const stockId = 2;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("returns data on success", async () => {

        const mockData = { id: stockId, name: "AAPL" };

        mockedAxios.delete.mockResolvedValue({
            data: mockData,
        });

        const result = await deleteStock(userId, stockId);

        expect(result).toEqual(mockData);
        expect(mockedAxios.delete).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/portfolio/${userId}/stocks/delete/${stockId}`);
        expect(mockedAxios.delete).toHaveBeenCalledTimes(1);

    });

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.delete.mockRejectedValue({response: { status: 500 }});

        await expect(deleteStock(userId, stockId)).rejects.toEqual(new ApiError(500));

    });

    test("throws ApiError(-1) for unknown error", async () => {
        
        mockedAxios.delete.mockRejectedValue("unknownErr");

        await expect(deleteStock(userId, stockId)).rejects.toEqual(new ApiError(-1));

    });
});