import { act, renderHook, waitFor } from "@testing-library/react"
import getCompanyInformation from "../../api/getCompanyInformation"
import { mockCompanyInformation } from "../../mocks/StockDetails/mockCompanyInfortmation"
import { useStockDetailsInfo } from "./useStockDetailsInfo"
import { ApiError } from "../../error/ApiError"

jest.mock("../../api/getCompanyInformation")
const mockedGetCompanyInfo = jest.mocked(getCompanyInformation)

describe("useStockDetailsInfo tests", () => {

    const args = {
        symbol: "TEST",
        handleError: jest.fn()
    }

    const CompInfoResolVal = {
        ...mockCompanyInformation,
          address2: "",
          micCode: "XNAS",
    }

    test("successfully gets data", async () => {

        mockedGetCompanyInfo.mockResolvedValue(CompInfoResolVal)

        const { result } = renderHook(() => useStockDetailsInfo(args))

        await act(async () => {
            await result.current.fetchStocksInfo()
        })

        expect(mockedGetCompanyInfo).toHaveBeenCalledWith({"symbol": "TEST"})
        expect(result.current.companyInformation).toEqual(CompInfoResolVal)

    })

    test("data fail handles error correctly", async () => {

        const err = new ApiError(-1)
        const handleErr = jest.fn()
        mockedGetCompanyInfo.mockRejectedValue(err)

        const { result } = renderHook(() => useStockDetailsInfo({...args, handleError: handleErr}))

        await act(async () => {
            await result.current.fetchStocksInfo()
        }) 

        expect(handleErr).toHaveBeenCalledWith(err)
    })

    test("sets loading correctly during fetch", async () => {

        mockedGetCompanyInfo.mockResolvedValue(CompInfoResolVal)

        const { result } = renderHook(() => useStockDetailsInfo(args))

        act(() => {
            result.current.fetchStocksInfo()
        })

        await waitFor(() => {
            expect(result.current.infoLoading).toBe(true)
        })

        await waitFor(() => {
            expect(result.current.infoLoading).toBe(false)
        })
    })
})