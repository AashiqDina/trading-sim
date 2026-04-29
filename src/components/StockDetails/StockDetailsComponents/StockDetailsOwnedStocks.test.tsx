import { render, screen, within } from "@testing-library/react"
import StockDetailsOwnedStocks from "./StockDetailsOwnedStocks"
import "@testing-library/jest-dom"
import { useStockDetailsOwnedStocks } from "../../../hooks/stockDetails/useStockDetailsOwnedStocks";
import { mockPortfolioStocks } from "../../../mocks/Portfolio/mockPortfolioStocks";
import { mockLastUpdated } from "../../../mocks/StockDetails/mockLastUpdated";

jest.mock("../../../hooks/stockDetails/useStockDetailsOwnedStocks", () => ({
    useStockDetailsOwnedStocks: jest.fn(),
}));

const mockedUseStockDetailsOwnedStocks = useStockDetailsOwnedStocks as jest.Mock;

describe("Owned Stocks Tests", () => {

    beforeEach(() => {
        mockedUseStockDetailsOwnedStocks.mockReturnValue({
            ownedStocksLoading: false,
            ownedStocks: mockPortfolioStocks.filter(
                stock => stock.symbol === "symbol_1"),
            lastUpdated: mockLastUpdated,
            fetchOwnedStocks: jest.fn(),
        });
    });

    test("Loading state renders correctly", () => {


        mockedUseStockDetailsOwnedStocks.mockReturnValue({
            ownedStocksLoading: true,
            ownedStocks: [],
            lastUpdated: new Map(),
            fetchOwnedStocks: jest.fn(),
        })

        render(
            <StockDetailsOwnedStocks
                user={undefined}
                symbol={""}
                handleError={jest.fn()}
            />
        )

        expect(screen.getByTestId(/loading/i)).toBeInTheDocument();
    })

    test("Renders no owned stocks correctly", () => {

        const mockFetchOwnedStocks = jest.fn();

        mockedUseStockDetailsOwnedStocks.mockReturnValue({
            ownedStocksLoading: false,
            ownedStocks: [],
            lastUpdated: new Map(),
            fetchOwnedStocks: mockFetchOwnedStocks,
        })

        render(
            <StockDetailsOwnedStocks
                user={undefined}
                symbol={""}
                handleError={jest.fn()}
            />
        )

        expect(mockFetchOwnedStocks).toHaveBeenCalledTimes(1);
        expect(screen.getByText(/You don't own any stocks from this company/i)).toBeInTheDocument();

    })

    test("Renders owned stocks correctly", () => {
        render(
            <StockDetailsOwnedStocks
                user={undefined}
                symbol={"symbol_1"}
                handleError={jest.fn()}
            />
        );

        const filteredStocks = mockPortfolioStocks.filter(
            stock => stock.symbol === "symbol_1"
        );

        filteredStocks.forEach((stock) => {
            const row = screen.getByText(stock.name).closest("tr");

            expect(within(row!).getByText(stock.name)).toBeInTheDocument();
            expect(within(row!).getByText(`Quantity: ${stock.quantity}`)).toBeInTheDocument();

            const bought = `£${(stock.purchasePrice * stock.quantity).toFixed(2)}`;
            const current = `£${(stock.currentPrice * stock.quantity).toFixed(2)}`;

            expect(within(row!).getByText(bought)).toBeInTheDocument();
            expect(within(row!).getByText(current)).toBeInTheDocument();
        });
    });

    test("last updated times render correctly", () => {
        render(
            <StockDetailsOwnedStocks
                user={undefined}
                symbol={"symbol_1"}
                handleError={jest.fn()}
            />
        );

        const filteredStocks = mockPortfolioStocks.filter(
            stock => stock.symbol === "symbol_1"
        );

        filteredStocks.forEach(stock => {
            const row = screen.getByText(stock.name).closest("tr");

            const lastUpdated = mockLastUpdated.get(stock.symbol);

            if (lastUpdated) {
                expect(within(row!).getByText(/Updated/i)).toBeInTheDocument();
            } else {
                expect(within(row!).getByText(/N\/A/i)).toBeInTheDocument();
            }
        });
    });
})