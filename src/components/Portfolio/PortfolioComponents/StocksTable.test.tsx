import { getByLabelText, render, screen, within } from "@testing-library/react"
import '@testing-library/jest-dom';
import StocksTable from "./StocksTable"
import { mockLastUpdatedPortfolioDictionary, mockTableStocks } from "../../../mocks/Portfolio/mockTableStocks"
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";


describe("Stock Tables Tests", () => {

    test("Table Renders Correctly", async () => {
        
        render(
            <MemoryRouter>
                <StocksTable 
                    LastUpdatedDictionary={mockLastUpdatedPortfolioDictionary} 
                    tableStocks={mockTableStocks} 
                    owner={true} 
                    setFilteredOption={jest.fn()}
                    setSearchInput={jest.fn()}
                    handleDelete={jest.fn()}/>
            </MemoryRouter>
        )

        let rows = screen.getAllByRole("row");

        expect(screen.getByText("Holdings")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter stock/i)).toBeInTheDocument();

        expect(screen.getByText(/best performer/i)).toBeInTheDocument();
        expect(screen.getByText(/worst performer/i)).toBeInTheDocument();

        expect(rows).toHaveLength(4)
        expect(within(rows[1]).getByText("name_0")).toBeInTheDocument();
        expect(within(rows[2]).getByText("name_1")).toBeInTheDocument();
        expect(within(rows[3]).getByText("name_2")).toBeInTheDocument();

        expect(within(rows[1]).getByText("£50.00")).toBeInTheDocument();
        expect(within(rows[1]).getByText("+20.0%")).toBeInTheDocument();

        expect(within(rows[1]).getByText(/1h ago/i)).toBeInTheDocument();

        await userEvent.click(rows[1])
        rows = screen.getAllByRole("row");

        expect(within(rows[2]).getByLabelText("Delete Stock")).toBeInTheDocument()
    })

    test("Clicking Row expands Info an clicking again collapses it", async () => {

        render(
            <MemoryRouter>
                <StocksTable 
                    LastUpdatedDictionary={mockLastUpdatedPortfolioDictionary} 
                    tableStocks={mockTableStocks} 
                    owner={true} 
                    setFilteredOption={jest.fn()}
                    setSearchInput={jest.fn()}
                    handleDelete={jest.fn()}/>
            </MemoryRouter>
        )

        let rows = screen.getAllByRole("row");
        expect(within(rows[1]).getByText("name_0")).toBeInTheDocument();
        expect(within(rows[2]).getByText("name_1")).toBeInTheDocument();

        await userEvent.click(rows[1])
        rows = screen.getAllByRole("row");

        expect(within(rows[1]).getByText("name_0")).toBeInTheDocument();
        expect(within(rows[2]).getByText("name_0")).toBeInTheDocument();

        await userEvent.click(rows[1])
        rows = screen.getAllByRole("row");
        expect(within(rows[1]).getByText("name_0")).toBeInTheDocument();
        expect(within(rows[2]).getByText("name_1")).toBeInTheDocument();

    })

    test("Non-Owners do not have delete stock", async () => {

        render(
            <MemoryRouter>
                <StocksTable 
                    LastUpdatedDictionary={mockLastUpdatedPortfolioDictionary} 
                    tableStocks={mockTableStocks} 
                    owner={false} 
                    setFilteredOption={jest.fn()}
                    setSearchInput={jest.fn()}
                    handleDelete={jest.fn()}/>
            </MemoryRouter>
        )

        var rows = screen.getAllByRole("row");
        await userEvent.click(rows[1])

        rows = screen.getAllByRole("row");

        expect(within(rows[2]).queryByLabelText("Delete Stock")).not.toBeInTheDocument()

    })

    test("Searching calls correct function", async () => {

        const searchFn = jest.fn()

        render(
            <MemoryRouter>
                <StocksTable 
                    LastUpdatedDictionary={mockLastUpdatedPortfolioDictionary} 
                    tableStocks={mockTableStocks} 
                    owner={true} 
                    setFilteredOption={jest.fn()}
                    setSearchInput={searchFn}
                    handleDelete={jest.fn()}/>
            </MemoryRouter>
        )

        await userEvent.type(screen.getByPlaceholderText('Enter stock symbol/name (e.g, AAPL, Apple)'), `1`)

        expect(searchFn).toHaveBeenCalledWith(`1`)
    })

    test("sort by calls SetFiltered", async () => {

        const FilterFn = jest.fn()

        render(
            <MemoryRouter>
                <StocksTable 
                    LastUpdatedDictionary={mockLastUpdatedPortfolioDictionary} 
                    tableStocks={mockTableStocks} 
                    owner={true} 
                    setFilteredOption={FilterFn}
                    setSearchInput={jest.fn()}
                    handleDelete={jest.fn()}/>
            </MemoryRouter>
        )

        await userEvent.selectOptions(screen.getByRole("combobox"), "ProfitDesc");

        expect(FilterFn).toHaveBeenCalledWith("ProfitDesc");
    })

    test("Delete Function Correctly called when clicked", async () => {

        const DelFn = jest.fn()

        render(
            <MemoryRouter>
                <StocksTable 
                    LastUpdatedDictionary={mockLastUpdatedPortfolioDictionary} 
                    tableStocks={mockTableStocks} 
                    owner={true} 
                    setFilteredOption={jest.fn()}
                    setSearchInput={jest.fn()}
                    handleDelete={DelFn}/>
            </MemoryRouter>
        )

        let rows = screen.getAllByRole("row");

        await userEvent.click(rows[1])
        rows = screen.getAllByRole("row");

        await userEvent.click(within(rows[2]).getByLabelText("Delete Stock"))

        expect(DelFn).toHaveBeenCalledWith(mockTableStocks[0].transactions[0])
    })
})