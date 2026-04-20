import { render, screen, within } from "@testing-library/react"
import StockDetailsOwnedStocks from "./StockDetailsOwnedStocks"
import "@testing-library/jest-dom"
import { useStockDetailsOwnedStocks } from "../../../hooks/useStockDetailsOwnedStocks";
import { mockPortfolioStocks } from "../../../mocks/Portfolio/mockPortfolioStocks";
import { mockLastUpdated } from "../../../mocks/StockDetails/mockLastUpdated";

jest.mock("../../../hooks/useStockDetailsOwnedStocks", () => ({
    useStockDetailsOwnedStocks: jest.fn(),
}));

const mockedUseStockDetailsOwnedStocks = useStockDetailsOwnedStocks as jest.Mock;

describe("Owned Stocks Tests", () => {

    beforeEach(() => {
        mockedUseStockDetailsOwnedStocks.mockReturnValue({
            ownedStocksLoading: false,
            ownedStocks: mockPortfolioStocks,
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
        mockedUseStockDetailsOwnedStocks.mockReturnValue({
            ownedStocksLoading: false,
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

        for (let i = 0; i < mockPortfolioStocks.length; i++) {
            const stock = mockPortfolioStocks[i];

            const row = screen.getByText(stock.name).closest("tr");

            expect(within(row!).getByText(stock.name)).toBeInTheDocument();
            expect(within(row!).getByText(`Quantity: ${stock.quantity}`)).toBeInTheDocument();

            const bought = `£${(stock.purchasePrice * stock.quantity).toFixed(2)}`;
            const current = `£${(stock.currentPrice * stock.quantity).toFixed(2)}`;

            expect(within(row!).getAllByText(bought).length).toBeGreaterThan(0);
            expect(within(row!).getAllByText(current).length).toBeGreaterThan(0);

            const profitLoss = (
                (stock.currentPrice * stock.quantity) -
                (stock.purchasePrice * stock.quantity)
            ).toFixed(2);

            const profitLossElement = within(row!).getByText(`£${profitLoss}`);
            expect(profitLossElement).toBeInTheDocument();


        }
    });
})