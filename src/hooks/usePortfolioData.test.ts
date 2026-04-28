import getHistory from "../api/getHistory"
import getPortfolio from "../api/getPortfolio"
import getAllStocksLastUpdated from "../api/getAllStocksLastUpdated"
import { mockedFullHistory } from "../mocks/Portfolio/mockedFullHistory"
import { mockedPortfolio } from "../mocks/Portfolio/mockedPortfolio"
import { act, renderHook, waitFor } from "@testing-library/react"
import { usePortfolioData } from "./usePortfolioData"
import updateAllStocksInPortfolio from "../api/UpdateStocksInPortfolio"
import { ApiError } from "../error/ApiError"


jest.mock("../api/getPortfolio")
const mockedGetPortfolio = jest.mocked(getPortfolio)

jest.mock("../api/getHistory")
const mockedGetHistory = jest.mocked(getHistory)

jest.mock("../api/getAllStocksLastUpdated")
const mockedGetUpdateStocksList = jest.mocked(getAllStocksLastUpdated)

jest.mock("../api/UpdateStocksInPortfolio")
const mockedUpdateStocks = jest.mocked(updateAllStocksInPortfolio)

const mockedPortLastUpdated = {
    AAPL: "2024-01-01",
    TSLA: "2024-01-02",
}

describe("usePortfolioData tests", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("fetches data successfully", async () => {

        mockedGetPortfolio.mockResolvedValue(mockedPortfolio)
        mockedGetHistory.mockResolvedValue(mockedFullHistory)
        mockedGetUpdateStocksList.mockResolvedValue(mockedPortLastUpdated)
        mockedUpdateStocks.mockResolvedValue(undefined)

        const { result } = renderHook(() => usePortfolioData({userId: 1}))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })


        expect(result.current.portfolio).toEqual(mockedPortfolio)
        expect(result.current.fullHistory).toEqual(mockedFullHistory)
        expect(result.current.LastUpdatedDictionary).toBeInstanceOf(Map)
        expect(mockedUpdateStocks).toHaveBeenCalledWith({userId: 1})
    })

    test("handles ApiError successfully", async () => {

        mockedGetPortfolio.mockRejectedValue(new ApiError(404))

        const { result } = renderHook(() => usePortfolioData({userId: 1}))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.dataErrorCode).toBe(404)
    })

    test("handles unknown error successfully", async () => {

        mockedGetHistory.mockRejectedValue({ Error: "random error"})

        const { result } = renderHook(() => usePortfolioData({ userId: 1}))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.dataErrorCode).toBe(-1)
    })

    test("no user returns", () => {

        const { result } = renderHook(() => usePortfolioData({userId: undefined}))

        expect(mockedGetPortfolio).not.toHaveBeenCalled()
        expect(mockedGetHistory).not.toHaveBeenCalled()
        expect(mockedGetUpdateStocksList).not.toHaveBeenCalled()
        expect(mockedUpdateStocks).not.toHaveBeenCalled()
    })

    test("refreshPortfolio refetches data", async () => {

        mockedGetPortfolio.mockResolvedValue(mockedPortfolio)
        mockedGetHistory.mockResolvedValue(mockedFullHistory)

        const { result } = renderHook(() => usePortfolioData({userId: 1}))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        mockedGetPortfolio.mockClear()
        mockedGetHistory.mockClear()

        await result.current.refreshPortfolio()

        expect(result.current.portfolio).toEqual(mockedPortfolio)
        expect(result.current.fullHistory).toEqual(mockedFullHistory)

    })

    test("resetDatasError resets errCode", async () => {

        mockedGetPortfolio.mockRejectedValue(new ApiError(404))

        const { result } = renderHook(() => usePortfolioData({userId: 1}))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.dataErrorCode).toBe(404)

        act(() => {
            result.current.resetDatasError()
        })

        expect(result.current.dataErrorCode).toBeNull()
    })
})
