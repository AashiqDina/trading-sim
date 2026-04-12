import { render, screen } from "@testing-library/react"
import DeletePortfolioStockModal from "./DeletePortfolioStockModal"
import { mockPortfolioStocks } from "../../../mocks/Portfolio/mockPortfolioStocks"
import { mockTransactions } from "../../../mocks/Portfolio/mockTransaction"
import '@testing-library/jest-dom';
import { PriceHistoryEntry, Transaction } from "../../../types/types";
import userEvent from "@testing-library/user-event";

jest.mock("focus-trap-react", () => ({
  __esModule: true,
  FocusTrap: ({ children }: any) => <>{children}</>
}));

describe("Delete Modal - Portfolio Stocks Render Tests", () => {

    test("Nothing renders When stocks is falsey", () => {
        
        render(

            <DeletePortfolioStockModal 
                stocks={[]} 
                toDelete={mockTransactions}
                cancelDelete={jest.fn()} 
                handleTrueDelete={jest.fn()}
            />
        )
        
        expect(screen.queryByText('Are you sure you want to delete?')).not.toBeInTheDocument()

    })

    test("Nothing renders When toDelete is falsey", () => {
        
        render(

            <DeletePortfolioStockModal 
                stocks={mockPortfolioStocks} 
                toDelete={null}
                cancelDelete={jest.fn()} 
                handleTrueDelete={jest.fn()}
            />
        )
        
        expect(screen.queryByText('Are you sure you want to delete?')).not.toBeInTheDocument()

    })

    test("Nothing renders When toDelete is not in stocks", () => {

        const mockPriceHistoryEntry: PriceHistoryEntry[] = Array.from({ length: 20}, (_, i) => ({
            timestamp: `${1680000000 + i * 3600}`,
            price: 100 + i,
            quantity: 5 + i
        }))

        const del: Transaction = {
            id: mockPortfolioStocks[mockPortfolioStocks.length-1].id+1,
            symbol: 'symbol_x',
            purchasePrice: 99,
            quantity: 6,
            portfolioId: 1,
            profitLoss: 12,
            totalValue: 606,
            currentPrice: 101,
            history: mockPriceHistoryEntry
        }
        
        render(

            <DeletePortfolioStockModal 
                stocks={mockPortfolioStocks} 
                toDelete={del}
                cancelDelete={jest.fn()} 
                handleTrueDelete={jest.fn()}
            />
        )
        
        expect(screen.queryByText('Are you sure you want to delete?')).not.toBeInTheDocument()

    })

    test('Renders correctly when data is fine', () => {

        render(

            <DeletePortfolioStockModal 
                stocks={mockPortfolioStocks} 
                toDelete={mockTransactions}
                cancelDelete={jest.fn()} 
                handleTrueDelete={jest.fn()}
            />
        )

        let quantity = mockPortfolioStocks[1].quantity
        let percent = (((mockPortfolioStocks[1].currentPrice/mockPortfolioStocks[1].purchasePrice)*100)-100)

        expect(screen.getByText('Are you sure you want to delete?')).toBeInTheDocument()
        expect(screen.getByText(mockPortfolioStocks[1].name)).toBeInTheDocument()
        expect(screen.getByText( `£${(mockPortfolioStocks[1].purchasePrice*quantity).toFixed(2)}` )).toBeInTheDocument()
        expect(screen.getByText( `£${(mockPortfolioStocks[1].currentPrice*quantity).toFixed(2)}` )).toBeInTheDocument()
        expect(screen.getByText( `£${(mockPortfolioStocks[1].profitLoss).toFixed(2)}` )).toBeInTheDocument()
        expect(screen.getByText( `${percent > 0 ? "+" : "-"}${percent.toFixed(1)}%` )).toBeInTheDocument()
        expect(screen.queryByText(mockPortfolioStocks[0].name)).not.toBeInTheDocument()

    })
})

describe("Delete Modal - Portfolio Stock Button Interaction Tests", () => {

    test("Cancel Button called", async () => {

        let CancelFn = jest.fn()

        render(
            <DeletePortfolioStockModal 
                stocks={mockPortfolioStocks} 
                toDelete={mockTransactions}
                cancelDelete={CancelFn} 
                handleTrueDelete={jest.fn()}
            />
        )

        await userEvent.click(screen.getByRole("button", { name: /Cancel/i}))
        expect(CancelFn).toHaveBeenCalledTimes(1)
    })

    test("Delete Button called", async () => {

        let DeleteFn = jest.fn()

        render(
            <DeletePortfolioStockModal 
                stocks={mockPortfolioStocks} 
                toDelete={mockTransactions}
                cancelDelete={jest.fn()} 
                handleTrueDelete={DeleteFn}
            />
        )

        await userEvent.click(screen.getByRole("button", { name: /Delete/i}))
        expect(DeleteFn).toHaveBeenCalledTimes(1)
    })
})