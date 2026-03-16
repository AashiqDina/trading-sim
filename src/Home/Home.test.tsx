import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import axios from 'axios';
import { AuthProvider } from '../Functions/AuthContext';
import '@testing-library/jest-dom';
import StockPage from '../StockDetails/StockDetail'
import getTrendingStocksMock from "../Functions/getTrendingStocks";
import getStockPriceMock from "../Functions/getStockPrice";
import getMarketNewsMock from '../Functions/getMarketNews';
import GetStockListMock from '../Functions/getStockList';

const mockedGetTrendingStocks = getTrendingStocksMock as jest.Mock; // for typescript compile time we manually tell typescript these are of type jest.mock so we can change the returned value later
const mockedGetStockPrice = getStockPriceMock as jest.Mock;
const mockedGetMarketNews = getMarketNewsMock as jest.Mock;
const mockedGetStockList = GetStockListMock as jest.Mock;


// Jest Learning
//
// jest.mock mocks import functions returning its calls with a undefined unless specified

jest.mock('axios'); // mocks axios functions to test with edge cases without backend

jest.mock("../Functions/AuthContext", () => {
  const actual = jest.requireActual("../Functions/AuthContext"); // loads the real module
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

jest.mock("focus-trap-react", () => {
  return ({ children }: any) => <div>{children}</div>; // way one since theres only one default function
});

jest.mock("../Functions/getMarketNews", () => ({ // way two of doing it 
  __esModule: true, // since its default
  default: jest.fn() // default: ... since its export default function getMarket news rather than const varName = () => {...}
}));

jest.mock("../Functions/getTrendingStocks", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../Functions/getStockPrice", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../Functions/getStockList", () => ({
  __esModule: true,
  default: jest.fn()
}))

// Get Trending List
describe('Home - GetStockTrendingList edge cases', () => { // describe sets a container of related tests contains a description and a function of tests

    test('handles empty response', async () => { // test creates a test case, taking a string and function as a parameter

        (axios.get as jest.Mock).mockResolvedValueOnce({data: {}}); // this and below are two ways of doing the same thing
        mockedGetTrendingStocks.mockResolvedValueOnce([]); // the choice of which one to use depends on maintainability and how you want to structure your code
        mockedGetStockList.mockResolvedValueOnce({});

        render( // render the application but use a memory router instead of the hashRouter we used in index.tsx since its light weight and doesnt rely on url manipulation
            <MemoryRouter> 
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>

            // the rest is the same structure as with App.tsx, except only render what we need
        );

        await waitFor(() => { // await the async function to finish
            expect(screen.queryByText('No Stocks Current Trending')).toBeInTheDocument(); // check if the screen displays text
        })
    })

    test('handles normal response', async () => {

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "MSFT"]);
        mockedGetStockPrice.mockResolvedValue(123);
        mockedGetStockList.mockResolvedValueOnce({"Apple Inc.": { symbol: "AAPL", logo: "logo" }, "Microsoft Corp.": { symbol: "MSFT", logo: "logo" }});

        render(
            <MemoryRouter initialEntries={['/']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/stock/:symbol" element={<StockPage />} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            const appleStocks = screen.getAllByText('Apple Inc.');
            expect(appleStocks.length).toBe(2);
            const msStocks = screen.getAllByText('Microsoft Corp.');
            expect(msStocks.length).toBe(2);
        })

        fireEvent.click(screen.getAllByText("Apple Inc.")[0]);

        await waitFor(() => {
            expect(screen.getByText('Buy Stock')).toBeInTheDocument();
        })
    })

    test("handles broken response", async () => {
        mockedGetTrendingStocks.mockResolvedValueOnce([null, ""]);
        mockedGetStockList.mockResolvedValueOnce({"Bad Stock": { symbol: "MSFT", logo: null }, "Another Bad": { symbol: "APPL", logo: "" }});

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor(() => {
            const ErrorStock = screen.getAllByText("Error - No Stock Found")
            expect(ErrorStock.length).toBe(4)
        })
    })
    
    test("handles partially broken response", async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Bad Stock": { symbol: null, logo: null },
        }})

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", ""]);
        mockedGetStockList.mockResolvedValueOnce({"Bad Stock": { symbol: null, logo: null }, "Apple Inc.": { symbol: "AAPL", logo: "logo"}});
        mockedGetStockPrice.mockResolvedValue(123);

        render(
            <MemoryRouter initialEntries={['/']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/stock/:symbol" element={<StockPage />}/>
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            const appleStocks = screen.getAllByText('Apple Inc.');
            expect(appleStocks.length).toBe(2);
            const ErrorStock = screen.getAllByText("Error - No Stock Found")
            expect(ErrorStock.length).toBe(2)

        })

        fireEvent.click(screen.getAllByText("Error - No Stock Found")[0]);

        await waitFor(() => {
            const ErrorStock = screen.getAllByText("Error - No Stock Found")
            expect(ErrorStock.length).toBe(2)
        })

        fireEvent.click(screen.getAllByText("Apple Inc.")[0]);

        await waitFor(() => {
            expect(screen.getByText('Buy Stock')).toBeInTheDocument();
        })
    })

    test("handles Loading state", async () => {

        (axios.get as jest.Mock).mockReturnValue(
            new Promise(() => {})
        );

        mockedGetTrendingStocks.mockImplementation(
            () => new Promise(() => {})
        );

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        })

    })

})

// get marketNews
describe("Home - getMarketNews edge cases", () => {
    
    test("handles empty response", async () => {

        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Microsoft Corp.": { symbol: "MSFT", logo: "logo" },
        }});

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "MSFT"]);

        mockedGetMarketNews.mockResolvedValueOnce([])

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('No News Found')).toBeInTheDocument()
        })
    })

    test("handles correct", async () => {

        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Microsoft Corp.": { symbol: "MSFT", logo: "logo" },
        }});

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "MSFT"]);
        mockedGetMarketNews.mockResolvedValueOnce([{ category: "top news", datetime: 1770159420, headline: "TestHeadline1", id: 7573789, image: "ABC", related: "", source: "MarketWatch", summary: "Summary1", url: "https://aashiqdina.github.io/trading-sim/" }, { category: "top news", datetime: 1770159420, headline: "TestHeadline2", id: 7573789, image: "123", related: "", source: "MarketWatch", summary: "Summary2", url: "https://aashiqdina.github.io/ReactCvSiteProject/" }])
    
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor(async () => {
            const headline1 = await screen.findByText("TestHeadline1");
            const headline2 = await screen.findByText("TestHeadline2");

            expect(headline1).toBeInTheDocument();
            expect(headline2).toBeInTheDocument();
            expect(screen.queryByText("Summary1")).toBeInTheDocument()
            expect(screen.queryByText("Summary2")).toBeInTheDocument()
            const links = screen.getAllByRole('link');
            expect(links[0]).toHaveAttribute('href', 'https://aashiqdina.github.io/trading-sim/');
            expect(links[1]).toHaveAttribute('href', 'https://aashiqdina.github.io/ReactCvSiteProject/');

            const images = screen.getAllByRole('img');
            expect(images[0]).toHaveAttribute('src', 'ABC');
            expect(images[1]).toHaveAttribute('src', '123');
        })
    })

    test("handles broken response", async () => {
        
        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Microsoft Corp.": { symbol: "MSFT", logo: "logo" },
        }});

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "MSFT"]);
        mockedGetMarketNews.mockResolvedValueOnce([{ category: null, datetime: null, headline: null, id: null, image: null, related: null, source: null, summary: null, url: null }, { category: null, datetime: null, headline: null, id: null, image: null, related: null, source: null, summary: null, url: null }])
    
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor( () => {
            const headline1 = screen.getAllByText("brokenHeadline")[0];
            const headline2 = screen.getAllByText("brokenHeadline")[1];

            expect(headline1).toBeInTheDocument();
            expect(headline2).toBeInTheDocument();
            const summaries = screen.getAllByText("brokenSummary");
            expect(summaries.length).toBe(2);
            const links = screen.getAllByRole('link');
            expect(links[0]).toHaveAttribute('href', 'brokenURL');
            expect(links[1]).toHaveAttribute('href', 'brokenURL');

            const images = screen.getAllByRole('img');
            expect(images[0]).toHaveAttribute('src', 'brokenSource');
            expect(images[1]).toHaveAttribute('src', 'brokenSource');
        })
    })

    test("handles partially broken response", async () => {
                
        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Microsoft Corp.": { symbol: "MSFT", logo: "logo" },
        }});

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "MSFT"]);
        mockedGetMarketNews.mockResolvedValueOnce([{ category: "top news", datetime: 1770159420, headline: "TestHeadline1", id: 7573789, image: "ABC", related: "", source: "MarketWatch", summary: "Summary1", url: "https://aashiqdina.github.io/trading-sim/" }, { category: null, datetime: null, headline: null, id: null, image: null, related: null, source: null, summary: null, url: null }])
    
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor( () => {
            const headline1 = screen.getAllByText("TestHeadline1")[0];
            const headline2 = screen.getAllByText("brokenHeadline")[0];

            expect(headline1).toBeInTheDocument();
            expect(headline2).toBeInTheDocument();
            const summaries = screen.getAllByText("brokenSummary");
            expect(screen.queryByText("Summary1")).toBeInTheDocument()
            expect(summaries.length).toBe(1);
            const links = screen.getAllByRole('link');
            expect(links[0]).toHaveAttribute('href', 'https://aashiqdina.github.io/trading-sim/');
            expect(links[1]).toHaveAttribute('href', 'brokenURL');

            const images = screen.getAllByRole('img');
            expect(images[0]).toHaveAttribute('src', 'ABC');
            expect(images[1]).toHaveAttribute('src', 'brokenSource');
        })
    })

    test("handles Loading", async () => {

        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Microsoft Corp.": { symbol: "MSFT", logo: "logo" },
        }});

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "MSFT"]);

        mockedGetMarketNews.mockImplementation(
            () => new Promise(() => {})
        )

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        })
    })
    
})

describe("Search functionality - Search Edge Cases", () => {

    test("handle Normal Search Suggestions", async () => {
        mockedGetStockList.mockResolvedValueOnce({"Apple Inc.": { symbol: "AAPL", logo: "logo" }, "Microsoft Corp.": { symbol: "MSFT", logo: "logo" }, "Amazon.com Inc.": {symbol: "AMZN", logo: "logo"}})
        mockedGetTrendingStocks.mockResolvedValueOnce([]) // ensure it doesnt find the stocks in trending stocks
        
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>

        )

        await waitFor(() =>
            expect(mockedGetStockList).toHaveBeenCalled() // testing inputs so have to wait for data to be received from API calls
        );

        const input = screen.getByPlaceholderText(/search by stock name or symbol/i); // get the search bar
        fireEvent.focus(input) // focus on it to get the suggestions to appear
        fireEvent.change(input, { target: {value: 'A'}}) // set value in the search bar to 'A' to test


        const apple = await screen.findByText('Apple Inc.'); // find relevant search results along with their dedicated stock symbols, only need await once since we want the data to be loaded first

        expect(apple).toBeInTheDocument();
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
        expect(screen.getByText('Amazon.com Inc.')).toBeInTheDocument();
        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('AMZN')).toBeInTheDocument();
        expect(screen.queryByText('Microsoft Corp.')).not.toBeInTheDocument();
    })

    test("handles Empty Seatch Suggestions", async () => {
        mockedGetStockList.mockResolvedValueOnce({})
        mockedGetTrendingStocks.mockResolvedValueOnce([])

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        const input = screen.getByPlaceholderText(/search by stock name or symbol/i)
        fireEvent.focus(input)
        fireEvent.change(input, {target: {value: 'A'}})

        await waitFor(() => 
            expect(screen.queryByTestId('SearchSuggestions')).not.toBeInTheDocument()
        )        
    })


})