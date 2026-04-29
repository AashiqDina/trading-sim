import { act, renderHook, waitFor } from "@testing-library/react"
import getStockApiInfo from "../../api/getStockApiInfo"
import getStockInfoLastUpdated from "../../api/getStockInfoLastUpdated"
import { mockLastUpdated } from "../../mocks/StockDetails/mockLastUpdated"
import { mockStockQuoteData } from "../../mocks/StockDetails/mockStockQuoteData"
import { useStockDetailsData } from "./useStockDetailsData"
import { ApiError } from "../../error/ApiError"

jest.mock("../../api/getStockApiInfo")
const mockedGetStockInfo = jest.mocked(getStockApiInfo)

jest.mock("../../api/getStockInfoLastUpdated")
const mockedGetStockInfoLastUpdated = jest.mocked(getStockInfoLastUpdated) 

describe("useStockDetailsData tests", () => {

    const args = {
        symbol: "TEST",
        handleError: jest.fn()
    }

    test("successfully gets data", async () => {

        mockedGetStockInfo.mockResolvedValue(mockStockQuoteData)
        mockedGetStockInfoLastUpdated.mockResolvedValue(mockLastUpdated)

        const { result } = renderHook(() => useStockDetailsData(args))

        await act(async () => {
            await result.current.fetchStocksData()
        })

        expect(mockedGetStockInfoLastUpdated).toHaveBeenCalledWith("TEST")
        expect(mockedGetStockInfo).toHaveBeenCalledWith({"symbol": "TEST"})
        expect(result.current.stockData).toEqual(mockStockQuoteData)
        expect(result.current.stockDataLastUpdated).toEqual(mockLastUpdated)
    })

    test("data fail handles error correctly", async () => {

        const err = new ApiError(404)
        const handleErr = jest.fn()
        mockedGetStockInfo.mockRejectedValue(err)

        const { result } = renderHook(() => useStockDetailsData({...args, handleError: handleErr}))

        await act(async () => {
            await result.current.fetchStocksData()
        }) 

        expect(handleErr).toHaveBeenCalledWith(err)
    })

    test("sets loading correctly during fetch", async () => {

        mockedGetStockInfo.mockResolvedValue(mockStockQuoteData)

        const { result } = renderHook(() => useStockDetailsData(args))

        act(() => {
            result.current.fetchStocksData()
        })

        await waitFor(() => {
            expect(result.current.dataLoading).toBe(true)
        })

        await waitFor(() => {
            expect(result.current.dataLoading).toBe(false)
        })
    })

})