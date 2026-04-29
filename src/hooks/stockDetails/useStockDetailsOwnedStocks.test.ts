import { act, renderHook, waitFor } from "@testing-library/react"
import getAllStocksLastUpdated from "../../api/getAllStocksLastUpdated"
import getPortfolio from "../../api/getPortfolio"
import { mockedPortfolio } from "../../mocks/Portfolio/mockedPortfolio"
import { useStockDetailsOwnedStocks } from "./useStockDetailsOwnedStocks"
import { ApiError } from "../../error/ApiError"

jest.mock("../../api/getPortfolio")
const mockedGetPortfolio = jest.mocked(getPortfolio)

jest.mock("../../api/getAllStocksLastUpdated")
const mockedGetAllStocksLastUpdated = jest.mocked(getAllStocksLastUpdated)

const mockedPortLastUpdated = {
    symbol_1: "2024-01-01",
    TSLA: "2024-01-02",
}

describe("useStockDetailsOwnedStocks tests", () => {

    const args = {
        symbol: "symbol_1",
        user: 1,
        handleError: jest.fn()
    }

    test("successfully fetches owned stocks", async () => {

        mockedGetPortfolio.mockResolvedValue(mockedPortfolio)
        mockedGetAllStocksLastUpdated.mockResolvedValue(mockedPortLastUpdated)

        const { result } = renderHook(() => useStockDetailsOwnedStocks(args))

        await act(async () => {
            await result.current.fetchOwnedStocks()
        })

        const userOwnedStocks = mockedPortfolio.stocks.filter((stock) => 
            stock.symbol === args.symbol
        )

        const map = new Map<string, Date>(
            Object.entries(mockedPortLastUpdated).map(([key, value]) => [key, new Date(value as string)
        ]));

        expect(mockedGetPortfolio).toHaveBeenCalledWith(args.user)
        expect(mockedGetAllStocksLastUpdated).toHaveBeenCalledTimes(1)
        expect(result.current.ownedStocks).toEqual(userOwnedStocks)
        expect(result.current.lastUpdated).toEqual(map)
    })

    test("no user throws ApiError(1000)", async () => {

        const handleErr = jest.fn()

        const { result } = renderHook(() => useStockDetailsOwnedStocks({...args, user: undefined, handleError: handleErr}))

        await act(async () => {
            await result.current.fetchOwnedStocks()
        })

        expect(handleErr).toHaveBeenCalledWith(expect.any(ApiError))

    })

    test("handles error by calling correct function", async () => {

        const handleErr = jest.fn()
        mockedGetPortfolio.mockRejectedValue("error")

        const { result } = renderHook(() => useStockDetailsOwnedStocks({...args, handleError: handleErr}))

        await act(async () => {
            await result.current.fetchOwnedStocks()
        })

        expect(handleErr).toHaveBeenCalledWith("error")
    })

    test("sets loading correctly during fetch", async () => {

        mockedGetPortfolio.mockResolvedValue(mockedPortfolio)
        mockedGetAllStocksLastUpdated.mockResolvedValue(mockedPortLastUpdated)

        const { result } = renderHook(() => useStockDetailsOwnedStocks(args))

        act(() => {
            result.current.fetchOwnedStocks()
        })

        await waitFor(() => {
            expect(result.current.ownedStocksLoading).toBe(true)
        })

        await waitFor(() => {
            expect(result.current.ownedStocksLoading).toBe(false)
        })
    })

    test("only returns stocks matching symbol", async () => {
        
        mockedGetPortfolio.mockResolvedValue(mockedPortfolio)
        mockedGetAllStocksLastUpdated.mockResolvedValue(mockedPortLastUpdated)

        const { result } = renderHook(() => useStockDetailsOwnedStocks(args))

        await act(async () => {
            await result.current.fetchOwnedStocks()
        })

        expect(result.current.ownedStocks.every(s => s.symbol === args.symbol)).toBe(true)
    })
})