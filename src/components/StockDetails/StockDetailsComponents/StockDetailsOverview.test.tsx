import { render, screen } from "@testing-library/react";
import { useStockDetailsOverview } from "../../../hooks/useStockDetailsOverview";
import "@testing-library/jest-dom"
import StockDetailsOverview from "./StockDetailsOverview";
import { mockHistory } from "../../../mocks/StockDetails/mockHistory";
import { userEvent } from "@testing-library/user-event";

jest.mock("../../../hooks/useStockDetailsOverview", () => ({
    useStockDetailsOverview: jest.fn(),
}));

const mockedUseStockDetailsOverview = useStockDetailsOverview as jest.Mock;


describe("StockDetailsOverview Tests", () => {

    beforeEach(() => {
        mockedUseStockDetailsOverview.mockReturnValue({
            overviewLoading: false,
            history: mockHistory,
            getHistory: jest.fn(),
            filterHistory: jest.fn(),
        });
    });

    test("renders loading state correctly", () => {

        mockedUseStockDetailsOverview.mockReturnValue({
            overviewLoading: true,
            history: null,
            getHistory: jest.fn(),
            filterHistory: jest.fn(),
        })

        render(
            <StockDetailsOverview
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );

        expect(screen.getByTestId(/loading/i)).toBeInTheDocument();
    })

    test("renders historical data not available state correctly", () => {

        mockedUseStockDetailsOverview.mockReturnValue({
            overviewLoading: false,
            history: [],
            getHistory: jest.fn(),
            filterHistory: jest.fn(),
        })

        render(
            <StockDetailsOverview
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );

        expect(screen.getByText(/Historical data not available/i)).toBeInTheDocument();

    })

    test("renders graph when history is available", () => {

        render(
            <StockDetailsOverview
                symbol="AAPL"
                handleError={jest.fn()}
            />
        )

        expect(screen.getByRole("img")).toBeInTheDocument();
    })

    test("calls getHistory and fetchStockOverview on mount", () => {

        const mockGetHistory = jest.fn();

        mockedUseStockDetailsOverview.mockReturnValue({
            overviewLoading: false,
            history: mockHistory,
            getHistory: mockGetHistory,
            filterHistory: jest.fn(),
        });

        render(
            <StockDetailsOverview
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );

        expect(mockGetHistory).toHaveBeenCalledTimes(1);
    })

    test("clicking filters calls filterHistory with correct parameters", async () => {
        const mockFilterHistory = jest.fn();

        mockedUseStockDetailsOverview.mockReturnValue({
            overviewLoading: false,
            history: mockHistory,
            getHistory: jest.fn(),
            filterHistory: mockFilterHistory,
        });

        render(
            <StockDetailsOverview
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );

        const weekButton = screen.getByRole("button", { name: /week/i });
        const monthButton = screen.getByRole("button", {
            name: "filter to the last month",
        });        
        const yearButton = screen.getByRole("button", {
            name: "filter to the last year",
        });
        const allButton = screen.getByRole("button", { name: /all/i });
        
        expect(weekButton).toBeInTheDocument();
        expect(monthButton).toBeInTheDocument();
        expect(yearButton).toBeInTheDocument();
        expect(allButton).toBeInTheDocument();

        await userEvent.click(weekButton);
        expect(mockFilterHistory).toHaveBeenCalledWith("week");
        await userEvent.click(monthButton);
        expect(mockFilterHistory).toHaveBeenCalledWith("month");
        await userEvent.click(yearButton);
        expect(mockFilterHistory).toHaveBeenCalledWith("year");
        await userEvent.click(allButton);
        expect(mockFilterHistory).toHaveBeenCalledWith("all");
    })

    test("Default filter is 'all'", () => {
        render(
            <StockDetailsOverview
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );

        const allButton = screen.getByRole("button", { name: /all time/i });

        expect(allButton).toHaveStyle("background-color: rgb(76, 175, 80)");
    });

})