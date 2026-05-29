import { renderHook, act } from "@testing-library/react"
import { mockedFullHistory } from "../../mocks/Portfolio/mockedFullHistory"
import { mockedPortfolio } from "../../mocks/Portfolio/mockedPortfolio"
import { mockLastUpdatedPortfolioDictionary } from "../../mocks/Portfolio/mockTableStocks"
import { usePortfolioActions } from "./usePortfolioActions"
import { usePortfolioData } from "./usePortfolioData"
import { usePortfolio } from "./usePortfolio"

jest.mock("./usePortfolioData")
const mockedUsePortfolioData = jest.mocked(usePortfolioData)

jest.mock("./usePortfolioActions")
const mockedUsePortfolioActions = jest.mocked(usePortfolioActions)

const baseData = {
    portfolio: mockedPortfolio,
    fullHistory: mockedFullHistory,
    loading: false,
    dataErrorCode: null,
    resetDatasError: jest.fn(),
    refreshPortfolio: jest.fn(),
    LastUpdatedDictionary: mockLastUpdatedPortfolioDictionary
}

const baseActions = {
    handleDeleteStock: jest.fn(),
    handleDeleteUser: jest.fn(),
    actionsErrorCode: null,
    resetActionsError: jest.fn(),
}

describe("UsePortfolio Tests", () => {

    beforeEach(() => {
        mockedUsePortfolioData.mockReturnValue(
            baseData
        )

        mockedUsePortfolioActions.mockReturnValue(
            baseActions
        )
    })

    test("data is correctly passed", () => {

        const { result } = renderHook(() => usePortfolio({userId: 1}))

        expect(result.current.portfolio).toEqual(mockedPortfolio)
        expect(result.current.fullHistory).toEqual(mockedFullHistory)
        expect(result.current.loading).toEqual(false)
        expect(result.current.errorCode).toBeNull()
        expect(result.current.LastUpdatedDictionary).toEqual(mockLastUpdatedPortfolioDictionary)
        expect(typeof result.current.handleDeleteStock).toBe("function");
        expect(typeof result.current.refreshPortfolio).toBe("function");
        expect(typeof result.current.resetError).toBe("function");

    })

    test("errorCode Prioritises data Errror", () => {

        mockedUsePortfolioData.mockReturnValue({
            ...baseData,
            dataErrorCode: 404
        })

        mockedUsePortfolioActions.mockReturnValue({
            ...baseActions,
            actionsErrorCode: 429
        })

        const { result } = renderHook(() => usePortfolio({userId: 1})) 

        expect(result.current.errorCode).toBe(404)

    })

    test("errorCode falls back to actions err if no data err", () => {

        mockedUsePortfolioActions.mockReturnValue({
            ...baseActions,
            actionsErrorCode: 404
        })

        const { result } = renderHook(() => usePortfolio({userId: 1}))

        expect(result.current.errorCode).toBe(404)
    })

    test("resetError calls the correct functions", () => {

        const resetDataErr = jest.fn()
        const resetActionErr = jest.fn()

        mockedUsePortfolioData.mockReturnValue({
            ...baseData,
            resetDatasError: resetDataErr
        })

        mockedUsePortfolioActions.mockReturnValue({
            ...baseActions,
            resetActionsError: resetActionErr
        })

        const { result } = renderHook(() => usePortfolio({userId: 1}))

        result.current.resetError()

        act(() => {
            result.current.resetError()
        })

        expect(resetActionErr).toHaveBeenCalled()
        expect(resetDataErr).toHaveBeenCalled()
    })
})