import { render, screen } from "@testing-library/react"
import '@testing-library/jest-dom';
import QuickStats from "./QuickStats";
import { mockedFullHistory, mockHistoryAll } from "../../../mocks/Portfolio/mockedFullHistory";
import { mockPortfolioStocks } from "../../../mocks/Portfolio/mockPortfolioStocks";
import userEvent from "@testing-library/user-event";

describe("QuickStats Tests", () => {

    test("No Graph Rendered When No History", () => {

        render(
            <QuickStats 
                fullHistory={null} 
                history={null} 
                filterHistory={""} 
                visibleStocks={mockPortfolioStocks} 
                setFilterHistory={jest.fn()}
                setHoverValues={jest.fn()}/>
        )

        expect(screen.queryByText(/Hover to see value/i)).not.toBeInTheDocument()
        expect(screen.getByText(/No Graphing Data Available/i)).toBeInTheDocument()
    })

    test("No Graph Rendered When No Stocks in Portfolio", () => {

        render(
            <QuickStats 
                fullHistory={mockedFullHistory} 
                history={mockHistoryAll} 
                filterHistory={""} 
                visibleStocks={[]} 
                setFilterHistory={jest.fn()}
                setHoverValues={jest.fn()}/>
        )

        expect(screen.queryByText(/Hover to see value/i)).not.toBeInTheDocument()
        expect(screen.getByText(/No Graphing Data Available/i)).toBeInTheDocument()
    })

    test("Renders Correctly", () => {

        render(
            <QuickStats 
                fullHistory={mockedFullHistory} 
                history={mockHistoryAll} 
                filterHistory={"all"} 
                visibleStocks={mockPortfolioStocks} 
                setFilterHistory={jest.fn()}
                setHoverValues={jest.fn()}
            />
        )

        expect(screen.getByText(/Hover to see value/i)).toBeInTheDocument()
        expect(screen.getByRole("img")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /week/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /month/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /year/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();

    })

    test("Switching Filters calls correct function", async () => {

        const switchFilter = jest.fn()

        render(
            <QuickStats 
                fullHistory={mockedFullHistory} 
                history={mockHistoryAll} 
                filterHistory={"all"} 
                visibleStocks={mockPortfolioStocks} 
                setFilterHistory={switchFilter}
                setHoverValues={jest.fn()}
            />
        )

        await userEvent.click(screen.getByRole("button", { name: /week/i}))
        expect(switchFilter).toHaveBeenCalledWith("week")

        await userEvent.click(screen.getByRole("button", { name: /month/i }))
        expect(switchFilter).toHaveBeenCalledWith("month")
    })

})