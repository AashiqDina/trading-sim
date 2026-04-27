import { act, renderHook, waitFor } from "@testing-library/react"
import getMarketNews from "../api/getMarketNews"
import GetStockList from "../api/getStockList"
import getTrendingStocks from "../api/getTrendingStocks"
import { mockMarketNews } from "../mocks/Home/mockMarketNews"
import { mockStockList } from "../mocks/Home/mockStockList"
import { mockTrendingStocks } from "../mocks/Home/mockTrendingStocks"
import { useHomeData } from "./useHomeData"
import getStockPrice from "../api/getStockPrice"
import { ApiError } from "../error/ApiError"

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../api/getStockList")
const mockedGetStockList = jest.mocked(GetStockList)

jest.mock("../api/getMarketNews")
const mockedGetMarketNews = jest.mocked(getMarketNews)

jest.mock("../api/getTrendingStocks")
const mockedGetTrendingList = jest.mocked(getTrendingStocks)

jest.mock("../api/getStockPrice")
const mockedGetStockPrice = jest.mocked(getStockPrice)

describe("useHomeData tests", () => {

    test("fetches data correctly", async () => {

        mockedGetStockList.mockResolvedValue(mockStockList)
        mockedGetMarketNews.mockResolvedValue(mockMarketNews)
        mockedGetTrendingList.mockResolvedValue(mockTrendingStocks)

        const { result } = renderHook(() => useHomeData())

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.data.stockList).toEqual(mockStockList)
        expect(result.current.data.marketNews).toEqual(mockMarketNews)
        expect(result.current.data.trendingList).toEqual(mockTrendingStocks)

    })

    test("fetch data resolves err as ApiError", async () => {

        mockedGetStockList.mockRejectedValue(new ApiError(404))

        const { result } = renderHook(() => useHomeData())

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.ErrorCode).toBe(404)
    })

    test("fetch data resolves err as number", async () => {

        mockedGetMarketNews.mockRejectedValue(429)

        const { result } = renderHook(() => useHomeData())

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.ErrorCode).toBe(429)
    })

    test("fetch data resolves err as -1 with everything else", async () => {
        
        mockedGetTrendingList.mockRejectedValue("random error")

        const { result } = renderHook(() => useHomeData())

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.ErrorCode).toBe(-1)
    })

    test("clearErrCode works correctly", async () => {

        mockedGetStockList.mockRejectedValue(422)

        const { result } = renderHook(() => useHomeData())

        await waitFor(() => {
            expect(result.current.ErrorCode).toBe(422)
        })

        await waitFor(() => {
            result.current.clearErrCode()
        })

        expect(result.current.ErrorCode).toBeNull()
    })

    test("search stock calls navigate", async () => {

        mockedGetStockPrice.mockResolvedValue(100)

        const { result } = renderHook(() => useHomeData())

        await act(async () => {
            result.current.searchStock("AAPL")
        })

        expect(mockNavigate).toHaveBeenCalledWith("/stock/AAPL",
            {
                state: { stockPrice: 100 }
            }
        )
    })

    test("search stock APIError", async () => {
        mockedGetStockPrice.mockRejectedValue(new ApiError(1499))

        const { result } = renderHook(() => useHomeData())

        await act(async () => {
            result.current.searchStock("NVDA")
        })

        expect(result.current.ErrorCode).toBe(1499)
    })

    test("search stock other error", async () => {
        mockedGetStockPrice.mockRejectedValue(new Error("RndErr"))

        const { result } = renderHook(() => useHomeData())

        await act(async () => {
            result.current.searchStock("MSFT")
        })

        expect(result.current.ErrorCode).toBe(-1)
    })
})