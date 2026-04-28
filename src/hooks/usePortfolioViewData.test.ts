import { renderHook } from "@testing-library/react"
import { usePortfolioViewData } from "./usePortfolioViewData"
import { mockedPortfolio } from "../mocks/Portfolio/mockedPortfolio"
import { mockedFullHistory } from "../mocks/Portfolio/mockedFullHistory"
import { createPortfolioTables } from "../utils/createPortfolioTable";
import { createRecentHistoryMocks } from "../utils/createRecentHistoryMocks"

jest.mock("../utils/createPortfolioTable");
const mockCreatePortfolioTables = jest.mocked(createPortfolioTables);

describe("usePortfolioViewData Tests", () => {

    const args = {
        portfolio: mockedPortfolio,
        searchInput: "",
        FilteredOption: "Newest",
        fullHistory: mockedFullHistory,
        filterHistory: "all"
    }

    test("falsey portfolio stocks gives empty array when transformed into visible stocks", () => {

        const { result } = renderHook(() => usePortfolioViewData({
            ...args,
            portfolio: {
                ...args.portfolio,
                stocks: []
            }
        }))

        expect(result.current.visibleStocks).toEqual([])
    })

    test("filters search by input", () => {

        const { result } = renderHook(() => usePortfolioViewData({
            ...args,
            searchInput: "1"
        }))

        expect(result.current.visibleStocks.every(stock => stock.name.includes("1") || stock.symbol.includes("1"))).toBe(true)
    })

    test("sort by profit desc", () => {

        const { result } = renderHook(() => usePortfolioViewData({
            ...args,
            FilteredOption: "ProfitDesc"
        }))

        expect(result.current.visibleStocks).toEqual([...mockedPortfolio.stocks].sort((a, b) => b.profitLoss - a.profitLoss))
    })

    test("tableStocks calls right function", () => {

        mockCreatePortfolioTables.mockReturnValue([])

        const { result } = renderHook(() => usePortfolioViewData(args))

        expect(mockCreatePortfolioTables).toHaveBeenCalledWith(result.current.visibleStocks)
    })

    test("returns full history when filter is all", () => {
        const { result } = renderHook(() => usePortfolioViewData({
                ...args,
                filterHistory: "all",
            })
        );

        expect(result.current.history).toEqual(mockedFullHistory);
    });

    test("filters history by week", () => {

        const fullHistory = createRecentHistoryMocks();

        const { result } = renderHook(() => usePortfolioViewData({
                ...args,
                fullHistory,
                filterHistory: "week",
            })
        );

        expect(result.current.history?.[0].history.length).toBe(1);
    });

    test("returns null when no history", () => {

        const { result } = renderHook(() => usePortfolioViewData({
                ...args,
                fullHistory: null,
            })
        );

        expect(result.current.history).toBeNull();
    });

    

})