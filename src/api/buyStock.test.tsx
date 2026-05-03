import axios from "axios";
import { ApiError } from "../error/ApiError";
import buyStock from "./buyStock";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("BuyStock", () => {

    const stockPurchaseRequest = {
        symbol: "stockSymbol",
        quantity: 10,
    };

    const args = {
        userId: 1,
        stockSymbol: stockPurchaseRequest.symbol,
        quantity: stockPurchaseRequest.quantity
    }

    test("returns data on success", async () => {

        mockedAxios.post.mockResolvedValue({
            data: {
                errorCode: null, 
                hasError: false,
                data: { success: true }
            }
        });

        const result = await buyStock(args);

        expect(result.data).toEqual({ success: true });
        expect(mockedAxios.post).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/portfolio/${args.userId}/stocks`, stockPurchaseRequest);
    });

    test("throws ApiError when backend returns hasError", async () => {
       
        mockedAxios.post.mockRejectedValue(new ApiError(400));

        await expect(buyStock(args)).rejects.toEqual(new ApiError(400));
    });

    test("throws ApiError from axios response error", async () => {
        
        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.post.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(buyStock(args)).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {
        mockedAxios.post.mockRejectedValue({ error: 123});

        await expect(buyStock(args)).rejects.toEqual(new ApiError(-1));
    });
});