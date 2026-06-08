import axios from "axios";
import deleteStock from "./deleteStock";
import { ApiError } from "../error/ApiError";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("deleteStock", () => {

    const stockId = 2;

    beforeEach(() => {
        jest.resetAllMocks();

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => "mock-token"),
            },
            writable: true,
        });
    });


    test("returns data on success", async () => {

        const mockData = { id: stockId, name: "AAPL" };

        mockedAxios.delete.mockResolvedValue({
            data: mockData,
        });

        const result = await deleteStock(stockId);

        expect(result).toEqual(mockData);
        expect(mockedAxios.delete).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/portfolio/stocks/delete/${stockId}`,  {
                headers:
                    {
                        Authorization: `Bearer mock-token`
                    }
            });
        expect(mockedAxios.delete).toHaveBeenCalledTimes(1);

    });

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.delete.mockRejectedValue({response: { status: 500 }});

        await expect(deleteStock(stockId)).rejects.toEqual(new ApiError(500));

    });

    test("throws ApiError(4010) when unauthorized", async () => {
        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.delete.mockRejectedValue({
            response: { status: 401 }
        });

        await expect(deleteStock(stockId)).rejects.toEqual(new ApiError(4010));
    });

    test("rethrows ApiError if already thrown", async () => {
        const existingError = new ApiError(400);

        mockedAxios.delete.mockRejectedValue(existingError);

        await expect(deleteStock(stockId)).rejects.toEqual(existingError);
    });

    test("throws ApiError(-1) when unauthorized", async () => {
        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.delete.mockRejectedValue({
            response: undefined
        });

        await expect(deleteStock(stockId)).rejects.toEqual(new ApiError(-1));
    });

    test("throws ApiError(-1) for unknown error", async () => {
        
        mockedAxios.delete.mockRejectedValue("unknownErr");

        await expect(deleteStock(stockId)).rejects.toEqual(new ApiError(-1));

    });
});