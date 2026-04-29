import { act, renderHook, waitFor } from "@testing-library/react"
import getStockHistory from "../../api/getStockHistory"
import { mockHistory } from "../../mocks/StockDetails/mockHistory"
import { useStockDetailsOverview } from "./useStockDetailsOverview"
import { ApiError } from "../../error/ApiError"
import { StockDetailsHistoryItem } from "../../types/types"

jest.mock("../../api/getStockHistory")
const mockedGetStockHistory = jest.mocked(getStockHistory)

describe("useStockDetailsOverview tests", () => {

    const args = {
        symbol: "TEST",
        handleError: jest.fn()
    }
    
    test("successfully fetches stock history", async () => {

        mockedGetStockHistory.mockResolvedValue(mockHistory)

        const { result } = renderHook(() => useStockDetailsOverview(args))

        await act(async () => {
            await result.current.getHistory()
        })

        expect(mockedGetStockHistory).toHaveBeenCalledWith(args.symbol)
        expect(result.current.history).toEqual([...mockHistory].reverse())

    })

    test("error calls the right function", async() => {

        const err = new ApiError(123)
        const handleErr = jest.fn()

        mockedGetStockHistory.mockRejectedValue(err)

        const { result } = renderHook(() => useStockDetailsOverview({...args, handleError: handleErr}))

        await act(async () => {
            await result.current.getHistory()
        })

        expect(handleErr).toHaveBeenCalledWith(err)
    })

    test("sets loading correctly during fetch", async () => {

        mockedGetStockHistory.mockResolvedValue(mockHistory)

        const { result } = renderHook(() => useStockDetailsOverview(args))

        act(() => {
            result.current.getHistory()
        })

        await waitFor(() => {
            expect(result.current.overviewLoading).toBe(true)
        })

        await waitFor(() => {
            expect(result.current.overviewLoading).toBe(false)
        })
    })

    test("filters history by week", async () => {
        const now = Date.now()

        const data = [
            { datetime: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { datetime: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() },
        ]

        mockedGetStockHistory.mockResolvedValue(data as StockDetailsHistoryItem[])

        const { result } = renderHook(() => useStockDetailsOverview(args))

        await act(async () => {
            await result.current.getHistory()
        })

        act(() => {
            result.current.filterHistory("week")
        })

        expect(result.current.history.length).toBe(1)
    })

    test("filterHistory - all resets to full history", async () => {

        mockedGetStockHistory.mockResolvedValue(mockHistory)

        const { result } = renderHook(() =>
            useStockDetailsOverview(args)
        )

        await act(async () => {
            await result.current.getHistory()
        })

        act(() => {
            result.current.filterHistory("all")
        })

        expect(result.current.history).toEqual([...mockHistory].reverse())
    })

    test("undefined symbol calls handleErrror", async () => {

        const handleErr = jest.fn()
        
        const { result } = renderHook(() => useStockDetailsOverview({...args, symbol: undefined, handleError: handleErr}))

        await act(async () => {
            await result.current.getHistory()
        })

        expect(handleErr).toHaveBeenCalledWith(expect.any(ApiError))
    })
})