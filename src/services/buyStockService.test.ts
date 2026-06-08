import buyStockService from "./buyStockService";
import { ApiError } from "../error/ApiError";

import buyStock from "../api/buyStock";
import getPortfolio from "../api/getPortfolio";

jest.mock("../api/buyStock");
jest.mock("../api/getPortfolio");

const mockedBuyStock = buyStock as jest.MockedFunction<typeof buyStock>;
const mockedGetPortfolio = getPortfolio as jest.MockedFunction<typeof getPortfolio>;

describe("buyStockService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const params = {
        stockPrice: 100,
        quantity: 5,
        stockSymbol: "AAPL",
        userId: 1
    };

    test("throws INVALID_STOCK_PRICE if stockPrice is invalid", async () => {

        await expect(
            buyStockService({
                ...params,
                stockPrice: Infinity
            })
        ).rejects.toEqual(new ApiError(1500));
    });

    test("throws INVALID_STOCK_QUANTITY if quantity is invalid", async () => {

        await expect(
            buyStockService({
                ...params,
                quantity: Infinity
            })
        ).rejects.toEqual(new ApiError(1499));
    });

    test("throws ZERO_QUANTITY if quantity is 0", async () => {

        await expect(
            buyStockService({
                ...params,
                quantity: 0
            })
        ).rejects.toEqual(new ApiError(1501));
    });

    test("throws QUANTITY_NEGATIVE if quantity is negative", async () => {

        await expect(
            buyStockService({
                ...params,
                quantity: -5
            })
        ).rejects.toEqual(new ApiError(1502));
    });

    test("throws COST_TOO_MUCH if purchase exceeds limit", async () => {

        await expect(
            buyStockService({
                ...params,
                stockPrice: 50000,
                quantity: 3
            })
        ).rejects.toEqual(new ApiError(1503));
    });

    test("throws TOO_MANY_STOCKS if portfolio exceeds max stocks", async () => {

        mockedGetPortfolio.mockResolvedValue({stocks: [1, 2, 3, 4, 5, 6]} as any);

        await expect(buyStockService(params)).rejects.toEqual(new ApiError(1504));

        expect(mockedBuyStock).not.toHaveBeenCalled();
    });

    test("calls buyStock successfully", async () => {

        mockedGetPortfolio.mockResolvedValue({stocks: [1, 2]} as any);
        mockedBuyStock.mockResolvedValue({ success: true } as any);

        const result = await buyStockService(params);

        expect(mockedGetPortfolio).toHaveBeenCalledWith(1);
        expect(mockedBuyStock).toHaveBeenCalledWith({
            stockSymbol: "AAPL",
            quantity: 5,
        });

        expect(result).toEqual({
            success: true
        });
    });

    test("rethrows ApiError from try block", async () => {

        mockedGetPortfolio.mockRejectedValue(new ApiError(1504));

        await expect(
            buyStockService(params)
        ).rejects.toEqual(new ApiError(1504));
    });

    test("throws generic ApiError for unknown errors", async () => {

        mockedGetPortfolio.mockRejectedValue(new Error("Database failure"));

        await expect(
            buyStockService(params)
        ).rejects.toEqual(new ApiError(-1));
    });
});