import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../Functions/AuthContext';
import Home from '../Home';
import getTrendingStocksMock from "../../Functions/getTrendingStocks";
import getStockPriceMock from "../../Functions/getStockPrice";
import getMarketNewsMock from '../../Functions/getMarketNews';
import GetStockListMock from '../../Functions/getStockList';
import GetStockHistoryMock from "../../Functions/GetStockHistory";
import StockDetail from '../../StockDetails/StockDetail';
import HomeSearch from './HomeSearch';
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import { mockStockList } from '../../mocks/Home/mockStockList';
import { mockHistory } from '../../mocks/StockDetails/mockHistory';

const mockedGetTrendingStocks = getTrendingStocksMock as jest.Mock; // for typescript compile time we manually tell typescript these are of type jest.mock so we can change the returned value later
const mockedGetStockPrice = getStockPriceMock as jest.Mock;
const mockedGetStockList = GetStockListMock as jest.Mock; // use .default for ES module default export
const mockedGetMarketNews = getMarketNewsMock as jest.Mock;
const mockedGetStockHistory = GetStockHistoryMock as jest.Mock;


jest.mock('axios'); // mocks axios functions to test with edge cases without backend

jest.mock("../../Functions/AuthContext", () => {
  const actual = jest.requireActual("../../Functions/AuthContext"); // loads the real module
  return {
    ...actual, // copies it over here to keep the other functions
    useAuth: () => ({ // useAuth is overridden with what we want it to output so the output of the function useAuth would be a use Obj as specified below
      user: {
        id: 1,
        username: "TestUser",
        investedAmount: 0,
        currentValue: 0,
        profitLoss: 0,
        portfolio: undefined
      }
    })
  };
});

jest.mock("focus-trap-react", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}))

jest.mock("../../Functions/getTrendingStocks", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../Functions/getStockPrice", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../Functions/getStockList", () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock("../../Functions/getMarketNews", () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock("../../Functions/GetStockHistory", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue([]),
}));

jest.mock("../../Functions/getStockName", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue("Apple Inc."),
}));

jest.mock('../../Error/Error', () => () => <div>ErrorMock</div>);

describe("Renders Search input and Button", () => {

    test("Render Input and Button", () => {
        render(<HomeSearch stockList={{}} searchStock={jest.fn()}/>)
        expect(screen.getByPlaceholderText(/search by stock name or symbol/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
    })
    test("Suggestions Not Shown On Render", () => {
        render(<HomeSearch stockList={{}} searchStock={jest.fn()}/>)
        expect(screen.queryByTestId("SearchSuggestions")).not.toBeInTheDocument();
    })
    test("Renders Fine When StockList is Null", () => {
        render(<HomeSearch stockList={null} searchStock={jest.fn()}/>)
        expect(screen.getByPlaceholderText(/search by stock name or symbol/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
    })
})

describe("Search Suggestions and Searhc correctly Work", () => {

    test("Render Suggestions When Typing", async () => {
        render(<HomeSearch stockList={mockStockList} searchStock={jest.fn()}/>)
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        await userEvent.type(input, "a")
        const suggestions = await screen.findAllByRole("option");
        expect(suggestions.length).toBeGreaterThan(0);
    })

    test("Correctly Filtered Suggestions", async () => {
        render(<HomeSearch stockList={mockStockList} searchStock={jest.fn()}/>)
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        await userEvent.type(input, "a")
        const suggestions = await screen.findAllByRole("option");
        const texts = suggestions.map(s => s.textContent);
        expect(texts).toContainEqual(expect.stringContaining("AAPL"));
        expect(texts).toContainEqual(expect.stringContaining("Apple Inc."));
        expect(texts).toContainEqual(expect.stringContaining("AMZN"));
        expect(texts).toContainEqual(expect.stringContaining("Amazon.com Inc"));
        expect(texts).toContainEqual(expect.stringContaining("Advanced Micro Devices"));
        expect(texts).toContainEqual(expect.stringContaining("AMD"));
    })

    test("Correctly Sorted Suggestions", async () => {
        render(<HomeSearch stockList={mockStockList} searchStock={jest.fn()}/>)
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        await userEvent.type(input, "aa")
        const suggestions = await screen.findAllByRole("option");
        expect(suggestions[0]).toHaveTextContent("AA")
        expect(suggestions[0]).toHaveTextContent("Alcoa Corporation");
        expect(suggestions[1]).toHaveTextContent("AAPL");
        expect(suggestions[1]).toHaveTextContent("Apple Inc.");
    })

    test("Clicking Stock Suggestions calls function", async () => {
        const search = jest.fn()
        render(<HomeSearch stockList={mockStockList} searchStock={search}/>)
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        await userEvent.type(input, "aa");
        const suggestions = await screen.findAllByRole("option")
        await userEvent.click(suggestions[0])
        expect(search).toHaveBeenCalledWith("AA");
    })

    test("Clicking search button calls searchStock with input value", async () => {
        const search = jest.fn();
        render(<HomeSearch stockList={mockStockList} searchStock={search}/>);
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        const button = screen.getByRole("button", { name: /search/i });
        await userEvent.type(input, "AAPL");
        await userEvent.click(button);
        expect(search).toHaveBeenCalledWith("AAPL");
        });

    test("Arrow Navigation", async () => {
        render(<HomeSearch stockList={mockStockList} searchStock={jest.fn()}/>)
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        await userEvent.type(input, "a")
        const suggestions = await screen.findAllByRole("option")
        suggestions[0].focus()
        await userEvent.keyboard("{ArrowDown}")
        expect(suggestions[1]).toHaveFocus();
        await userEvent.keyboard("{ArrowDown}")
        expect(suggestions[2]).toHaveFocus();
        await userEvent.keyboard("{ArrowUp}")
        expect(suggestions[1]).toHaveFocus();
        await userEvent.keyboard("{ArrowUp}")
        await userEvent.keyboard("{ArrowUp}")
        expect(input).toHaveFocus();
    })

    test("Enter on Suggestions", async () => {
        const search = jest.fn()
        render(<HomeSearch stockList={mockStockList} searchStock={search}/>)
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        await userEvent.type(input, "aa")
        const suggestions = screen.getAllByRole("option");
        suggestions[0].focus()
        await userEvent.keyboard("{Enter}")
        expect(search).toHaveBeenCalledWith("AA")
    })

    test("Enter on Input", async () => {
        const search = jest.fn()
        render(<HomeSearch stockList={mockStockList} searchStock={search}/>)
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        await userEvent.type(input, "aapl")
        await userEvent.keyboard("{Enter}")
        expect(search).toHaveBeenCalledWith("AAPL")
    })

    test("No Suggestions when Inputs Dont Match", async () => {
        render(<HomeSearch stockList={mockStockList} searchStock={jest.fn()}/>)
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        await userEvent.type(input, "RandomNonsenseThatDoesNotMatchSuggestions")
        expect(screen.queryByRole("option")).not.toBeInTheDocument();
    })

    test("Clearing Input", async () => {
        render(<HomeSearch stockList={mockStockList} searchStock={jest.fn()}/>)
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        await userEvent.type(input, "a")
        await userEvent.clear(input)

        expect(screen.queryByRole("option")).not.toBeInTheDocument();
    })

    test("Case Sensitivity", async () => {
        render(<HomeSearch stockList={mockStockList} searchStock={jest.fn()}/>)
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        await userEvent.type(input, "aapl")
        const suggestion = screen.getAllByRole("option")
        const texts = suggestion.map(s => s.textContent);
        expect(texts).toContainEqual(expect.stringContaining("AAPL"));
    })
})

describe("Search Integration Test", () => {

    beforeEach(() => {
        mockedGetStockList.mockResolvedValue(mockStockList);
        mockedGetTrendingStocks.mockResolvedValue([]);
        mockedGetStockPrice.mockResolvedValue(123.56);
        mockedGetMarketNews.mockResolvedValue([]);
        mockedGetStockHistory.mockResolvedValue(mockHistory);
    });
    
    test("Navigates to Page", async () => {
            

        render(
            <MemoryRouter initialEntries={["/"]}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/stock/:symbol" element={<div>Stock Page</div>} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        )

        const input = await screen.findByPlaceholderText(/search by stock name or symbol/i)
        await userEvent.type(input, "aapl")
        await userEvent.keyboard("{Enter}")
        expect(await screen.findByText("Stock Page")).toBeInTheDocument()
    })

    test("Navigates to Stock Details Page", async () => {
            

        render(
            <MemoryRouter initialEntries={["/"]}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/stock/:symbol" element={<StockDetail/>} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        )

        const input = await screen.findByPlaceholderText(/search by stock name or symbol/i)
        await userEvent.type(input, "aapl")
        await userEvent.keyboard("{Enter}")
        expect(await screen.findByText("Buy Stock")).toBeInTheDocument()
    })
})