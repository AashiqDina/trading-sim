import { act, renderHook, waitFor } from "@testing-library/react"
import getStockNews from "../../api/getStockNews"
import { mockMarketNews } from "../../mocks/Home/mockMarketNews"
import { useStockDetailsNews } from "./useStockDetailsNews"
import { ApiError } from "../../error/ApiError"

jest.mock("../../api/getStockNews")
const mockedGetStockNews = jest.mocked(getStockNews)

describe("useStockDetailsNews tests", () => {

    const args = {
        symbol: "TEST",
        handleError: jest.fn()
    }

    test("successfully gets data", async () => {

        mockedGetStockNews.mockResolvedValue(mockMarketNews)

        const { result } = renderHook(() => useStockDetailsNews(args))

        await act(async () => {
            await result.current.fetchStockNews()
        })

        expect(mockedGetStockNews).toHaveBeenCalledWith({"symbol": "TEST"})
        expect(result.current.marketNews).toEqual(mockMarketNews)
    })

    test("data fail handles error correctly", async () => {

        const err = new ApiError(101)
        const handleErr = jest.fn()

        mockedGetStockNews.mockRejectedValue(err)

        const { result } = renderHook(() => useStockDetailsNews({...args, handleError: handleErr}))

        await act(async () => {
            await result.current.fetchStockNews()
        })

        expect(handleErr).toHaveBeenCalledWith(err)
    })

    test("sets loading correctly during fetch", async () => {

        mockedGetStockNews.mockResolvedValue(mockMarketNews)

        const { result } = renderHook(() => useStockDetailsNews(args))

        act(() => {
            result.current.fetchStockNews()
        })

        await waitFor(() => {
            expect(result.current.newsLoading).toBe(true)
        })

        await waitFor(() => {
            expect(result.current.newsLoading).toBe(false)
        })
    })
})