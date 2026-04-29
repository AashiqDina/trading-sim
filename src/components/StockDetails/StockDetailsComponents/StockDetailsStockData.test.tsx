import { render, screen } from "@testing-library/react";
import StockDetailsStockData from "./StockDetailsStockData";
import "@testing-library/jest-dom";
import { useStockDetailsData } from "../../../hooks/stockDetails/useStockDetailsData";
import { mockStockQuoteData } from "../../../mocks/StockDetails/mockStockQuoteData";

jest.mock("../../../hooks/stockDetails/useStockDetailsData", () => ({
    useStockDetailsData: jest.fn(),
}));

const mockedUseStockDetailsData = useStockDetailsData as jest.Mock;

describe("Stocks Details StocksData Tests", () => {

    const mockGetStocksData = jest.fn();

    beforeEach(() => {
        mockedUseStockDetailsData.mockReturnValue({
            dataLoading: false,
            stockData: mockStockQuoteData,
            stockDataLastUpdated: "2024-01-01T10:00:00Z",
            fetchStocksData: mockGetStocksData,
        });
    });

    test("renders the stock data section correctly", () => {
        render(
            <StockDetailsStockData
                symbol="AAPL"
                stockPrice={150}
                handleError={jest.fn()}
            />
        );

        expect(mockGetStocksData).toHaveBeenCalledTimes(1);

        expect(screen.getByText(/Market Open/i)).toBeInTheDocument();
        expect(screen.getByText(/Last Updated: 01\/01\/24, 10:00/i)).toBeInTheDocument();
        expect(screen.getByText(/Daily Range/i)).toBeInTheDocument();
        expect(screen.getByText(/£179.00/i)).toBeInTheDocument();
        expect(screen.getByText(/£185.00/i)).toBeInTheDocument();
        expect(screen.getByText(/50M/i)).toBeInTheDocument();
        expect(screen.getByText(/52M/i)).toBeInTheDocument();
        expect(screen.getByText(/£140.00/i)).toBeInTheDocument();
        expect(screen.getByText(/£190.00/i)).toBeInTheDocument();
        expect(screen.getByText(/£183.00/i)).toBeInTheDocument();
        expect(screen.getAllByText(/£180.00/i)).toHaveLength(2);


    })

    test("renders loading state correctly", () => {
        mockedUseStockDetailsData.mockReturnValue({
            dataLoading: true,
            stockData: null,
            stockDataLastUpdated: null,
            fetchStocksData: jest.fn(),
        })
    
        render(
            <StockDetailsStockData
                symbol="AAPL"
                stockPrice={150}
                handleError={jest.fn()}
            />
        );

        expect(screen.getByTestId(/loading/i)).toBeInTheDocument();
    })

    test("renders error message when stock data is not available", () => {
        mockedUseStockDetailsData.mockReturnValue({
            dataLoading: false,
            stockData: null,
            stockDataLastUpdated: null,
            fetchStocksData: jest.fn(),
        });

        render(
            <StockDetailsStockData
                symbol="AAPL"
                stockPrice={150}
                handleError={jest.fn()}
            />
        );

        expect(screen.getByText(/Stock data not available/i)).toBeInTheDocument();
    })

    test("renders market closed state correctly", () => {
        mockedUseStockDetailsData.mockReturnValue({
            dataLoading: false,
            stockData: { ...mockStockQuoteData, isMarketOpen: false },
            stockDataLastUpdated: "2024-01-01T10:00:00Z",
            fetchStocksData: jest.fn(),
        });

        render(<StockDetailsStockData symbol="AAPL" stockPrice={150} handleError={jest.fn()} />);

        expect(screen.getByText(/Market Closed/i)).toBeInTheDocument();
    });

    test("renders N/A when last updated is missing", () => {
        mockedUseStockDetailsData.mockReturnValue({
            dataLoading: false,
            stockData: mockStockQuoteData,
            stockDataLastUpdated: null,
            fetchStocksData: jest.fn(),
        });

        render(<StockDetailsStockData symbol="AAPL" stockPrice={150} handleError={jest.fn()} />);

        expect(screen.getByText(/Last Updated:/i)).toBeInTheDocument();
        expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
    });
})