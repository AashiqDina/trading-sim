import { act, renderHook, waitFor } from "@testing-library/react"
import getStockImage from "../../api/getStockImage"
import getStockName from "../../api/getStockName"
import buyStockService from "../../services/buyStockService"
import { useStockDetails } from "./useStockDetails"
import { ApiError } from "../../error/ApiError"

jest.mock("../../api/getStockImage")
const mockedGetStockImage = jest.mocked(getStockImage)

jest.mock("../../api/getStockName")
const mockedGetStockName = jest.mocked(getStockName)

jest.mock("../../services/buyStockService")
const mockedBuyStockService = jest.mocked(buyStockService)

const args = { 
    userId: 1, 
    stockSymbol: "TEST", 
    handleError: jest.fn()
}

describe("useStockDetails Tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Correct name and image returned", async () => {

        mockedGetStockName.mockResolvedValue("TestStockName")
        mockedGetStockImage.mockResolvedValue("TestStockImage")

        const { result } = renderHook(() => useStockDetails(args))

        await waitFor(() => {
            expect(result.current.baseLoading).toBe(false)
        })

        expect(mockedGetStockName).toHaveBeenCalledWith("TEST")
        expect(mockedGetStockImage).toHaveBeenCalledWith("TEST")
        expect(result.current.stockName).toBe("TestStockName")
        expect(result.current.stockLogo).toBe("TestStockImage")

    })

    test("handleError is called when an error occurs", async () => {

        const err = new ApiError(123)
        const handleErr = jest.fn()

        mockedGetStockName.mockRejectedValue(err)

        const { result } = renderHook(() => useStockDetails({ ...args, handleError: handleErr}))

        await waitFor(() => {
            expect(result.current.baseLoading).toBe(false)
        })

        expect(handleErr).toHaveBeenCalledWith(err)
    })

    test("handleBuy successfully calls function and sets correct variables", async () => {

        mockedBuyStockService.mockResolvedValue(undefined)

        const { result } = renderHook(() => useStockDetails(args))

        await act(async() => {
            await result.current.handleBuyStock(10, "20")
        })

        expect(mockedBuyStockService).toHaveBeenCalledWith({
            userId: 1,
            stockPrice: 10,
            stockSymbol: "TEST",
            quantity: 20
        })

        expect(result.current.showConfetti).toBe(true);
        expect(result.current.buyModalOpen).toBe(false);
    })

    test("handles first err case", async () => {

        const handleErr = jest.fn()
        mockedBuyStockService.mockResolvedValue(undefined)

        const { result } = renderHook(() => useStockDetails({...args, handleError: handleErr}))

        await act(async() => {
           await result.current.handleBuyStock(10, "Wrong")
        })

        expect(mockedBuyStockService).not.toHaveBeenCalled();
        expect(handleErr).toHaveBeenCalledWith(expect.any(ApiError))
    })

    test("handles second err case", async () => {

        const handleErr = jest.fn()
        mockedBuyStockService.mockResolvedValue(undefined)

        const { result } = renderHook(() => useStockDetails({...args, userId: undefined, handleError: handleErr}))

        await act(async () => {
            await result.current.handleBuyStock(10, "10")
        })

        expect(mockedBuyStockService).not.toHaveBeenCalled();
        expect(handleErr).toHaveBeenCalledWith(expect.any(ApiError))
    })

    test("handles other errors correctly", async () => {
               
        const handleErr = jest.fn()
        mockedBuyStockService.mockRejectedValue(new ApiError(404))

        const { result } = renderHook(() => useStockDetails({...args, handleError: handleErr}))

        await act(async () => {
            await result.current.handleBuyStock(10, "10")
        })

        expect(handleErr).toHaveBeenCalled()
    })

    test("changeBuyModal works correctly", () => {

        const { result } = renderHook(() => useStockDetails(args))

        expect(result.current.buyModalOpen).toBe(false)

        act(() => {
            result.current.changeBuyModal()
        })

        expect(result.current.buyModalOpen).toBe(true)

    })
    
})