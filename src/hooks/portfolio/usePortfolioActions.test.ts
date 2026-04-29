import { act, renderHook } from "@testing-library/react"
import deleteStock from "../../api/deleteStock"
import { usePortfolioActions } from "./usePortfolioActions"
import { ApiError } from "../../error/ApiError"


jest.mock("../../api/deleteStock")
const mockedDeleteStock = deleteStock as jest.Mock

describe("usePortfolioActions tests", () => {

    test("handle delete success path works correctly", async () => {

        mockedDeleteStock.mockResolvedValue(undefined)

        const { result } = renderHook(() => usePortfolioActions())

        var response

        await act(async () => {
            response = await result.current.handleDeleteStock(1, 3)
        })

        expect(mockedDeleteStock).toHaveBeenCalledWith(1, 3)
        expect(response).toBe(true)
        expect(result.current.actionsErrorCode).toBeNull()

    })

    test("handles delete catch err with ApiError", async () => {

        mockedDeleteStock.mockRejectedValue(new ApiError(404))

        const { result } = renderHook(() => usePortfolioActions())

        var response

        await act(async () => {
            response = await result.current.handleDeleteStock(1, 10)
        })

        expect(result.current.actionsErrorCode).toBe(404)
        expect(response).toBe(false)
    })

    test("handles delete catch with unknown error", async () => {

        mockedDeleteStock.mockRejectedValue(["Rnd Err"])

        const { result } = renderHook(() => usePortfolioActions())

        await act(async () => {
            await result.current.handleDeleteStock(1, 33)
        })

        expect(result.current.actionsErrorCode).toBe(-1)
    })

    test("resetActionError resets error", async () => {

        mockedDeleteStock.mockRejectedValue(new ApiError(429))

        const { result } = renderHook(() => usePortfolioActions())

        await act(async () => {
            await result.current.handleDeleteStock(1,50)
        })

        expect(result.current.actionsErrorCode).toBe(429)

        act(() => {
            result.current.resetActionsError()
        })

        expect(result.current.actionsErrorCode).toBeNull()
    })

})